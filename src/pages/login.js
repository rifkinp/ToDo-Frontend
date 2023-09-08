import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [userId, setUserId] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://to-do-backend-gamma.vercel.app/user/login', { userId });
      localStorage.setItem('token', response.data.token);
      router.push('/todo');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Code not found, Login failed!');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-700'>
      <div className='p-4 bg-white rounded shadow'>
        <h1 className='text-2xl mb-4 text-gray-700'>Login</h1>
        <input
          type='text'
          placeholder='Enter 4-digit code'
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className='p-2 mb-4 border rounded text-gray-700'
        />
        <button onClick={handleLogin} className='p-2 bg-blue-500 text-white rounded'>
          Login
        </button>
      </div>
      <Link href='/'>
        <button className='p-2 m-4 bg-blue-500 text-white rounded'>Home</button>
      </Link>
    </div>
  );
}
