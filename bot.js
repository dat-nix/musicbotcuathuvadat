const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  Collection,
  MessageFlags,
} = require('discord.js');
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const { YoutubeExtractor } = require('discord-player-youtubei');
const { OpusEncoder: PlayerOpusEncoder, setLibopusProvider } = require('@discord-player/opus');
const { OpusEncoder } = require('@discordjs/opus');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

// Use libopus' supported encoder controls; the auto-selected mediaplex backend
// does not implement the bitrate controls used by discord-player.
setLibopusProvider(OpusEncoder, '@discordjs/opus');

if (!process.env.BOT_TOKEN || !process.env.APPLICATION_ID) {
  throw new Error('Set BOT_TOKEN and APPLICATION_ID in the .env file.');
}

const lockPath = path.join(__dirname, '.bot.lock');
function acquireProcessLock() {
  try {
    fs.writeFileSync(lockPath, String(process.pid), { flag: 'wx' });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    const pid = Number(fs.readFileSync(lockPath, 'utf8').trim());
    if (Number.isInteger(pid) && pid > 0) {
      try {
        process.kill(pid, 0);
        console.error(`Bot is already running (PID ${pid}). Use "npm run bot:stop" first.`);
        process.exit(0);
      } catch (probeError) {
        if (probeError.code !== 'ESRCH') throw probeError;
      }
    }
    fs.rmSync(lockPath, { force: true });
    fs.writeFileSync(lockPath, String(process.pid), { flag: 'wx' });
  }
}

function releaseProcessLock() {
  try {
    if (fs.readFileSync(lockPath, 'utf8').trim() === String(process.pid)) {
      fs.rmSync(lockPath, { force: true });
    }
  } catch {}
}

acquireProcessLock();
process.on('exit', releaseProcessLock);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});
const player = new Player(client);
client.commands = new Collection();

function loadCommands() {
  const commandFiles = fs
    .readdirSync(path.join(__dirname, 'commands'))
    .filter((file) => file.endsWith('.js'));
  const payload = [];

  for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'commands', file));
    if (!command.data || typeof command.execute !== 'function') {
      throw new Error(`Invalid command module: ${file}`);
    }
    client.commands.set(command.data.name, command);
    payload.push(command.data.toJSON());
  }

  return payload;
}

client.once('clientReady', () => {
  console.log(`Logged in as ${client.user.tag}; ready in ${client.guilds.cache.size} server(s).`);
});

client.on('error', (error) => console.error('Discord client error:', error));
player.events.on('error', (_queue, error) => console.error('Music player error:', error));
player.events.on('playerStart', (queue, track) => {
  const bitrate = queue.channel?.bitrate;
  try {
    queue.node.setBitrate('auto');
  } catch (error) {
    console.error('Could not set Opus bitrate:', error.message);
  }
  console.log(`Playing "${track.title}"${bitrate ? `; Opus target follows the ${Math.round(bitrate / 1000)} kbps voice-channel limit` : ''}.`);
  queue.metadata?.send(`▶️ Now playing: **${track.title}**`).catch((error) => {
    console.error('Could not post now-playing message:', error.message);
  });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await interaction.deferReply();
    await command.execute(interaction, player);
  } catch (error) {
    console.error(`/${interaction.commandName} failed:`, error);
    if (error.code === 10062) return; // Discord has already expired this interaction.
    const message = 'That command failed. Check the bot console for details.';
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: message, embeds: [] }).catch(console.error);
    } else {
      await interaction.reply({ content: message, flags: MessageFlags.Ephemeral }).catch(console.error);
    }
  }
});

async function start() {
  await player.extractors.loadMulti(DefaultExtractors);
  await player.extractors.register(YoutubeExtractor);
  console.log(`Loaded ${player.extractors.size} music extractor(s).`);
  console.log(`Audio encoder: ${PlayerOpusEncoder.type}; voice bitrate follows each channel (up to 128 kbps).`);

  const commands = loadCommands();
  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
  await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), { body: commands });
  console.log(`Registered ${commands.length} slash command(s).`);

  await client.login(process.env.BOT_TOKEN);
}

start().catch((error) => {
  console.error('Bot failed to start:', error);
  process.exitCode = 1;
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    console.log(`Received ${signal}; shutting down cleanly.`);
    client.destroy();
    player.destroy().finally(() => process.exit(0));
  });
}
