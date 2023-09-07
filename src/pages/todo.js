import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import jwtDecode from 'jwt-decode';
import Link from 'next/link';

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      jwtDecode(token);
    } catch (error) {
      localStorage.removeItem('token');
      router.push('/login');
      return;
    }

    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/todo', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/todo',
        { task: newTask },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        },
      );
      setTodos([...todos, response.data]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const logOut = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-700'>
      <Link href='/' className='flex flex-col justify-end'>
        <button onClick={logOut} className='p-2 m-4 bg-red-500 text-white rounded'>
          Log out
        </button>
      </Link>
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-700'>
        <h1 className='text-4xl mb-4'>Your Todo List</h1>
        <input
          type='text'
          placeholder='New Task'
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className='p-2 mb-4 border rounded'
        />
        <button onClick={addTodo} className='p-2 mb-4 bg-green-500 text-white rounded'>
          Add Todo
        </button>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.task}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
