import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-center min-h-screen bg-gray-700'>
      <h1 className='text-4xl mb-4'>TODO APPS Home Page</h1>
      <div className='flex space-x-4'>
        <Link href='/login'>
          <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
            Login
          </button>
        </Link>
        <Link href='/registration'>
          <button className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'>
            Register
          </button>
        </Link>
      </div>
    </main>
  );
}
