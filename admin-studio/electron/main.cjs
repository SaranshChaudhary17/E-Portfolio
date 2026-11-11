const { app, BrowserWindow, shell, globalShortcut } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5791;
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.json': 'application/json',
};

let serverStarted = false;

function serve() {
  if (serverStarted) return Promise.resolve();
  const root = path.join(__dirname, '..', 'dist');
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const cleanUrl = req.url.split('?')[0];
      let filePath = path.join(root, cleanUrl === '/' ? 'index.html' : cleanUrl);

      // SPA fallback
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(root, 'index.html');
      }

      if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        return res.end('Not found');
      }

      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': types[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      });
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(PORT, '127.0.0.1', () => {
      serverStarted = true;
      resolve();
    });
  });
}

function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(600, () => {
      req.destroy();
      resolve(false);
    });
  });
}

const AUTH = /^https:\/\/([a-z0-9-]+\.firebaseapp\.com|accounts\.google\.com)\//;

async function create() {
  const iconPath = path.join(__dirname, '..', 'public', 've_logo.png');

  const w = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1000,
    minHeight: 640,
    title: 'SARANSH.VE',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    backgroundColor: '#ffffff',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  w.once('ready-to-show', () => w.show());

  // Allow F12 or Ctrl+Shift+I to open devtools in any build
  w.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' || (input.control && input.shift && input.key.toLowerCase() === 'i')) {
      w.webContents.toggleDevTools();
      event.preventDefault();
    }
    if (input.key === 'F5' || (input.control && input.key.toLowerCase() === 'r')) {
      w.webContents.reload();
      event.preventDefault();
    }
  });

  w.webContents.setWindowOpenHandler(({ url }) => {
    if (AUTH.test(url)) return { action: 'allow' };
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  w.webContents.on('will-navigate', (e, u) => {
    if (!u.startsWith('http://localhost') && !u.startsWith('http://127.0.0.1')) {
      e.preventDefault();
      if (/^https?:/.test(u)) shell.openExternal(u);
    }
  });

  w.webContents.on('did-fail-load', (e, errorCode, errorDescription, validatedURL) => {
    // Ignore aborted loads (e.g. user reloading or redirecting)
    if (errorCode === -3) return;

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>Connecting to SARANSH-VE…</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #F5F5F2; display: grid; place-items: center; height: 100vh; margin: 0; }
            .card { background: #fff; padding: 36px; border-radius: 20px; border: 1px solid #E8E8E5; text-align: center; max-width: 420px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06); }
            h2 { margin: 12px 0 6px; font-size: 20px; font-weight: 900; letter-spacing: -0.02em; }
            p { color: #777; font-size: 14px; margin: 0 0 20px; line-height: 1.5; }
            .btn { background: #171717; color: #fff; border: none; padding: 10px 24px; border-radius: 999px; font-weight: 600; cursor: pointer; font-size: 14px; transition: .2s; }
            .btn:hover { background: #2457E6; }
            .spinner { width: 28px; height: 28px; border: 3px solid #E8E8E5; border-top-color: #2457E6; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
            @keyframes spin { to { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="spinner"></div>
            <h2>Connecting to SARANSH-VE…</h2>
            <p>Waiting for server. Auto-retrying in <span id="sec">2</span>s…</p>
            <button class="btn" onclick="location.reload()">Retry Now</button>
          </div>
          <script>
            let left = 2;
            const el = document.getElementById('sec');
            const interval = setInterval(() => {
              left--;
              if (el) el.innerText = left;
              if (left <= 0) {
                clearInterval(interval);
                location.reload();
              }
            }, 1000);
          </script>
        </body>
      </html>
    `;
    w.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
  });

  // Check if Vite dev server (port 5173) is active
  const isViteUp = await checkPort(5173);
  if (isViteUp) {
    w.loadURL('http://localhost:5173');
  } else {
    // If Vite dev server is not active, serve the built dist directly!
    const distIndex = path.join(__dirname, '..', 'dist', 'index.html');
    if (fs.existsSync(distIndex)) {
      await serve();
      w.loadURL(`http://127.0.0.1:${PORT}/`);
    } else {
      // Fallback to 5173 which will trigger the retry screen until Vite is started
      w.loadURL('http://localhost:5173');
    }
  }
}

app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
