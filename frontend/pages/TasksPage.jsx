import { useEffect, useState } from 'react';
import { api } from '../services/api';
import PageHeader from '../components/PageHeader';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.tasks().then((data) => setTasks(data.tasks));
  }, []);

  return (
    <>
      <PageHeader
        title="Task Manager"
        description="Authenticated task tracking with priorities and due dates."
      />
      <div className="card">
        <h3>Your tasks</h3>
        <p className="value">{tasks.length}</p>
      </div>
    </>
  );
}
