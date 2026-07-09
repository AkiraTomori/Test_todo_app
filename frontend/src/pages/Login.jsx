import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const schema = yup.object({
  username: yup.string().required('Tên đăng nhập không được để trống').min(3, 'Tên đăng nhập ít nhất 3 ký tự'),
  password: yup.string().required('Mật khẩu không được để trống').min(6, 'Mật khẩu ít nhất 6 ký tự'),
}).required();

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      await login(data.username, data.password);
      navigate('/todos');
    } catch (error) {
      alert(error.response?.data?.message || 'Đăng nhập thất bại!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
            <LogIn size={32} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Đăng Nhập</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
            <input 
              {...register('username')} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" 
              placeholder="Nhập tên tài khoản"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
            <input 
              type="password" 
              {...register('password')} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" 
              placeholder="Nhập mật khẩu"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Chưa có tài khoản? <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-semibold">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
