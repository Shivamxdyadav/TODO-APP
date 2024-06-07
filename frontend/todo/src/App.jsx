import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { format, addDays, startOfWeek } from 'date-fns';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showTodos, setShowTodos] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    axios.get('http://localhost:3000/todos')
      .then(response => setTodos(response.data));
  }, []);

  const addTodo = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/todos', { title, description, date: selectedDate })
      .then(response => setTodos([...todos, response.data]));
    setTitle('');
    setDescription('');
    setShowTodos(true);
  };

  const toggleDone = (id) => {
    axios.patch(`http://localhost:3000/todos/${id}`)
      .then(response => {
        setTodos(todos.map(todo => todo._id === id ? response.data : todo));
      });
  };

  const clearTodos = () => {
    setShowTodos(false);
  };

  const groupTodosByDate = (todos) => {
    return todos.reduce((groupedTodos, todo) => {
      const date = format(new Date(todo.date), 'yyyy-MM-dd');
      if (!groupedTodos[date]) {
        groupedTodos[date] = [];
      }
      groupedTodos[date].push(todo);
      return groupedTodos;
    }, {});
  };

  const groupedTodos = groupTodosByDate(todos);

  const getWeekDates = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday as the start of the week
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const weekDates = getWeekDates();

  return (
    <div className="App">
      <h1>TODO App</h1>
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <button type="submit">Add Todo</button>
      </form>
      <button onClick={clearTodos}>Clear All</button>
      <div className="date-picker">
        {weekDates.map(date => (
          <div
            key={date}
            className={`date-item ${format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') ? 'selected' : ''}`}
            onClick={() => setSelectedDate(date)}
          >
            <div>{format(date, 'd')}</div>
            <div>{format(date, 'EEE')}</div>
          </div>
        ))}
      </div>
      <div className="timeline">
        {showTodos && (
          <div className="date-section">
            <div className="date-header">
              <h2>{format(new Date(selectedDate), 'MMMM do, yyyy')}</h2>
            </div>
            <ul className="todo-list">
              {(groupedTodos[format(selectedDate, 'yyyy-MM-dd')] || []).map(todo => (
                <li key={todo._id} className="todo-item">
                  <div className="todo-content">
                    <span className={todo.done ? 'done' : ''}>{todo.title}</span>
                    <span>{todo.description}</span>
                  </div>
                  <button onClick={() => toggleDone(todo._id)}>{todo.done ? 'Undo' : 'Done'}</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
