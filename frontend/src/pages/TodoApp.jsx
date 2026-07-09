import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import FilterBar from '../components/FilterBar';
import { LogOut, CheckSquare } from 'lucide-react';

const TodoApp = () => {
  const { user, logout } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      let url = '/todos';
      if (filter === 'active') url += '?status=false';
      if (filter === 'completed') url += '?status=true';
      
      const res = await axiosClient.get(url);
      setTodos(res.data || []);
    } catch (error) {
      console.error("Failed to fetch todos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [filter]);

  const handleAddTodo = async (data) => {
    try {
      const res = await axiosClient.post('/todos', data);
      if (filter !== 'completed') {
        setTodos([res.data, ...todos]);
      }
    } catch (error) {
      console.error(error);
      alert('Có lỗi khi thêm công việc');
    }
  };

  const handleToggleTodo = async (todo) => {
    try {
      const updatedTodo = {
        title: todo.title,
        description: todo.description,
        is_completed: !todo.is_completed
      };
      const res = await axiosClient.put(`/todos/${todo.id}`, updatedTodo);
      
      // Update local state or refetch based on filter
      if (filter === 'all') {
        setTodos(todos.map(t => t.id === todo.id ? res.data : t));
      } else {
        // If we're in filtered view, toggling might mean removing it from current view
        setTodos(todos.filter(t => t.id !== todo.id));
      }
    } catch (error) {
      console.error(error);
      alert('Có lỗi khi cập nhật công việc');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axiosClient.delete(`/todos/${id}`);
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error(error);
      alert('Có lỗi khi xóa công việc');
    }
  };

  const handleUpdateTodo = async (id, data) => {
    try {
      const res = await axiosClient.put(`/todos/${id}`, data);
      setTodos(todos.map(t => t.id === id ? res.data : t));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Có lỗi khi cập nhật công việc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <CheckSquare size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">TodoApp</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Xin chào, <span className="text-indigo-600">{user?.username}</span></span>
            <button 
              onClick={logout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Đăng xuất"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <TodoForm onAdd={handleAddTodo} />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Danh sách công việc</h2>
          <FilterBar currentFilter={filter} onFilterChange={setFilter} />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
            <div className="text-gray-300 flex justify-center mb-4">
              <CheckSquare size={48} strokeWidth={1} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có công việc nào</h3>
            <p className="text-gray-500 text-sm">Hãy tạo thêm công việc mới để bắt đầu ngày làm việc hiệu quả nhé!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {todos.map(todo => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                onToggle={handleToggleTodo} 
                onDelete={handleDeleteTodo}
                onUpdate={handleUpdateTodo}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TodoApp;
