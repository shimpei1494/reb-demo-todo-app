import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import SettingsPage from './pages/SettingsPage';
import StatsPage from './pages/StatsPage';
import TodoPage from './pages/TodoPage';
import { TodoProvider } from './context/TodoContext';

function App() {
  return (
    <TodoProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<TodoPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </TodoProvider>
  );
}

export default App;
