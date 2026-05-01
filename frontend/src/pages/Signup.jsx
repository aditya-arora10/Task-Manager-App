import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL; // ✅ added

export default function Signup() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member",
    adminSecret: "",
    teamCode: ""
  });

  const signup = async () => {
    try {
      const res = await axios.post(
        `${API}/api/auth/signup`, // ✅ updated
        data
      );

      if (data.role === "Admin") {
        alert("Your Team Code: " + res.data.user.teamCode);
      } else {
        alert("Joined Team Successfully");
      }

      window.location.href = "/";

    } catch (err) {
      alert(err.response?.data || "Signup failed");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Signup</h2>

        <input placeholder="Name"
          onChange={e => setData({ ...data, name: e.target.value })} />

        <input placeholder="Email"
          onChange={e => setData({ ...data, email: e.target.value })} />

        <input type="password" placeholder="Password"
          onChange={e => setData({ ...data, password: e.target.value })} />

        <select
          onChange={e => setData({ ...data, role: e.target.value })}
        >
          <option value="Member">Member</option>
          <option value="Admin">Admin</option>
        </select>

        {data.role === "Admin" && (
          <input placeholder="Admin Secret"
            onChange={e => setData({ ...data, adminSecret: e.target.value })} />
        )}

        {data.role === "Member" && (
          <input placeholder="Enter Team Code"
            onChange={e => setData({ ...data, teamCode: e.target.value })} />
        )}

        <button onClick={signup}>Signup</button>

        <Link to="/"><button>Go to Login</button></Link>
      </div>
    </div>
  );
}