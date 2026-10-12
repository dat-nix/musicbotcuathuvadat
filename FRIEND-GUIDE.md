# Music bot guide

## Getting started

1. Join a voice channel in the Discord server.
2. In a text channel where the bot can read and reply, type `/` and choose one of the music commands below.
3. For `/play`, fill in `query` with a song title or link. Optionally choose `source` (`Automatic`, `YouTube`, or `SoundCloud`).

Examples:

```text
/play query:lofi hip hop source:YouTube
/play query:artist - song name source:SoundCloud
/play query:https://youtu.be/VIDEO_ID source:YouTube
/play query:https://soundcloud.com/artist/track source:SoundCloud
```

The source option can be left as `Automatic`; choose YouTube or SoundCloud when you want to search only that service. Direct URLs are resolved as the exact URL you paste, regardless of the source option. YouTube radio links are treated as their individual video.

## Commands

| Command | What it does |
| --- | --- |
| `/play` | Search for a song or play a supported link. Adds it to the server’s music queue. |
| `/pause` | Pause the current track. |
| `/resume` | Resume a paused track. |
| `/skip` | Skip the current track. |
| `/stop` | Stop playback and clear the queue. |
| `/queue` | Show the current track and upcoming tracks. |
| `/volume percent:<0–100>` | Set this server’s music volume. |
| `/platforms` | Show the available music sources and their limitations. |

Playback controls are limited to people in the same voice channel as the bot. Anyone in that channel can add songs or use the controls.

## If it doesn’t play

- Make sure you’re connected to a voice channel and the bot has **View Channel**, **Connect**, and **Speak** permissions there.
- For YouTube, select `source:YouTube`; for SoundCloud, select `source:SoundCloud`.
- Try a public video/track link or a shorter search phrase. For SoundCloud, use the direct track URL rather than an artist profile URL.
- If the bot is offline, the person hosting it needs to start it again with `npm run bot:start` from the bot folder. Friends do not need to install or run anything.

## Notes

- YouTube and SoundCloud playback are supported.
- A Spotify or Apple Music link can identify a track, but the bot cannot stream audio from a friend’s Premium account.
- Audio quality is limited by Discord voice encoding and the voice channel’s bitrate.
- Never share the bot token. Only the bot host should have access to `.env`.
