import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL; // ✅ ADD THIS

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const getUser = () => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const user = getUser();

  useEffect(() => {
    if (!token) window.location.href = "/";
  }, []);

  useEffect(() => {
    const headers = { Authorization: token };

    const taskAPI =
      user?.role === "Admin"
        ? `${API}/api/tasks/all`
        : `${API}/api/tasks`;

    axios.get(taskAPI, { headers }).then(res => setTasks(res.data));

    axios.get(`${API}/api/projects`, { headers })
      .then(res => setProjects(res.data));

    axios.get(`${API}/api/tasks/leaderboard`, { headers })
      .then(res => setLeaderboard(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/projects")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Projects
          </button>

          <button
            onClick={() => navigate("/create-task")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Create Task
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Logout
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-6">
        Role: <span className="font-semibold">{user?.role}</span>
      </p>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>

        <div className="grid md:grid-cols-3 gap-5">
          {projects.map(p => (
            <div key={p._id} className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold text-lg">{p.name}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>

        {tasks.length === 0 && (
          <p className="text-gray-400">No tasks available</p>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          {tasks.map(t => {
            const isDone = t.progress === 100;

            return (
              <div key={t._id} className="bg-white p-5 rounded-xl shadow">

                <h3 className="font-semibold text-lg">{t.title}</h3>

                <p className="text-gray-500 text-sm mt-1">
                  {t.project?.name}
                </p>

                <p className="text-gray-500 text-sm">
                  Assigned: {t.assignedTo?.name}
                </p>

                <p className="text-gray-500 text-sm">
                  Deadline: {new Date(t.dueDate).toLocaleDateString()}
                </p>

                <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                  isDone
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}>
                  {isDone ? "Completed" : "In Progress"}
                </span>

                <div className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{t.progress}%</span>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded mt-1">
                    <div
                      className={`h-2 rounded ${
                        isDone ? "bg-green-500" : "bg-indigo-500"
                      }`}
                      style={{ width: `${t.progress}%` }}
                    />
                  </div>
                </div>

                {t.assignedTo?._id === user?.id && (
                  <Link to={`/progress/${t._id}`}>
                    <button className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded">
                      Update
                    </button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">🏆 Member Performance</h2>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-center">

            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-3">Rank</th>
                <th>Name</th>
                <th>Done</th>
                <th>Pending</th>
                <th>Overdue</th>
                <th>Score</th>
              </tr>
            </thead>

            <tbody>
              {leaderboard.map((m, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    {i === 0 ? "🥇" :
                     i === 1 ? "🥈" :
                     i === 2 ? "🥉" : i + 1}
                  </td>
                  <td>{m.name}</td>
                  <td>{m.completed}</td>
                  <td>{m.pending}</td>
                  <td>{m.overdue}</td>
                  <td className="font-bold">{m.score}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}