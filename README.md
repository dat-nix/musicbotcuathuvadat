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

YouTube playback requests the best available audio-only stream. FFmpeg EQ/compression/normalization filters are off to avoid extra processing; the bot keeps volume control and uses libopus at the voice channel's bitrate. This still requires one encode for Discord voice. Source mastering can make songs differ in loudness, and this configuration intentionally avoids dynamic normalization. The bot logs the selected channel limit at track start. Disable Discord noise suppression/audio processing when listening to music.
# musicbotcuathuvadat
