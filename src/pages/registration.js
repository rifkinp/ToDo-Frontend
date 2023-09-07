import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Register() {
  const [userId, setUserId] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3000/user/register');
      setUserId(response.data.userId);
      localStorage.setItem('token', response.data.token);
      // alert('Registration successful! your code is' + response.data.userId);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-700'>
      <div className='p-4 bg-white rounded shadow'>
        <h1 className='text-2xl mb-4 text-gray-700'>Register</h1>
        <button onClick={handleRegister} className='p-2 bg-blue-500 text-white rounded'>
          Generate Code
        </button>
        {userId && (
          <div className='mt-4 text-gray-800'>
            <h2>Your Code:</h2>
            <p className='text-lg font-bold'>{userId}</p>
          </div>
        )}
      </div>
      <div>
        <Link href='/'>
          <button className='p-2 m-4 bg-blue-500 text-white rounded'>Home</button>
        </Link>
        <Link href='/login'>
          <button className='p-2 m-4 bg-blue-500 text-white rounded'>Login</button>
        </Link>
      </div>
    </div>
  );
}
