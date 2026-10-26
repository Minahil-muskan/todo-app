import { useEffect, useState } from "react";

const STORAGE_KEY = "todo-app-items";

function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setTodos([{ id: Date.now(), text: value, done: false }, ...todos]);
    setText("");
  };

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id));

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    const value = editText.trim();
    if (value) {
      setTodos(todos.map((t) => (t.id === id ? { ...t, text: value } : t)));
    }
    setEditingId(null);
  };

  const clearCompleted = () => setTodos(todos.filter((t) => !t.done));

  const visible = todos.filter((t) =>
    filter === "active" ? !t.done : filter === "completed" ? t.done : true
  );
  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="app">
      <h1>To-Do List</h1>

      <form className="add-form" onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Naya task likhein..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div className="filters">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <ul className="list">
        {visible.length === 0 && <li className="empty">Koi task nahi</li>}
        {visible.map((todo) => (
          <li key={todo.id} className={todo.done ? "done" : ""}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            {editingId === todo.id ? (
              <input
                className="edit-input"
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => saveEdit(todo.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit(todo.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
              />
            ) : (
              <span onDoubleClick={() => startEdit(todo)}>{todo.text}</span>
            )}
            <button className="icon" onClick={() => startEdit(todo)} title="Edit">
              ✎
            </button>
            <button
              className="icon danger"
              onClick={() => deleteTodo(todo.id)}
              title="Delete"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="footer">
        <span>{remaining} task baqi</span>
        <button className="link" onClick={clearCompleted}>
          Completed clear karein
        </button>
      </div>
    </div>
  );
}
