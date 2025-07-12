import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useState } from 'react';
import type { Todo } from '../../types/todo';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleToggle = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  const getPriorityClasses = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div className="flex-1 min-w-0">
            <h3
              className={`text-base font-medium ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {todo.title}
            </h3>
            {todo.description && (
              <p className={`text-sm text-gray-600 mt-1 ${todo.completed ? 'line-through' : ''}`}>
                {todo.description}
              </p>
            )}
            <div className="flex items-center space-x-2 mt-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityClasses(
                  todo.priority,
                )}`}
              >
                {todo.priority}
              </span>
              <span className="text-xs text-gray-500">
                Created: {format(new Date(todo.createdAt), 'MMM dd, yyyy')}
              </span>
              {todo.dueDate && (
                <span className="text-xs text-gray-500">
                  Due: {format(new Date(todo.dueDate), 'MMM dd, yyyy')}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            <IconDots size={16} />
          </button>
          {showMenu && (
            <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
              <div className="py-1">
                <button
                  type="button"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <IconEdit size={14} className="mr-2" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(todo.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                >
                  <IconTrash size={14} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoItem;
