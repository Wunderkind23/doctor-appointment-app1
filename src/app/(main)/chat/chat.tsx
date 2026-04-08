import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import './chat.css';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';
import { formatTimeFromMs } from '@/lib/helpers';
import { useRouter } from 'next/navigation';
import { useBeginAppointment } from './hooks/useBeginAppointment';
import { handleApiError } from '@/lib/errors/axios';
import { useFinishAppointment } from './hooks/useEndAppointment';
import { BookingAttributeI } from '../doctors/hooks/userCreateBooking';

const SOCKET_SERVER_URL = 'http://localhost:5000';

interface Message {
  id: number;
  userId: number;
  userName: string;
  text: string;
  timestamp: number;
}

interface WhoChatting {
  userName: string;
}

interface WhoJoined {
  userName: string;
}

interface ChatWithBookingProps {
  roomId: number | string | null;
  userType: 'patient' | 'doctor';
}

export default function Chat({ roomId }: ChatWithBookingProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [booking, setBooking] = useState<BookingAttributeI | null>(null);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [connected, setConnected] = useState(false);
  const [typing, setTyping] = useState<string | null>(null);
  const [roomStartTime, setRoomStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [almostEnding, setAlmostEnding] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();
  const router = useRouter();

  const hasSessionStartedRef = useRef(false);
  const hasSessionEndedRef = useRef(false);
  const hasJoinedRoomRef = useRef(false); // NEW: Track if already joined

  const { mutate: beginBooking } = useBeginAppointment();
  const { mutate: finishBooking } = useFinishAppointment();

  const SESSION_DURATION = 15 * 60 * 1000;

  useEffect(() => {
    if (!roomId || !user || hasSessionStartedRef.current) return;

    beginBooking(
      { appointmentId: roomId as number },
      {
        onSuccess: (data) => {
          setBooking(data);
          toast.success('Meeting is now ongoing.');
          hasSessionStartedRef.current = true;
        },
        onError: (error) => {
          handleApiError(error);
          router.push('/appointments');
        },
      }
    );
  }, [roomId, user, beginBooking, router]);

  useEffect(() => {
    if (!roomId || !user || socketRef.current) return;

    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setConnected(true);

      const userId = user?.id;
      if (!userId) {
        toast.error('User Id Missing.');
        return;
      }
      setUserId(userId);

      // Only join room once
      if (!hasJoinedRoomRef.current) {
        hasJoinedRoomRef.current = true;
        socket.emit('chat:join', {
          roomId,
          userId,
          userName: user.role === 'DOCTOR' ? `Dr. ${user.firstName}` : user.firstName,
          booking,
        });
      }
    });

    socket.on('chat:room-start', ({ startTime }) => {
      console.log('Room started at:', startTime);
      setRoomStartTime(startTime);
    });

    socket.on('chat:user-joined', ({ userName }: WhoJoined) => {
      toast.info(`${userName} joined the chat`);
    });

    socket.on('chat:history', (history: Message[]) => {
      console.log('Received chat history:', history.length, 'messages');
      setMessages(history);
    });

    socket.on('chat:message', (message: Message) => {
      console.log('Received message:', message);
      setMessages((prev) => [...prev, message]);
    });

    socket.on('chat:typing', ({ userName }: WhoChatting) => {
      setTyping(userName);
    });

    socket.on('chat:stop-typing', () => {
      setTyping(null);
    });

    socket.on('chat:room-full', () => {
      alert('Room already has a doctor and patient');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    // Cleanup function
    return () => {
      console.log('Cleaning up socket connection');
      socket.off('connect');
      socket.off('chat:room-start');
      socket.off('chat:user-joined');
      socket.off('chat:history');
      socket.off('chat:message');
      socket.off('chat:typing');
      socket.off('chat:stop-typing');
      socket.off('chat:room-full');
      socket.off('disconnect');
      socket.disconnect();
      socketRef.current = null;
      hasJoinedRoomRef.current = false;
    };
  }, [roomId, user, booking]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages]);

  // Timer countdown
  useEffect(() => {
    if (!roomStartTime) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - roomStartTime;
      const remaining = SESSION_DURATION - elapsed;
      setTimeLeft(Math.max(remaining, 0));
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomStartTime]);

  // Session end logic
  useEffect(() => {
    if (!hasSessionStartedRef.current) return;

    if (timeLeft > 0 && timeLeft <= 60000) {
      // 1 minute warning
      setAlmostEnding(true);
    } else if (timeLeft > 60000) {
      setAlmostEnding(false);
    }

    if (timeLeft === 0 && !hasSessionEndedRef.current) {
      hasSessionEndedRef.current = true;

      finishBooking(
        { appointmentId: roomId as number },
        {
          onSuccess: () => {
            toast.success('Session has ended');
            setTimeout(() => {
              router.push(user?.role === 'DOCTOR' ? '/doctor' : '/appointments');
            }, 1000);
          },
          onError: (error) => {
            handleApiError(error);
            router.push('/appointments');
          },
        }
      );
    }
  }, [timeLeft, finishBooking, roomId, router, user]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || !socketRef.current) return;

    socketRef.current.emit('chat:message', {
      roomId,
      text: currentMessage,
      userId: user?.id,
      userName: user?.role === 'DOCTOR' ? `Dr. ${user.firstName}` : user?.firstName,
    });

    socketRef.current.emit('chat:stop-typing', { roomId });
    setCurrentMessage('');
  };

  const handleTyping = () => {
    if (!socketRef.current) return;

    socketRef.current.emit('chat:typing', {
      roomId,
      userName: user?.role === 'DOCTOR' ? `Dr. ${user.firstName}` : user?.firstName,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('chat:stop-typing', { roomId });
    }, 1500);
  };

  return (
    <div
      className={`chat-container border ${almostEnding ? 'border-red-600' : 'border-brand-400'}`}
    >
      {/* HEADER */}
      <div className="chat-header">
        <div>
          <h2>Chat Room</h2>
          <p className="capitalize">
            Logged in as: {user?.role === 'DOCTOR' ? `Dr. ${user?.firstName}` : user?.firstName}
          </p>
        </div>

        <div className="header-info">
          <span className={connected ? 'status-connected' : 'status-disconnected'}>
            {connected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
          <span>{formatTimeFromMs(timeLeft)}</span>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        )}

        {messages.map((msg) => {
          const isOwn = msg.userId === userId;

          return (
            <div key={msg.id} className={`message ${isOwn ? 'own-message' : 'other-message'}`}>
              <div
                className={`message-header flex ${isOwn ? 'ml-auto justify-end' : 'justify-start'}`}
              >
                <p className="message-username capitalize">{msg.userName}</p>
                <p className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</p>
              </div>

              <div className={`message-text ${isOwn ? 'ml-auto' : ''}`}>{msg.text}</div>
            </div>
          );
        })}

        {typing && <div className="typing-indicator my-5">{typing} is typing...</div>}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form onSubmit={sendMessage} className="message-input-form">
        <input
          className="text-white"
          type="text"
          placeholder="Type your message..."
          value={currentMessage}
          onChange={(e) => {
            setCurrentMessage(e.target.value);
            handleTyping();
          }}
          disabled={!connected}
        />

        <button
          className={`border ${almostEnding ? 'border-red-600' : 'border-brand-400'}`}
          type="submit"
          disabled={!connected || !currentMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
