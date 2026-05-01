import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTask() {
  const [title, setTitle] = useState("");
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [dueDate, setDueDate] = useState(""); // 🔥 NEW

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // 🔐 Check Admin
  useEffect(() => {
    try {
      const user = JSON.parse(atob(token.split(".")[1]));
      if (user.role !== "Admin") {
        alert("Only Admin allowed");
        navigate("/dashboard");
      }
    } catch {
      navigate("/");
    }
  }, []);

  // 📡 Fetch projects & members
  useEffect(() => {
    const headers = { Authorization: token };

    axios.get("http://localhost:5000/api/projects", { headers })
      .then(res => setProjects(res.data))
      .catch(() => alert("Failed to load projects"));

    axios.get("http://localhost:5000/api/users/members", { headers })
      .then(res => setMembers(res.data))
      .catch(() => alert("Failed to load members"));

  }, []);

  // 🚀 Create Task
  const createTask = async () => {
    if (!title || !selectedProject || !selectedMember || !dueDate) {
      return alert("Please fill all fields");
    }

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        {
          title,
          project: selectedProject,
          assignedTo: selectedMember,
          dueDate
        },
        { headers: { Authorization: token } }
      );

      alert("Task Created Successfully");
      navigate("/dashboard");

    } catch (err) {
      alert(err.response?.data || "Task creation failed");
    }
  };

  return (
    <div className="container">
      <h2>Create Task</h2>

      {/* TITLE */}
      <input
        placeholder="Task Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <br /><br />

      {/* PROJECT */}
      <select
        value={selectedProject}
        onChange={e => setSelectedProject(e.target.value)}
      >
        <option value="">Select Project</option>
        {projects.map(p => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      <br /><br />

      {/* MEMBER */}
      <select
        value={selectedMember}
        onChange={e => setSelectedMember(e.target.value)}
      >
        <option value="">Select Member</option>
        {members.map(m => (
          <option key={m._id} value={m._id}>
            {m.name}
          </option>
        ))}
      </select>

      <br /><br />

      {/* 🔥 DEADLINE */}
      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
      />

      <br /><br />

      <button onClick={createTask}>
        Create Task
      </button>

      <br /><br />

      <button onClick={() => navigate(-1)}>
        ⬅ Back
      </button>
    </div>
  );
}