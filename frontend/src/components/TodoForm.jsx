import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Plus, Loader2 } from 'lucide-react';

const schema = yup.object({
  title: yup.string()
    .required('Tên công việc không được để trống')
    .trim('Không được nhập toàn khoảng trắng')
    .min(2, 'Nhập ít nhất 2 ký tự')
    .max(200, 'Tên công việc quá dài'),
  description: yup.string()
    .trim('Không được nhập toàn khoảng trắng')
    .max(500, 'Mô tả quá dài')
}).required();

const TodoForm = ({ onAdd }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    await onAdd(data);
    reset();
    setIsExpanded(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6 transition-all">
      <div className="flex flex-col gap-3">
        <div>
          <input 
            {...register('title')} 
            data-testid="todo-title-input"
            placeholder="Thêm công việc mới..." 
            className="w-full text-lg px-4 py-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            onClick={() => setIsExpanded(true)}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1 ml-1">{errors.title.message}</p>}
        </div>

        {isExpanded && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <textarea
              {...register('description')}
              data-testid="todo-desc-input"
              placeholder="Mô tả chi tiết (không bắt buộc)"
              className="w-full px-4 py-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none h-24"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1 ml-1">{errors.description.message}</p>}
            
            <div className="flex justify-end gap-2 mt-3">
              <button 
                type="button" 
                onClick={() => { setIsExpanded(false); reset(); }}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Hủy
              </button>
              <button 
                type="submit" 
                data-testid="todo-submit-btn"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                {isSubmitting ? 'Đang thêm...' : 'Thêm việc'}
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default TodoForm;
