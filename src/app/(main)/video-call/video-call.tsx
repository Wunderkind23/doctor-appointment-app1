import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SignalPayload {
  sdp: RTCSessionDescriptionInit;
  caller?: string;
}

let socket: Socket;

export default function VideoCall() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const peers = useRef<Record<string, RTCPeerConnection>>({});
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    socket = io('http://localhost:5000');
    const currentPeers = peers.current;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      socket.emit('join-room');
    });

    socket.on('all-users', (users: string[]) => {
      users.forEach((userId) => {
        createPeer(userId, true);
      });
    });

    socket.on('offer', async ({ sdp, caller }: SignalPayload) => {
      const pc = createPeer(caller!, false);
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { sdp: answer, target: caller });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on('answer', async ({ sdp, caller }: any) => {
      const pc = currentPeers[caller];
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on('ice-candidate', async ({ candidate, caller }: any) => {
      const pc = currentPeers[caller];
      if (pc && candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on('user-joined', (userId: string) => {
      createPeer(userId, false);
    });

    socket.on('user-left', (userId: string) => {
      if (currentPeers[userId]) {
        currentPeers[userId].close();
        delete currentPeers[userId];
      }
      setRemoteStreams((streams) => streams.filter((_, i) => i !== 0));
    });

    return () => {
      socket.disconnect();
      Object.values(currentPeers).forEach((pc) => pc.close());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createPeer = (userId: string, initiator: boolean) => {
    if (peers?.current[userId]) return peers?.current[userId];

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    peers.current[userId] = pc;

    // Add local tracks
    if (localStream) localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    // Remote tracks
    const remoteStream = new MediaStream();
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
      setRemoteStreams((prev) => {
        if (!prev.includes(remoteStream)) return [...prev, remoteStream];
        return prev;
      });
    };

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate)
        socket.emit('ice-candidate', { target: userId, candidate: event.candidate });
    };

    if (initiator) {
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          socket.emit('offer', { sdp: pc.localDescription, target: userId, caller: socket.id });
        });
    }

    return pc;
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '50%' }} />
      {remoteStreams.map((stream, i) => (
        <video
          key={i}
          autoPlay
          playsInline
          style={{ width: '50%' }}
          ref={(v) => {
            if (v) v.srcObject = stream;
          }}
        />
      ))}
    </div>
  );
}
