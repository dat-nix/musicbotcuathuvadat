const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('resume')
  .setDescription('Resumes the music');

const execute = async (interaction, player) => {
  const { guildId, member } = interaction;
  
  if (!member.voice.channel) {
    return interaction.editReply({ content: 'Join a voice channel first.' });
  }
  
  const p = player.nodes.get(guildId);
  
  if (!p || !p.currentTrack) {
    return interaction.editReply({ content: 'No music is currently playing.' });
  }
  if (p.channel?.id !== member.voice.channel.id) {
    return interaction.editReply({ content: 'Join the voice channel where I’m playing to control the music.' });
  }
  
  if (!p.node.isPaused()) {
    return interaction.editReply({ content: 'Music is already playing.' });
  }
  
  if (!p.node.resume()) {
    return interaction.editReply({ content: 'I could not resume the current track. Try `/play` again.' });
  }
  const embed = new EmbedBuilder()
    .setTitle('▶️ Resumed')
    .setDescription('Music has been resumed')
    .setColor(0x00ff00)
    .setTimestamp();
  
  return interaction.editReply({ embeds: [embed] });
};

module.exports = { data, execute };
