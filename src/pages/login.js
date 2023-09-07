import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [userId, setUserId] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/user/login', { userId });
      localStorage.setItem('token', response.data.token);
      router.push('/todo');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='p-4 bg-white rounded shadow'>
        <h1 className='text-2xl mb-4'>Login</h1>
        <input
          type='text'
          placeholder='Enter 4-digit code'
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className='p-2 mb-4 border rounded'
        />
        <button onClick={handleLogin} className='p-2 bg-blue-500 text-white rounded'>
          Login
        </button>
      </div>
    </div>
  );
}
