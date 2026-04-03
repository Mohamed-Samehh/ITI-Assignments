function TodoList({ tasks, deleteTask, toggleTask }) {
  if (tasks.length === 0) {
    return <p className="text-muted text-center">No tasks yet!</p>;
  }

  return (
    <ul className="list-group">
      {tasks.map(task => (
        <li
          key={task.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span
            onClick={() => toggleTask(task.id)}
            style={{
              cursor: "pointer",
              textDecoration: task.completed ? "line-through" : "none",
              color: task.completed ? "#aaa" : "inherit"
            }}
          >
            {task.text}
          </span>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => deleteTask(task.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;