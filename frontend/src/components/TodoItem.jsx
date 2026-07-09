import React, { useState } from 'react';
import { Trash2, Check, Edit2, X, Save } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const TodoItem = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description || '');

  const handleSave = () => {
    if (!editTitle.trim()) {
      alert('Tên công việc không được để trống!');
      return;
    }
    onUpdate(todo.id, { title: editTitle, description: editDesc });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDesc(todo.description || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-3 p-4 bg-white rounded-xl shadow-sm border border-indigo-200">
        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full text-lg px-3 py-2 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Tên công việc..."
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-20"
          placeholder="Mô tả..."
        />
        <div className="flex justify-end gap-2 mt-1">
          <button onClick={handleCancel} className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md flex items-center gap-1 transition-colors">
            <X size={16} /> Hủy
          </button>
          <button onClick={handleSave} className="px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center gap-1 transition-colors">
            <Save size={16} /> Lưu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={twMerge(
      "group flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md",
      todo.is_completed && "bg-gray-50 opacity-75"
    )}>
      <button 
        onClick={() => onToggle(todo)}
        className={clsx(
          "flex-shrink-0 w-6 h-6 mt-1 rounded-full border-2 flex items-center justify-center transition-colors",
          todo.is_completed 
            ? "bg-green-500 border-green-500 text-white" 
            : "border-gray-300 hover:border-indigo-500 text-transparent"
        )}
      >
        <Check size={14} className={todo.is_completed ? "opacity-100" : "opacity-0 group-hover:opacity-30 group-hover:text-indigo-500"} strokeWidth={3} />
      </button>

      <div className="flex-grow min-w-0">
        <h3 className={clsx(
          "text-lg font-semibold truncate transition-colors",
          todo.is_completed ? "text-gray-400 line-through" : "text-gray-800"
        )}>
          {todo.title}
        </h3>
        {todo.description && (
          <p className={clsx(
            "text-sm mt-1 line-clamp-2",
            todo.is_completed ? "text-gray-400" : "text-gray-600"
          )}>
            {todo.description}
          </p>
        )}
      </div>

      <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setIsEditing(true)}
          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Sửa công việc"
        >
          <Edit2 size={18} />
        </button>
        <button 
          onClick={() => onDelete(todo.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Xóa công việc"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
