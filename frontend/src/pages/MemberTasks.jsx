import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function MemberTasks() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/tasks/member/${id}`, {
      headers: { Authorization: token }
    })
    .then(res => setTasks(res.data))
    .catch(err => alert(err.response?.data));
  }, []);

  return (
    <div className="container">
      <button onClick={() => navigate(-1)}>⬅ Back</button>

      <h2>Member Tasks</h2>

      {tasks.length === 0 && <p>No tasks assigned</p>}

      {tasks.map(t => (
        <div key={t._id} className="card">
          <h4>{t.title}</h4>
          <p>Status: {t.status}</p>
          <p>Project: {t.project?.name}</p>

          <p><strong>Current:</strong> {t.progress?.current || "Not updated"}</p>
          <p><strong>Done:</strong> {t.progress?.done || "Not updated"}</p>
        </div>
      ))}
    </div>
  );
}