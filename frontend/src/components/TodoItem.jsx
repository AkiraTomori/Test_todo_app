import React from 'react';
import { Trash2, Check, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const TodoItem = ({ todo, onToggle, onDelete }) => {
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

      <button 
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Xóa công việc"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default TodoItem;
