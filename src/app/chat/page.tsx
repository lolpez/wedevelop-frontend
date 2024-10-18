'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { IUser } from '../models';
import Link from 'next/link';
import { useAuth } from '../../context/auth';

const ChatPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) {
          router.push('/');
          return;
        }
        const { data } = await axios.get<IUser[]>('http://localhost:3001/user')
        setUsers(data);
      } catch (err) {
        alert(err)
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  setTimeout(() => {
    if (window.location.pathname === '/chat'){
      Cookies.remove('authToken');
      router.push('/');
    }
  }, 5000);

  return (
    <div>
      <h1 test-id="title">Welcome, {user?.firstName} {user?.lastName}</h1>
      <button
        test-id="logout-button"
        onClick={() => {
          Cookies.remove('authToken'); // Clear the token on logout
          router.push('/');
        }}
      >
        Logout
      </button>
      <ul>
        {users.map((userToChat) => {
          if (user && user._id !== userToChat._id) {
            return (
              <li className='chat-user' test-id={userToChat.userName} key={userToChat._id}>
                <Link href={`/chat/${userToChat._id}`}>{userToChat.userName}</Link>
              </li>
            )
          }
        })}
      </ul>
    </div>
  );
};
export default ChatPage;
