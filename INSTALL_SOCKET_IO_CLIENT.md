# 📦 Install Socket.IO Client Package

## Installation Steps

Run this command in the frontend directory:

```bash
cd frontend
npm install socket.io-client
```

## Verify Installation

After installation, check that `socket.io-client` appears in your `package.json`:

```json
{
  "dependencies": {
    "socket.io-client": "^4.8.1",
    ...
  }
}
```

## Restart Metro Bundler

After installing, restart the Expo development server:

```bash
# Press Ctrl+C to stop the current server
# Then restart with:
npm start
```

## Alternative: Install All Dependencies

If you want to install all missing dependencies at once:

```bash
cd frontend
npm install
```

This will ensure all packages in package.json are installed.
