import AddTodo from '../components/todo/AddTodo';
import TodoList from '../components/todo/TodoList';
import { useTodoContext } from '../context/TodoContext';

function TodoPage() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodoContext();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My TODOs</h2>
      <AddTodo addTodo={addTodo} />
      <TodoList todos={todos} updateTodo={updateTodo} deleteTodo={deleteTodo} />
    </div>
  );
}

export default TodoPage;
