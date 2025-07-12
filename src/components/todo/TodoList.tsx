import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import type { Todo, TodoFilter } from '../../types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
}

function TodoList({ todos, updateTodo, deleteTodo }: TodoListProps) {
  const [filter, setFilter] = useState<TodoFilter>({
    status: 'all',
    searchQuery: '',
  });

  const filteredTodos = todos.filter((todo: Todo) => {
    const matchesStatus =
      filter.status === 'all' ||
      (filter.status === 'completed' && todo.completed) ||
      (filter.status === 'pending' && !todo.completed);

    const matchesSearch =
      !filter.searchQuery ||
      todo.title.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      todo.description?.toLowerCase().includes(filter.searchQuery.toLowerCase());

    const matchesPriority = !filter.priority || todo.priority === filter.priority;

    return matchesStatus && matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search todos..."
            value={filter.searchQuery}
            onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value })}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value as TodoFilter['status'] })}
          className="block px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={filter.priority || ''}
          onChange={(e) =>
            setFilter({ ...filter, priority: e.target.value as TodoFilter['priority'] })
          }
          className="block px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No todos found</div>
      ) : (
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoList;
