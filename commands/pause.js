const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('pause')
  .setDescription('Pauses the music');

const execute = async (interaction, player) => {
  const { guildId, member } = interaction;
  
  if (!member.voice.channel) {
    return interaction.editReply({ content: 'Join a voice channel first.' });
  }
  
  const p = player.nodes.get(guildId);
  
  if (!p || !p.node.isPlaying()) {
    return interaction.editReply({ content: 'No music is currently playing.' });
  }
  if (p.channel?.id !== member.voice.channel.id) {
    return interaction.editReply({ content: 'Join the voice channel where I’m playing to control the music.' });
  }
  
  if (p.node.isPaused()) {
    return interaction.editReply({ content: 'Music is already paused.' });
  }
  
  p.node.pause();
  const embed = new EmbedBuilder()
    .setTitle('⏸️ Paused')
    .setDescription('Music has been paused')
    .setColor(0xffff00)
    .setTimestamp();
  
  return interaction.editReply({ embeds: [embed] });
};

module.exports = { data, execute };
