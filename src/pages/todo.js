import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import jwtDecode from 'jwt-decode';
import Link from 'next/link';
import { setAuthState, clearAuthState } from '../redux/authSlice';

const initializeAuth = async (dispatch, router) => {
  const storedToken = localStorage.getItem('token');

  if (!storedToken) {
    dispatch(clearAuthState());
    router.push('/login');
    return null;
  }

  try {
    const decodedToken = jwtDecode(storedToken);
    await dispatch(
      setAuthState({
        token: storedToken,
        userId: decodedToken.userId,
        decoded: decodedToken,
      }),
    );
    return storedToken;
  } catch (error) {
    localStorage.removeItem('token');
    dispatch(clearAuthState());
    router.push('/login');
    return null;
  }
};

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { token, userId } = useSelector((state) => state.auth);

  useEffect(() => {
    const initialize = async () => {
      const validToken = await initializeAuth(dispatch, router);
      if (!validToken) return;

      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/todo/${userId}`, {
          headers: { Authorization: `Bearer ${validToken}` },
        });
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [router, userId]);

  const updateTodo = async (id, updatedTask) => {
    try {
      const response = await axios.put(
        'http://localhost:3000/todo/update/',
        { id: id, task: updatedTask },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const updatedTodos = todos.map((todo) => (todo.id === id ? response.data : todo));
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete('http://localhost:3000/todo/delete/', {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };
  const addTodo = async () => {
    if (!newTask || newTask.trim() === '') {
      alert('Task cannot be empty');
      return;
    }

    setIsAdding(true);

    try {
      const response = await axios.post(
        'http://localhost:3000/todo/create',
        { task: newTask, userId: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTodos([...todos, response.data]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const logOut = () => {
    localStorage.removeItem('token');
    dispatch(clearAuthState());
    router.push('/login');
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-700'>
      <Link href='/'>
        <button onClick={logOut} className='p-2 m-4 bg-red-500 text-white rounded'>
          Log out
        </button>
      </Link>
      <div className='flex flex-col items-center justify-center min-h-screen w-1/2 bg-gray-700'>
        <h1 className='text-4xl mb-4'>Your Todo List</h1>
        <input
          className='w-1/2 p-2 mb-4 border rounded text-gray-700'
          type='text'
          placeholder='New Task'
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          onClick={addTodo}
          className='p-2 mb-4 bg-green-500 text-white rounded'
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : 'Add Todo'}
        </button>
        <ul className='w-full max-w-2xl'>
          {isLoading ? (
            <p>Loading...</p>
          ) : todos.length === 0 ? (
            <p>No tasks available</p>
          ) : (
            todos.map((todo) => (
              <li
                key={todo.id}
                className='flex justify-between p-2 mb-2 bg-white rounded text-gray-800'
              >
                <span>{todo.task}</span>
                <div>
                  <button
                    onClick={() => updateTodo(todo.id, prompt('New task:', todo.task))}
                    className='p-1 mr-2 bg-blue-500 text-white rounded'
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className='p-1 bg-red-500 text-white rounded'
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
