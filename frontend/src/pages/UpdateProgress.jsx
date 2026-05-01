import axios from "axios";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL; // ✅ added

export default function UpdateProgress() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [progress, setProgress] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const updateProgress = async () => {
    if (progress === "") {
      return alert("Please enter progress");
    }

    if (progress < 0 || progress > 100) {
      return alert("Progress must be between 0 and 100");
    }

    setLoading(true);

    try {
      await axios.put(
        `${API}/api/tasks/progress/${id}`, // ✅ updated
        { progress },
        {
          headers: { Authorization: token }
        }
      );

      alert("Progress Updated");
      navigate("/dashboard");

    } catch (err) {
      alert(err.response?.data || "Error updating progress");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <button onClick={() => navigate(-1)}>⬅ Back</button>

      <div className="card">
        <h2>Update Progress</h2>

        <input
          type="number"
          placeholder="Enter progress (0-100%)"
          value={progress}
          onChange={e => setProgress(e.target.value)}
        />

        <br /><br />

        <div style={{
          height: "10px",
          background: "#ddd",
          borderRadius: "5px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progress || 0}%`,
            height: "100%",
            background: progress == 100 ? "green" : "orange"
          }} />
        </div>

        <br />

        <button onClick={updateProgress} disabled={loading}>
          {loading ? "Saving..." : "Submit"}
        </button>
      </div>
    </div>
  );
}