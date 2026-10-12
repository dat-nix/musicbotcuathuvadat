const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('stop')
  .setDescription('Stops the music and clears the queue');

const execute = async (interaction, player) => {
  const { guildId, member } = interaction;
  
  if (!member.voice.channel) {
    return interaction.editReply({ content: 'Join a voice channel first.' });
  }
  
  const p = player.nodes.get(guildId);
  
  if (!p) {
    return interaction.editReply({ content: 'No music is currently playing.' });
  }
  if (p.channel?.id !== member.voice.channel.id) {
    return interaction.editReply({ content: 'Join the voice channel where I’m playing to control the music.' });
  }
  
  p.delete();
  const embed = new EmbedBuilder()
    .setTitle('🛑 Stopped')
    .setDescription('Music has been stopped and queue cleared')
    .setColor(0xff0000)
    .setTimestamp();
  
  return interaction.editReply({ embeds: [embed] });
};

module.exports = { data, execute };
