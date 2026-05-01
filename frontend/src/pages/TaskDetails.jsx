import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL; // ✅ added

export default function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/api/tasks`, { // ✅ updated
      headers: { Authorization: token }
    }).then(res => {
      const found = res.data.find(t => t._id === id);
      setTask(found);
    });
  }, []);

  if (!task) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>⬅ Back</button>

      <h2>Task Details</h2>

      <p><strong>Title:</strong> {task.title}</p>
      <p><strong>Status:</strong> {task.status}</p>

      {task.dueDate && (
        <p><strong>Due:</strong> {new Date(task.dueDate).toDateString()}</p>
      )}
    </div>
  );
}