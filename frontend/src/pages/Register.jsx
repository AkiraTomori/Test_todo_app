import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = yup.object({
  username: yup.string()
    .required('Tên đăng nhập không được để trống')
    .min(3, 'Tên đăng nhập ít nhất 3 ký tự')
    .matches(/^[a-zA-Z0-9]+$/, 'Tên đăng nhập không được chứa ký tự đặc biệt'),
  password: yup.string()
    .required('Mật khẩu không được để trống')
    .min(6, 'Mật khẩu ít nhất 6 ký tự')
    .matches(/[0-9]/, 'Mật khẩu bắt buộc phải chứa ít nhất 1 số'), // Required by user
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Mật khẩu nhập lại không khớp')
    .required('Vui lòng nhập lại mật khẩu')
}).required();

const Register = () => {
  const { register: registerUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data.username, data.password);
      toast.success('Đăng ký thành công!');
      navigate('/todos');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
            <UserPlus size={32} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Tạo Tài Khoản</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
            <input 
              {...register('username')} 
              data-testid="register-username-input"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" 
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input 
              type="password" 
              {...register('password')} 
              data-testid="register-password-input"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" 
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu</label>
            <input 
              type="password" 
              {...register('confirmPassword')} 
              data-testid="register-confirm-password-input"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow" 
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <button 
            type="submit" 
            data-testid="register-submit-btn"
            disabled={isSubmitting}
            className="w-full py-3 px-4 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Đang đăng ký...
              </>
            ) : 'Đăng ký ngay'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Đã có tài khoản? <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
