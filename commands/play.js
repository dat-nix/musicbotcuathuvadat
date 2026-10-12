const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play a track or add it to the queue')
  .addStringOption((option) =>
    option
      .setName('query')
      .setDescription('A supported track URL or search phrase')
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('source')
      .setDescription('Choose which service to search')
      .addChoices(
        { name: 'Automatic', value: 'auto' },
        { name: 'YouTube', value: 'youtube' },
        { name: 'SoundCloud', value: 'soundcloud' },
      ),
  );

function canonicalizeYouTubeUrl(query) {
  try {
    const url = new URL(query);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    let videoId = null;

    if (host === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0];
    } else if (host === 'youtube.com' || host === 'music.youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') videoId = url.searchParams.get('v');
      else if (/^\/(shorts|embed|live)\//.test(url.pathname)) {
        videoId = url.pathname.split('/')[2];
      }
    }

    return videoId ? `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}` : query;
  } catch {
    return query;
  }
}

function isDirectUrl(query) {
  try {
    const url = new URL(query);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

async function execute(interaction, player) {
  const voiceChannel = interaction.member.voice?.channel;
  if (!voiceChannel) {
    return interaction.editReply({ content: 'Join a voice channel first.' });
  }

  const existingQueue = player.nodes.get(interaction.guildId);
  if (existingQueue?.channel && existingQueue.channel.id !== voiceChannel.id) {
    return interaction.editReply({ content: `I’m already playing in **${existingQueue.channel.name}**.` });
  }

  const query = canonicalizeYouTubeUrl(interaction.options.getString('query', true).trim());
  const source = interaction.options.getString('source') || 'auto';
  const searchEngine = !isDirectUrl(query) && {
    youtube: 'ext:com.retrouser955.discord-player.discord-player-youtubei',
    soundcloud: 'ext:com.discord-player.soundcloudextractor',
  }[source];
  try {
    const { track, searchResult } = await player.play(voiceChannel, query, {
      ...(searchEngine ? { searchEngine } : {}),
      nodeOptions: {
        metadata: interaction.channel,
        volume: 100,
        defaultFFmpegFilters: ['normalizer'],
        bufferingTimeout: 30_000,
        selfDeaf: true,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 60_000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 10_000,
      },
    });

    const origin = searchResult?.source ? ` · ${searchResult.source}` : '';
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('Added to music queue')
      .setDescription(`[${track.title}](${track.url})${origin}`);
    return interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Music search/play failed:', error);
    return interaction.editReply({
      content: 'I could not find or play that track. Try a public SoundCloud URL or another supported source.',
    });
  }
}

module.exports = { data, execute };
