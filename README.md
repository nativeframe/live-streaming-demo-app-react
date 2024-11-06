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


## Notes

- This is a development setup and may require additional security measures for production
- Ensure proper error handling and user feedback in production environments
