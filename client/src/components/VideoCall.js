import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import VideoControls from "./VideoControls";

const VideoCall = ({ roomId, userName, onLeaveRoom }) => {
  const [socket, setSocket] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnectionRef = useRef();

  // WebRTC configuration
  const rtcConfig = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
      // Placeholder for TURN server
      // {
      //   urls: 'turn:your-turn-server.com:3478',
      //   username: 'username',
      //   credential: 'password'
      // }
    ],
  };

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Initialize WebRTC
    initializeWebRTC();

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
      cleanupWebRTC();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Socket event handlers
    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("join-room", roomId);
    });

    socket.on("user-joined", (userId) => {
      console.log("User joined:", userId);
      setParticipants((prev) => [...prev, userId]);
      createOffer();
    });

    socket.on("user-left", (userId) => {
      console.log("User left:", userId);
      setParticipants((prev) => prev.filter((id) => id !== userId));
      setRemoteStream(null);
    });

    socket.on("room-participants", (participantIds) => {
      console.log("Room participants:", participantIds);
      setParticipants(participantIds);
      if (participantIds.length > 0) {
        createOffer();
      }
    });

    socket.on("offer", async (data) => {
      console.log("Received offer from:", data.from);
      await handleOffer(data.offer, data.from);
    });

    socket.on("answer", async (data) => {
      console.log("Received answer from:", data.from);
      await handleAnswer(data.answer);
    });

    socket.on("ice-candidate", async (data) => {
      console.log("Received ICE candidate from:", data.from);
      await handleIceCandidate(data.candidate);
    });

    return () => {
      socket.off("connect");
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("room-participants");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [socket, roomId]);

  const initializeWebRTC = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const peerConnection = new RTCPeerConnection(rtcConfig);
      peerConnectionRef.current = peerConnection;

      // Add local stream tracks to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      // Handle incoming tracks
      peerConnection.ontrack = (event) => {
        console.log("Received remote stream");
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          participants.forEach((participantId) => {
            socket.emit("ice-candidate", {
              target: participantId,
              candidate: event.candidate,
            });
          });
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log("Connection state:", peerConnection.connectionState);
        setConnectionStatus(peerConnection.connectionState);

        if (peerConnection.connectionState === "connected") {
          setIsConnected(true);
        } else if (peerConnection.connectionState === "disconnected") {
          setIsConnected(false);
        }
      };
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Error accessing camera/microphone. Please check permissions.");
    }
  };

  const createOffer = async () => {
    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      participants.forEach((participantId) => {
        socket.emit("offer", {
          target: participantId,
          offer: offer,
        });
      });
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  const handleOffer = async (offer, from) => {
    try {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      socket.emit("answer", {
        target: from,
        answer: answer,
      });
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  };

  const handleAnswer = async (answer) => {
    try {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  };

  const handleIceCandidate = async (candidate) => {
    try {
      await peerConnectionRef.current.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
    }
  };

  const cleanupWebRTC = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const leaveCall = () => {
    if (socket) {
      socket.emit("leave-room", roomId);
    }
    cleanupWebRTC();
    onLeaveRoom();
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Room Info */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Room: {roomId}</h2>
            <p className="text-gray-600">Connected as: {userName}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isConnected
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {connectionStatus}
            </div>
            <button onClick={leaveCall} className="btn-danger">
              Leave Call
            </button>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Local Video */}
        <div className="video-container aspect-video">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="video-overlay">
            <p className="font-medium">{userName} (You)</p>
            {isMuted && <span className="ml-2 text-red-400">🔇</span>}
            {!isVideoOn && <span className="ml-2 text-red-400">📹</span>}
          </div>
        </div>

        {/* Remote Video */}
        <div className="video-container aspect-video">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">👤</div>
                <p className="text-lg">Waiting for others to join...</p>
                <p className="text-sm text-gray-400 mt-2">
                  Share room ID:{" "}
                  <span className="font-mono bg-gray-700 px-2 py-1 rounded">
                    {roomId}
                  </span>
                </p>
              </div>
            </div>
          )}
          <div className="video-overlay">
            <p className="font-medium">Remote User</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <VideoControls
        isMuted={isMuted}
        isVideoOn={isVideoOn}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onLeaveCall={leaveCall}
        participants={participants.length}
      />
    </div>
  );
};

export default VideoCall;
