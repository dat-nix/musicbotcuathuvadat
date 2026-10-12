# Discord Music Bot

Slash-command bot using discord.js and discord-player, with YouTube and SoundCloud playback.

## Start once in the background

```bash
npm run bot:start
npm run bot:status
```

It stays running after the terminal closes, writes output to `bot.log`, and prevents duplicate bot instances. Stop/restart it with:

```bash
npm run bot:stop
npm run bot:start
```

Use `npm start` when you want to run it attached to the terminal and see logs live. Keep only one bot instance running. Background startup is not configured to survive a computer reboot; start it again after reboot with `npm run bot:start`.

## Commands

- `/play query:<search or URL> source:<Automatic | YouTube | SoundCloud>`
- `/pause`, `/resume`, `/skip`, `/stop`, `/queue`, `/volume`
- `/platforms`

See [`FRIEND-GUIDE.md`](./FRIEND-GUIDE.md) for friend-facing instructions and examples.

YouTube radio URLs are normalized to the video itself. Spotify and Apple Music links can provide metadata, but do not provide a bot with access to Premium audio streams.

## Audio quality

YouTube playback requests the best available audio-only stream. A low-latency FFmpeg compressor is enabled to reduce loudness swings between tracks; it cannot make differently mastered recordings perfectly identical. Discord then re-encodes the audio for voice, and the voice channel's bitrate is the main quality limit. In Discord, edit the voice channel and raise **Bitrate** as high as the server allows. The bot logs the channel bitrate when a track starts. Also listen with Discord's noise suppression/audio processing disabled if music sounds muffled.
# musicbotcuathuvadat
