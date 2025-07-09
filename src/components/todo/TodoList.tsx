import { Group, Select, Stack, Text, TextInput } from '@mantine/core';
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
    <Stack gap="md">
      <Group>
        <TextInput
          placeholder="Search todos..."
          leftSection={<IconSearch size={16} />}
          value={filter.searchQuery}
          onChange={(event) => setFilter({ ...filter, searchQuery: event.currentTarget.value })}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Filter by status"
          data={[
            { value: 'all', label: 'All' },
            { value: 'pending', label: 'Pending' },
            { value: 'completed', label: 'Completed' },
          ]}
          value={filter.status}
          onChange={(value) => setFilter({ ...filter, status: value as TodoFilter['status'] })}
        />
        <Select
          placeholder="Filter by priority"
          data={[
            { value: '', label: 'All priorities' },
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
          value={filter.priority || ''}
          onChange={(value) => setFilter({ ...filter, priority: value as TodoFilter['priority'] })}
        />
      </Group>

      {filteredTodos.length === 0 ? (
        <Text ta="center" c="dimmed" py="xl">
          No todos found
        </Text>
      ) : (
        <Stack gap="sm">
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default TodoList;
