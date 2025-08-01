# Video Calling Web Application

A full-stack video/audio calling web application built with React, Node.js, Express, Socket.IO, and WebRTC.

## Features

✅ **Real-time Video/Audio Calls** - Peer-to-peer communication using WebRTC  
✅ **Room-based System** - Join rooms with unique room IDs  
✅ **Media Controls** - Mute/unmute microphone, turn camera on/off  
✅ **Modern UI** - Beautiful interface built with React and Tailwind CSS  
✅ **Responsive Design** - Works on desktop and mobile devices  
✅ **Connection Status** - Real-time connection state indicators  
✅ **STUN Server** - Uses Google's STUN server for NAT traversal

## Tech Stack

### Frontend

- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time communication
- **WebRTC** - Peer-to-peer video/audio

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.IO** - Real-time signaling server
- **CORS** - Cross-origin resource sharing

## Project Structure

```
video-calling-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RoomJoin.js
│   │   │   ├── VideoCall.js
│   │   │   └── VideoControls.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                 # Node.js backend
│   ├── server.js
│   └── package.json
├── package.json
└── README.md
```

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**

   ```bash
   cd video-calling-app
   ```

2. **Install all dependencies**

   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and frontend development server (port 3000).

### Manual Setup

If you prefer to install dependencies separately:

1. **Install root dependencies**

   ```bash
   npm install
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Install client dependencies**

   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Start the servers**

   ```bash
   # Terminal 1 - Start backend
   cd server
   npm run dev

   # Terminal 2 - Start frontend
   cd client
   npm start
   ```

## Usage

1. **Open the application** in your browser at `http://localhost:3000`

2. **Enter your name** and either:

   - Enter an existing room ID to join
   - Click "Generate" to create a new room

3. **Allow camera and microphone permissions** when prompted

4. **Share the room ID** with others to invite them to the call

5. **Use the controls** to:
   - Mute/unmute your microphone
   - Turn your camera on/off
   - End the call

## WebRTC Configuration

The application uses Google's STUN server for NAT traversal:

```javascript
const rtcConfig = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};
```

### Adding TURN Server

For better connectivity in restrictive networks, you can add a TURN server:

```javascript
const rtcConfig = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
    {
      urls: "turn:your-turn-server.com:3478",
      username: "username",
      credential: "password",
    },
  ],
};
```

## API Endpoints

### Server Health Check

- `GET /health` - Server status and connection info

### Active Rooms

- `GET /rooms` - List of active rooms and participant counts

## Socket.IO Events

### Client to Server

- `join-room` - Join a room
- `leave-room` - Leave a room
- `offer` - Send WebRTC offer
- `answer` - Send WebRTC answer
- `ice-candidate` - Send ICE candidate

### Server to Client

- `user-joined` - New user joined the room
- `user-left` - User left the room
- `room-participants` - Current room participants
- `offer` - Receive WebRTC offer
- `answer` - Receive WebRTC answer
- `ice-candidate` - Receive ICE candidate

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Development

### Available Scripts

```bash
# Root level
npm run dev          # Start both client and server
npm run server       # Start only the server
npm run client       # Start only the client
npm run install-all  # Install all dependencies
npm run build        # Build the React app

# Server
cd server
npm run dev          # Start server with nodemon
npm start            # Start server

# Client
cd client
npm start            # Start React dev server
npm run build        # Build for production
```

### Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
NODE_ENV=development
```

## Troubleshooting

### Common Issues

1. **Camera/Microphone not working**

   - Check browser permissions
   - Ensure HTTPS in production (required for getUserMedia)

2. **Connection issues**

   - Check firewall settings
   - Verify STUN server accessibility
   - Consider adding a TURN server

3. **Socket.IO connection failed**
   - Ensure server is running on port 5000
   - Check CORS configuration

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
DEBUG=socket.io:* npm run dev
```

## Future Enhancements

- [ ] Screen sharing functionality
- [ ] Chat messaging
- [ ] Multiple participants support
- [ ] Recording capabilities
- [ ] Virtual backgrounds
- [ ] Meeting scheduling
- [ ] User authentication

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: This application is designed for development and testing. For production use, consider implementing proper security measures, user authentication, and a TURN server for better connectivity.
