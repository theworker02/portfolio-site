import { spawn } from 'node:child_process';

const processes = [];

function startProcess(command, args) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    env: process.env,
    shell: false,
  });

  processes.push(child);
  child.on('exit', (code) => {
    if (code && code !== 0) {
      stopAll(code);
    }
  });
}

function stopAll(exitCode = 0) {
  processes.forEach((child) => {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  });

  process.exit(exitCode);
}

startProcess(process.execPath, ['--watch', './server/app.js']);
startProcess(process.execPath, ['./node_modules/vite/bin/vite.js']);

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));
