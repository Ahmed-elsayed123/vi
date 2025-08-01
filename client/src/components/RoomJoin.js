import React, { useState } from "react";

const RoomJoin = ({ onJoinRoom }) => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(id);
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();

    if (!roomId.trim() || !userName.trim()) {
      alert("Please enter both room ID and your name");
      return;
    }

    setIsJoining(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      onJoinRoom(roomId.trim().toUpperCase(), userName.trim());
      setIsJoining(false);
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Join a Video Call
        </h2>

        <form onSubmit={handleJoinRoom} className="space-y-6">
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Name
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="roomId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Room ID
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter room ID"
                required
              />
              <button
                type="button"
                onClick={generateRoomId}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Generate
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isJoining}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isJoining ? "Joining..." : "Join Room"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have a room ID? Click "Generate" to create a new room.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomJoin;
