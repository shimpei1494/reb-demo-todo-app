import { Button, Card, Group, Select, Stack, Textarea, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import type { Todo } from '../../types/todo';

interface AddTodoForm {
  title: string;
  description: string;
  priority: Todo['priority'];
  dueDate: Date | null;
}

interface AddTodoProps {
  addTodo: (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

function AddTodo({ addTodo }: AddTodoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const form = useForm<AddTodoForm>({
    initialValues: {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: null,
    },
    validate: {
      title: (value) => (value.trim().length === 0 ? 'Title is required' : null),
    },
  });

  const handleSubmit = (values: AddTodoForm) => {
    addTodo({
      title: values.title,
      description: values.description,
      priority: values.priority,
      completed: false,
      dueDate: values.dueDate || undefined,
    });

    form.reset();
    setIsExpanded(false);
    notifications.show({
      title: 'Success',
      message: 'Todo added successfully',
      color: 'green',
    });
  };

  if (!isExpanded) {
    return (
      <Card withBorder padding="md" radius="md">
        <Button
          leftSection={<IconPlus size={16} />}
          variant="light"
          fullWidth
          onClick={() => setIsExpanded(true)}
        >
          Add new todo
        </Button>
      </Card>
    );
  }

  return (
    <Card withBorder padding="md" radius="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="Enter todo title"
            required
            {...form.getInputProps('title')}
            autoFocus
          />
          <Textarea
            label="Description"
            placeholder="Enter todo description (optional)"
            {...form.getInputProps('description')}
            autosize
            minRows={2}
          />
          <Group grow>
            <Select
              label="Priority"
              data={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              {...form.getInputProps('priority')}
            />
            <DateInput
              label="Due Date"
              placeholder="Select due date (optional)"
              {...form.getInputProps('dueDate')}
            />
          </Group>
          <Group justify="flex-end">
            <Button
              variant="subtle"
              onClick={() => {
                setIsExpanded(false);
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" leftSection={<IconPlus size={16} />}>
              Add Todo
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}

export default AddTodo;
