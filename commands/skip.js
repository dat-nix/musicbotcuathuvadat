const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Skips the current song');

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
  
  const track = p.currentTrack;
  p.node.skip();
  
  const embed = new EmbedBuilder()
    .setTitle('⏭️ Skipped')
    .setDescription(`Skipped **${track.title}**`)
    .setColor(0xff00ff)
    .setTimestamp();
  
  return interaction.editReply({ embeds: [embed] });
};

module.exports = { data, execute };
