## Discord Music Bot - Quick Setup Guide

### Setup Steps:

1. **Get your bot token and application ID:**
   - Go to https://discord.com/developers/applications
   - Create a new application
   - Go to "Bot" tab → Create Bot
   - Enable the required intents:
     - ✓ Server Members Intent
     - ✓ Message Content Intent (optional but recommended)
   - Copy the Bot Token
   - Go to "OAuth2 → URL Generator"
   - Select "bot" under Scopes
   - Select "Message Content Intent" and "Connect" under Bot Permissions
   - Copy the generated URL and add bot to your server
   - Copy the Application ID from the Overview tab

2. **Configure your bot:**
   ```bash
   cd discord-music-bot
   cp .env.example .env
   nano .env
   ```
   - Paste your Bot Token in `BOT_TOKEN`
   - Paste your Application ID in `APPLICATION_ID`

3. **Run the bot:**
   ```bash
   npm start
   ```

### Available Commands:

- `/play [song name or URL]` - Play music from any supported platform
  - YouTube: `https://www.youtube.com/watch?v=...`
  - Spotify: `[song name]` or `[album name]`
  - SoundCloud: `[song name]`
  - YouTube Music: `[song name]`

### Supported Platforms:

🎵 **YouTube** - Regular YouTube videos and music
🎶 **YouTube Music** - YouTube Music songs and albums  
🎧 **Spotify** - Spotify songs, albums, and playlists
🔊 **SoundCloud** - SoundCloud tracks
🍎 **Apple Music** - Apple Music tracks (with plugin)
🎵 **Deezer** - Deezer music (with plugin)

### Troubleshooting:

- If bot won't connect to voice, ensure Message Content Intent is enabled
- Make sure you're in the same voice channel as the bot
- Check that your bot has permissions to join voice channels
- The bot automatically disconnects when the queue is empty

### Features:

- Multi-platform music playback (YouTube, YouTube Music, Spotify, SoundCloud, Apple Music, Deezer)
- Queue management
- Pause/resume functionality
- Auto-queue next song
- Beautiful Discord embeds
- Auto-disconnect when empty