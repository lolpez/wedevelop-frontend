'use client';
import axios from 'axios';
import { useAuth } from '../../../context/auth';
import { useState } from 'react';

interface SenderProps {
  recipientUserId: string;
  onMessageSent: (status: string) => void; 
}

const Sender: React.FC<SenderProps> = ({ recipientUserId, onMessageSent }) => {
  const [text, setText] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { status } = await axios.post('http://localhost:3001/message', {
        senderUserId: user?._id,
        recipientUserId,
        text,
      });
      if (status === 201) {
        setText('');
        onMessageSent('Message sent successfully!');
      } else {
        onMessageSent('Failed to send the message.');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      onMessageSent('An error occurred while sending the message.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            test-id="message"
            type='text'
            placeholder="Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <button test-id="send-button" type="submit">
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default Sender;