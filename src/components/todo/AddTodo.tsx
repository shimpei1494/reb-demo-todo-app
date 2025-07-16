import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import type { Todo } from '../../types/todo';

interface AddTodoForm {
  title: string;
  description: string;
  priority: Todo['priority'];
  dueDate: string;
}

interface AddTodoProps {
  addTodo: (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

function AddTodo({ addTodo }: AddTodoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [form, setForm] = useState<AddTodoForm>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });
  const [errors, setErrors] = useState<{ title?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.title.trim().length === 0) {
      setErrors({ title: 'Title is required' });
      return;
    }

    addTodo({
      title: form.title,
      description: form.description,
      priority: form.priority,
      completed: false,
      dueDate: form.dueDate ? new Date(form.dueDate) : undefined,
    });

    setForm({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
    });
    setErrors({});
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setForm({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
    });
    setErrors({});
  };

  if (!isExpanded) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
        >
          <IconPlus size={16} />
          <span>Add new todo</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter todo title"
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: undefined });
            }}
            className={`block w-full px-3 py-2 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            // autoFocus
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter todo description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as Todo['priority'] })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <IconPlus size={16} />
            <span>Add Todo</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTodo;
