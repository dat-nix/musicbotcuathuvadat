## Multi-Platform Discord Music Bot

Your Discord music bot is now configured to support multiple music platforms!

### 🎵 Supported Platforms

The bot can play music from:
- **YouTube** - Regular YouTube videos and music
- **YouTube Music** - YouTube Music songs and albums
- **Spotify** - Spotify songs, albums, and playlists
- **SoundCloud** - SoundCloud tracks
- **Apple Music** - Apple Music tracks
- **Deezer** - Deezer music

### 🚀 How to Use

**General Command:**
```
/play [query]
```

The bot automatically detects which platform to use based on your input.

#### Platform Examples:

**YouTube:**
```
/play https://www.youtube.com/watch?v=dQw4w9WgXcQ
/play Numb Linkin Park
```

**YouTube Music:**
```
/play Baby Shark
/play Taylor Swift Shake It Off
```

**Spotify:**
```
/play Shape of You Ed Sheeran
/play Never Gonna Give You Up Rick Astley
/play Spotify playlist name
```

**SoundCloud:**
```
/play Chance the rapper
/play Artist Name - Song Name
```

### 🔧 Additional Commands

- `/pause` - Pause current music
- `/resume` - Resume paused music
- `/skip` - Skip current song
- `/stop` - Stop and clear queue
- `/queue` - Show current queue
- `/platforms` - Show supported platforms

### 📊 Bot Features

- Multi-platform music playback
- Queue management
- Pause/resume functionality
- Auto-queue next song
- Beautiful Discord embeds
- Auto-disconnect when queue is empty
- Voice channel management

### 🎛️ Setup Required

The bot is currently running at:
```bash
/home/datnix/discord-music-bot/
```

To restart the bot after making changes:
```bash
cd discord-music-bot
npm start
```

### 📝 Notes

- The bot automatically manages voice channel connections
- You need to be in the same voice channel as the bot to play music
- Spotify and Apple Music may require API keys for full functionality (optional)
- All platforms work through discord-player's built-in search and extractor system