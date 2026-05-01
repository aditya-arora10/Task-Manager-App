import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import CreateTask from "./pages/CreateTask";
import TaskDetails from "./pages/TaskDetails";
import UpdateProgress from "./pages/UpdateProgress";
import MemberTasks from "./pages/MemberTasks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
<Route path="/create-task" element={<CreateTask />} />
<Route path="/task/:id" element={<TaskDetails />} />
<Route path="/progress/:id" element={<UpdateProgress />} />
<Route path="/member-tasks/:id" element={<MemberTasks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;