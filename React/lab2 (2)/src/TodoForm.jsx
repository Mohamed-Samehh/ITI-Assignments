function TodoForm({ input, setInput, addTask }) {
  return (
    <div className="input-group mb-4">
      <input
        type="text"
        className="form-control"
        placeholder="Enter new task..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
      />
      <button className="btn btn-primary" onClick={addTask}>
        Add
      </button>
    </div>
  );
}

export default TodoForm;