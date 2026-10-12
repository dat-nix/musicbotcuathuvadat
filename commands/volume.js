const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('volume')
  .setDescription('Set music volume for this server')
  .addIntegerOption((option) =>
    option
      .setName('percent')
      .setDescription('Volume from 0 to 100 percent')
      .setMinValue(0)
      .setMaxValue(100)
      .setRequired(true),
  );

async function execute(interaction, player) {
  const voiceChannel = interaction.member.voice?.channel;
  if (!voiceChannel) {
    return interaction.editReply({ content: 'Join the bot’s voice channel to change volume.' });
  }

  const queue = player.nodes.get(interaction.guildId);
  if (!queue?.currentTrack) {
    return interaction.editReply({ content: 'There is no track playing right now.' });
  }
  if (queue.channel?.id !== voiceChannel.id) {
    return interaction.editReply({ content: 'Join the voice channel where I’m playing to control the music.' });
  }

  const percent = interaction.options.getInteger('percent', true);
  if (!queue.node.setVolume(percent)) {
    return interaction.editReply({ content: 'Volume control is not available at the moment.' });
  }

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle('🔊 Volume changed')
    .setDescription(`Music volume is now **${percent}%**.`);
  return interaction.editReply({ embeds: [embed] });
}

module.exports = { data, execute };
