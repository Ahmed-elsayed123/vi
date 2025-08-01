import React, { useState } from "react";
import RoomJoin from "./components/RoomJoin";
import VideoCall from "./components/VideoCall";

function App() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [userName, setUserName] = useState("");

  const joinRoom = (roomId, name) => {
    setCurrentRoom(roomId);
    setUserName(name);
  };

  const leaveRoom = () => {
    setCurrentRoom(null);
    setUserName("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Video Calling App
          </h1>
          <p className="text-gray-600">
            Connect with others through high-quality video calls
          </p>
        </header>

        {!currentRoom ? (
          <RoomJoin onJoinRoom={joinRoom} />
        ) : (
          <VideoCall
            roomId={currentRoom}
            userName={userName}
            onLeaveRoom={leaveRoom}
          />
        )}
      </div>
    </div>
  );
}

export default App;
