# React Video Client

A React-based web application for video streaming with broadcaster and viewer capabilities, built using the `@video/video-client-web` SDK.

## Features

- Live video broadcasting
- Real-time video playback
- Camera and microphone controls
- Screen sharing capabilities
- Video quality settings
- Viewer authentication
- Time-limited streams

## Prerequisites

- Node.js (v16 or higher)
- NPM or Yarn
- Access to the `@video/video-client-web` SDK 

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
BACKEND_ENDPOINT= https://platform.nativeframe.com 
PROJECT_ID=your_project_id (This can be found at platform.nativeframe.com, from the Projects page select the project you want to use, the ID is avaiable in the top right corner of the page.)
SERVICE_ACCOUNT_JWT=your_jwt (This can be found at platform.nativeframe.com, from the Project page select the project you want to use, then select API keys, you can either create a new JWK key and generate a JWT or use an existing one.)
KID=your_kid (This can be found at platform.nativeframe.com, from the Project page select the project you want to use, then select API keys, the KID is available to be copied from the JWK row, ensure you have selected the KID that matches the JWT you are using.)
```

4. Configure the NPM registry for `@video` packages by adding the following to your `.npmrc`:
```npmrc
@video:registry=https://npm.nativeframe.com
```

## Usage

Start both the client and server:
```bash
npm start
```

This will concurrently run:
- React frontend on `http://localhost:3000`
- Express backend on `http://localhost:3001`

## Key Components

## Project Structure

- `/src` - React frontend application
  - `/components` - React components for Encoder and Player
  - `/hooks` - Custom React hooks for video client functionality
  - `/utils` - Utility functions and API calls
- `/server` - Express backend server
  - `/utils` - Server-side utilities for stream management and authentication


### Broadcaster (Encoder)
The Encoder component provides broadcasting capabilities with:
- Camera/microphone controls
- Screen sharing
- Quality settings
- Broadcast controls

### Viewer (ManifestPlayer)
The ManifestPlayer component offers viewing capabilities with:
- Playback controls
- Volume controls
- Quality selection
- Fullscreen mode

## API Endpoints

### Streams
- `POST /api/streams/create` - Create a new stream
- `GET /api/streams/active` - Get active stream ID
- `GET /api/streams/:streamId/manifest` - Get stream manifest URL

### Authentication
- `POST /api/auth/broadcaster` - Get broadcaster token
- `POST /api/auth/viewer` - Get viewer token



### Webhook demo

### Setting up FRP (Fast Reverse Proxy)

To expose your local development server to the internet, you'll need to set up FRP. Follow these steps:

1. **Install FRP Client**
   - Download the latest FRPC version for your platform from the [FRP GitHub Releases page](https://github.com/fatedier/frp/releases)
   - Alternatively, you can use the FRPC Docker container through Docker Desktop

2. **Configure FRP Client**
   Create or edit `frpc.toml` with the following configuration:

   ```toml
   serverAddr = "frp.livelyvideo.tv"
   serverPort = 7000
   loginFailExit = false

   # Authentication 
   auth.method = "token"
   auth.token = "L1v3lyD3v"

   [[proxies]]
   name = "webhook-demo"                
   type = "http"                      # Protocol type
   localIP = "127.0.0.1"              # Local service IP
   localPort = 3001                   # Local service port
   subdomain = "webhook-demo"         # Your subdomain (e.g., https://webhook-demo.frp.livelyvideo.tv/api)
   ```

3. **Start FRP Client**
   ```bash
   ./frpc -c ./frpc.toml
   ```

### Configuring Webhooks with FRP

To set up webhooks using your FRP URL:

1. Navigate to [NativeFrame Platform](https://platform.nativeframe.com/organizations)
2. Select your project
3. Go to Event Webhooks → program-states
4. Click "Create Webhook"
5. Set the webhook URL to: `https://webhook-demo.frp.livelyvideo.tv/api/webhook/updateProgramStates`
6. Click "Create Webhook"

Your service will now receive webhook events through the FRP tunnel.

### Webhook Demo

This demo provides a real-time program state management system that integrates with the NativeFrame Platform. Here's how to set it up and use it:

#### Setup Steps
1. Start your application (`npm start`)
2. Navigate to `http://localhost:3000/program-state`
3. Create a stream on the NativeFrame Platform with webhooks enabled
4. Configure the webhook URL in your NativeFrame project settings
5. Begin broadcasting your stream from the NativeFrame Project Ui.
6. Open the NativeFrame Project Ui in another browser and begin viewing it.
7. Watch the program state update in real-time on the program state page

#### Features

1. **Stream Management**
   - Monitor active streams and their status
   - Start/Stop individual streams
   - View connected viewers for each stream

2. **Viewer Control**
   - Start/Stop individual viewers
   - Monitor viewer states in real-time
   - Track viewer connections and disconnections

3. **State Monitoring**
   - Real-time webhook request/response monitoring
   - Live stream state updates
   - Viewer state tracking
   - Raw webhook data visualization

The demo automatically cleans up inactive streams and viewers after 10 seconds of inactivity.


### Webhook Token Player
The Player component provides a simpler way to view streams using a token-based authentication system:
- Navigate to `http://localhost:3000/player` route
- Enter your token in the input field
- Click Submit to start viewing the stream


## Notes

- This is a development setup and may require additional security measures for production
- Ensure proper error handling and user feedback in production environments
