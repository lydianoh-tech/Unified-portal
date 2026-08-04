import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function TasksPage() {
  const [tasks, setTasks] = useState<unknown[]>([]);

  useEffect(() => {
    void api.tasks().then((data) => setTasks(data.tasks));
  }, []);

  return (
    <>
      <header className="page-header">
        <h1>Task Manager</h1>
        <p>Authenticated task tracking with priorities and due dates.</p>
      </header>
      <div className="card">
        <h3>Your tasks</h3>
        <p className="value">{tasks.length}</p>
      </div>
    </>
  );
}
