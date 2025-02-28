import {useNotification} from '@/lib/providers/notifications/useNotification';
import {useState} from 'react';
import {Button} from './ui';

export const NotificationSubscriptionForm = () => {
  const {subscription} = useNotification();

  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('/notifications');

  const sendNotification = async () => {
    await fetch('/api/web-push/send', {
      method: 'POST',
      body: JSON.stringify({title, message, subscription, data: {url}}),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setMessage('');
    setTitle('');
    // Keep the URL as is for convenience in testing
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Send a Notification</h2>

      {/* Title Input */}
      <input
        type="text"
        placeholder="Notification Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
      />

      {/* Message Input */}
      <textarea
        placeholder="Notification Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
      />

      {/* URL Input */}
      <input
        type="text"
        placeholder="Redirect URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
      />

      <Button className="text-black" onClick={() => sendNotification()}>
        Send Notification
      </Button>
    </div>
  );
};
