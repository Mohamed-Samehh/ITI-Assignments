import { useState } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  function addTask() {
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
    setInput("");
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id));
  }

  function toggleTask(id) {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm" style={{ maxWidth: 500, margin: "0 auto" }}>
        <h2 className="mb-4">To-Do App</h2>
        <TodoForm
          input={input}
          setInput={setInput}
          addTask={addTask}
        />
        <TodoList
          tasks={tasks}
          deleteTask={deleteTask}
          toggleTask={toggleTask}
        />
      </div>
    </div>
  );
}
export default App;