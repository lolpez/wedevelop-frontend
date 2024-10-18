'use client'; // This component needs to run client-side
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { decode } from 'jsonwebtoken';
import { useAuth } from '../context/auth';
import { IUser } from './models';

export default function Home() {
  const router = useRouter();
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { status, data } = await axios.post('http://localhost:3001/login', { userName, password });

      if (status === 200) {
        const decoded = decode(data.accessToken) as IUser;
        setUser(decoded);
        Cookies.set('authToken', data.accessToken, { expires: 1 });
        router.push('/chat');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      <h2 test-id="title">Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            test-id="username"
            type="text"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            test-id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button test-id="login-button" type="submit">
          Login
        </button>
        <label test-id="error-message">
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </label>
      </form>
    </div>
  );
}








  

  

  

