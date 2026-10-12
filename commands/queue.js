const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('queue')
  .setDescription('Shows the current queue');

const execute = async (interaction, player) => {
  const { guildId } = interaction;
  
  const p = player.nodes.get(guildId);
  
  if (!p || !p.currentTrack) {
    return interaction.editReply({ content: 'No music is currently playing.' });
  }
  
  const track = p.currentTrack;
  const upcoming = Array.from(p.tracks);
  
  let description = `🎶 **Now Playing:** ${track.title}\n\n`;
  description += `📋 **Up Next:**\n`;
  
  upcoming.slice(0, 10).forEach((t, i) => {
    description += `${i + 1}. **${t.title}** - ${t.duration}\n`;
  });
  
  if (upcoming.length > 10) {
    description += `\n...and ${upcoming.length - 10} more songs`;
  }
  
  const embed = new EmbedBuilder()
    .setTitle('📋 Queue')
    .setDescription(description)
    .setColor(0x00ffff)
    .setTimestamp();
  
  return interaction.editReply({ embeds: [embed] });
};

module.exports = { data, execute };
