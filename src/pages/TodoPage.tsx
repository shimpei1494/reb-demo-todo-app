import { Stack, Title } from '@mantine/core';
import AddTodo from '../components/todo/AddTodo';
import TodoList from '../components/todo/TodoList';
import { useTodoContext } from '../context/TodoContext';

function TodoPage() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodoContext();

  return (
    <Stack gap="lg">
      <Title order={2}>My TODOs</Title>
      <AddTodo addTodo={addTodo} />
      <TodoList 
        todos={todos}
        updateTodo={updateTodo}
        deleteTodo={deleteTodo}
      />
    </Stack>
  );
}

export default TodoPage;
