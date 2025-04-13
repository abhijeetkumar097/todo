import { useState, useEffect } from "react";
import axios from 'axios';

function Todo() {
    const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [editId, setEditId] = useState(null);
  const [refresh, setRefresh] = useState("true");

  const fetchTodos = async () => {
    const res = await axios.get('http://localhost:5000/todos');
    setTodos(res.data);
  };

  const addOrEditTodo = async () => {
    if (editId) {
      await axios.put(`http://localhost:5000/todos/${editId}`, { text });
    } else {
      await axios.post('http://localhost:5000/todos', { text });
    }
    setText('');
    setEditId(null);
    fetchTodos();
    setRefresh((prev) => !prev);
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/todos/${id}`);
    fetchTodos();
    setRefresh((prev) => !prev);
  };

  const editTodo = (todo) => {
    setText(todo.text);
    setEditId(todo._id);
    setRefresh((prev) => !prev);
  };

  useEffect(() => {
    fetchTodos();
  }, [refresh]);

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={addOrEditTodo}>{editId ? 'Update' : 'Add'}</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            {todo.text}
            <div>
              <button onClick={() => editTodo(todo)}>Edit</button>
              <button onClick={() => deleteTodo(todo._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
  
}

export default Todo 