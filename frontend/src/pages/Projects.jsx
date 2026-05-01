import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [name, setName] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // 🧠 Safe user decode
  const getUser = () => {
    try {
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const user = getUser();

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

  // 📡 Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/projects",
        {
          headers: { Authorization: token } // keep consistent with backend
        }
      );

      console.log("PROJECTS:", res.data);
      setProjects(res.data);

    } catch (err) {
      console.log("FETCH ERROR:", err.response?.data);
      alert(err.response?.data || "Failed to load projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 🚀 Create project
  const createProject = async () => {
    if (!name.trim()) {
      return alert("Project name is required");
    }

    if (user?.role !== "Admin") {
      return alert("Only Admin can create projects");
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/projects",
        { name: name.trim() },
        {
          headers: { Authorization: token }
        }
      );

      console.log("CREATED:", res.data);

      alert("Project Created Successfully");
      setName("");

      // 🔥 refresh list immediately
      setProjects(prev => [...prev, res.data]);

    } catch (err) {
      console.log("CREATE ERROR:", err.response?.data);
      alert(err.response?.data || "Project creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>⬅ Back</button>

      <h2>Projects</h2>

      <p><strong>Role:</strong> {user?.role}</p>

      {/* Create Section */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Project Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <button
          onClick={createProject}
          disabled={loading || user?.role !== "Admin"}
          style={{
            marginLeft: "10px",
            opacity: user?.role !== "Admin" ? 0.5 : 1
          }}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>

      {/* Projects List */}
      <h3>Existing Projects</h3>

      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        projects.map(p => (
          <div
            key={p._id}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              marginBottom: "10px",
              borderRadius: "6px"
            }}
          >
            <strong>{p.name}</strong>
          </div>
        ))
      )}
    </div>
  );
}