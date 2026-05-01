import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-indigo-700 text-white p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Task Manager</h2>

        <div className="space-y-3">
          <button onClick={() => navigate("/dashboard")} className="w-full text-left px-3 py-2 rounded hover:bg-indigo-600">
            📊 Dashboard
          </button>

          <button onClick={() => navigate("/projects")} className="w-full text-left px-3 py-2 rounded hover:bg-indigo-600">
            📁 Projects
          </button>

          <button onClick={() => navigate("/create-task")} className="w-full text-left px-3 py-2 rounded hover:bg-indigo-600">
            📝 Create Task
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="w-full text-left px-3 py-2 rounded hover:bg-red-500"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">
        {children}
      </div>

    </div>
  );
}