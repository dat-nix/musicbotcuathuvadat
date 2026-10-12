const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('platforms')
  .setDescription('Shows supported music platforms');

const execute = async (interaction, player) => {
  const embed = new EmbedBuilder()
    .setTitle('🎵 Supported Music Platforms')
    .setDescription('Use `/play` with a search phrase or track URL; choose a source to narrow the search.')
    .setColor(0x1DB954)
    .addFields(
      { name: '📺 YouTube', value: 'Search or paste a video URL. YouTube radio links are reduced to the video.', inline: true },
      { name: '🔊 SoundCloud', value: 'Search and public track URLs are supported for playback.', inline: true },
      { name: '🎧 Spotify / Apple Music', value: 'Links may provide track metadata; playback requires a playable source and is not streamed from Premium accounts.', inline: true },
    )
    .setTimestamp();
  
  return interaction.editReply({ embeds: [embed] });
};

module.exports = { data, execute };
