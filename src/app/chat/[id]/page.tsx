
'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IChat, IUser } from '../../models';
import Link from 'next/link';
import Sender from './sender';
import { useAuth } from '../../../context/auth';
import { IMessage } from '@/app/models/message';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const MessagesPage = ({ params }: { params: { id: string } }) => {
  const recipientUserId = params.id;
  const [chat, setChat] = useState<IChat>();
  const [recipientUser, setRecipientUser] = useState<IUser>();
  const [loading, setLoading] = useState(true);
  const [messageStatus, setMessageStatus] = useState<string>("");
  const { user } = useAuth();
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const { data } = await axios.get<IUser>(`http://localhost:3001/user/${recipientUserId}`);
      setRecipientUser(data);
    } catch (err) {
      alert(err)
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = Cookies.get('authToken');
        if (!token) {
          router.push('/');
          return;
        }
      const { data } = await axios.get<IChat>('http://localhost:3001/message', {
        params: {
          "senderUserId": user?._id,
          recipientUserId
        }
      });
      setChat(data);
    } catch (err) {
      alert(err)
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSent = async (status: string) => {
    setMessageStatus(status);
    await fetchMessages();
  };

  const styleMessage = (message: IMessage) => {
    const text = message.senderUserId === user?._id ? `Me` : recipientUser?.userName;
    return `${text}: ${message.text}`
  }
  
  useEffect(() => {
    fetchUser();
    fetchMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  if (loading) return <p>Loading...</p>;
  
  return (
    <div>
      <Link test-id="back-button" href="/chat">Go back</Link>
      <h1 test-id="title">Chat with {recipientUser?.userName}</h1>
      <ul>
        {chat?.messages?.map((message) => (
          <li className='message' test-id={`message-${message._id}`} key={message._id}>
            <p style={{ whiteSpace: 'pre-line' }}>{styleMessage(message)}</p>
          </li>
        ))}
      </ul>
      <Sender
        recipientUserId={params.id}
        onMessageSent={handleMessageSent}
      ></Sender>
      <label test-id="message-status">
        {messageStatus}
      </label>
    </div>
  )
}

export default MessagesPage;