import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import FilterBar from '../components/FilterBar';
import { LogOut, CheckSquare, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const TodoApp = () => {
  const { user, logout } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/todos');
      setTodos(res.data || []);
    } catch (error) {
      console.error("Failed to fetch todos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []); // Only fetch on mount

  // Lọc Todo tại Frontend
  const displayedTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.is_completed;
    if (filter === 'completed') return todo.is_completed;
    return true;
  });

  const handleAddTodo = async (data) => {
    try {
      const res = await axiosClient.post('/todos', data);
      // Luôn thêm vào mảng gốc, việc hiển thị hay ẩn ở tab nào sẽ do displayedTodos quyết định
      setTodos([res.data, ...todos]);
      toast.success('Đã thêm công việc mới!');
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi khi thêm công việc');
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
      
      // Luôn cập nhật state gốc, mảng hiển thị (displayedTodos) sẽ tự động ẩn đi dựa theo filter
      setTodos(todos.map(t => t.id === todo.id ? res.data : t));
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi khi cập nhật trạng thái');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axiosClient.delete(`/todos/${id}`);
      setTodos(todos.filter(t => t.id !== id));
      toast.success('Đã xóa công việc');
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi khi xóa công việc');
    }
  };

  const handleUpdateTodo = async (id, data) => {
    try {
      const res = await axiosClient.put(`/todos/${id}`, data);
      setTodos(todos.map(t => t.id === id ? res.data : t));
      toast.success('Đã lưu thay đổi!');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Có lỗi khi cập nhật công việc');
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
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        ) : displayedTodos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
            <div className="text-gray-300 flex justify-center mb-4">
              <CheckSquare size={48} strokeWidth={1} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có công việc nào</h3>
            <p className="text-gray-500 text-sm">Hãy tạo thêm công việc mới để bắt đầu ngày làm việc hiệu quả nhé!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {displayedTodos.map(todo => (
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
