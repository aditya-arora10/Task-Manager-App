import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!email.trim() || !password.trim()) {
      return alert("Please enter email and password");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: email.trim(),
        password: password.trim()
      });

      localStorage.setItem("token", res.data.token);

      alert("Login successful");
      window.location.href = "/dashboard";

    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data);
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "400px", margin: "auto" }}>
        <h2 style={{ textAlign: "center" }}>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button style={{ width: "100%" }} onClick={login}>
          Login
        </button>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Don't have an account?
        </p>

        <Link to="/signup">
          <button style={{ width: "100%" }}>
            Go to Signup
          </button>
        </Link>
      </div>
    </div>
  );
}