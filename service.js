const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const root = __dirname;
const lockPath = path.join(root, '.bot.lock');
const servicePidPath = path.join(root, '.bot-service.pid');
const logPath = path.join(root, 'bot.log');

function readPid(file) {
  try {
    const value = Number(fs.readFileSync(file, 'utf8').trim());
    return Number.isInteger(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

function alive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === 'EPERM';
  }
}

function currentBotPid() {
  const pid = readPid(lockPath);
  return alive(pid) ? pid : null;
}

async function start() {
  const existingPid = currentBotPid();
  if (existingPid) {
    console.log(`Bot is already running (PID ${existingPid}).`);
    return;
  }

  const output = fs.openSync(logPath, 'a');
  const child = spawn(process.execPath, [path.join(root, 'bot.js')], {
    cwd: root,
    detached: true,
    stdio: ['ignore', output, output],
    env: process.env,
  });
  child.unref();
  fs.closeSync(output);

  for (let attempt = 0; attempt < 30; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const pid = currentBotPid();
    if (pid) {
      fs.writeFileSync(servicePidPath, String(pid));
      console.log(`Bot started (PID ${pid}). Logs: ${logPath}`);
      return;
    }
    if (child.exitCode !== null) break;
  }

  console.error(`Bot did not start. Check ${logPath}`);
  process.exitCode = 1;
}

async function stop() {
  const pid = currentBotPid() || readPid(servicePidPath);
  if (!alive(pid)) {
    fs.rmSync(servicePidPath, { force: true });
    console.log('Bot is not running.');
    return;
  }

  process.kill(pid, 'SIGTERM');
  for (let attempt = 0; attempt < 50 && alive(pid); attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  fs.rmSync(servicePidPath, { force: true });
  console.log(alive(pid) ? `Sent stop signal to PID ${pid}.` : 'Bot stopped.');
}

function status() {
  const pid = currentBotPid();
  if (pid) console.log(`Bot is running (PID ${pid}). Logs: ${logPath}`);
  else console.log('Bot is not running.');
}

const action = process.argv[2];
if (action === 'start') start().catch((error) => { console.error(error); process.exitCode = 1; });
else if (action === 'stop') stop().catch((error) => { console.error(error); process.exitCode = 1; });
else if (action === 'status') status();
else console.error('Usage: node service.js <start|stop|status>');
