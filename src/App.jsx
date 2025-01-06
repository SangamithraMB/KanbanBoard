import  { useState, useEffect } from 'react';
import "./App.css"

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [taskStatus, setTaskStatus] = useState('todo'); 

  // Function to fetch tasks
  async function getTasks() {
    try {
      const response = await fetch('https://episodetrade-sharpmodular-3000.codio.io/tasks', {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched Tasks:', data);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Function to add a new task
  async function addTask(task) {
    try {
      const response = await fetch('https://episodetrade-sharpmodular-3000.codio.io/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const data = await response.json();
      console.log('Task added:', data);
      setTasks((prevTasks) => [...prevTasks, data]);
      getTasks();
      
      setTaskText('');
      setTaskStatus('todo');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Function to update a task's status
  async function updateTask(taskId, currentStatus) {
    let nextStatus = '';

    // Determine next status based on the current status
    if (currentStatus === 'todo') {
      nextStatus = 'doing'; // From Todo to Doing
    } else if (currentStatus === 'doing') {
      nextStatus = 'done'; // From Doing to Done
    } else {
      nextStatus = currentStatus; // If it's already 'done', keep it as 'done'
    }

    try {
      const taskToUpdate = { status: nextStatus };
  
      const response = await fetch(`https://episodetrade-sharpmodular-3000.codio.io/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(taskToUpdate),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      console.log('Updated Task:', updatedTask);
  
      // Update status in the state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: nextStatus } : task
        )
      );
  
      console.log(`Task with ID: ${taskId} updated to ${nextStatus}`);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Function to delete a task
  async function deleteTask(taskId) {
    try {
      const response = await fetch(`https://episodetrade-sharpmodular-3000.codio.io/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      console.log(`Task with ID: "${taskId}" deleted`);
      // Remove the deleted task from the state
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };


  // Handle form submission to add a new task
  async function handleSubmit(e) {
    e.preventDefault();
    const newTask = { text: taskText, status: taskStatus };
    console.log('New Task:', newTask);
    addTask(newTask);
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className='all-blocks'>
      <h1> ⚙️ ⚙️ Kanban Board</h1>
      {/* Form to add a task */}
     
      <form onSubmit={handleSubmit}>
          <div className='form'>
            <div className='form'>
            <input 
              type="text" 
              value={taskText} 
              onChange={(e) => setTaskText(e.target.value)} 
              placeholder="Task text" 
              required 
            />
        </div>

        <div className='form'>
            <select 
              value={taskStatus} 
              onChange={(e) => setTaskStatus(e.target.value)}>
              <option value="todo">Todo</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
        </div>
        <div className='form'>
        <button type="submit">Add Task</button>
        </div>
        </div>
      </form>

      <div className="kanban-columns">
        {/* Column for TODO tasks */}
        <div className="column">
          <h2>Todo</h2>
          <ul>
            {tasks.filter(task => task.status === 'todo').map(task => (
              <li key={task.id}>
                <span className="task-text">{task.text}</span>
                <div className="task-actions">
                <button 
                  onClick={() => updateTask(task.id, task.status)} 
                  disabled={task.status === 'doing' || task.status === 'done'}
                >
                Doing
                </button>
                <button onClick={() => deleteTask(task.id)}>
                🗑️
                </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Column for DOING tasks */}
        <div className="column">
          <h2>Doing</h2>
          <ul>
            {tasks.filter(task => task.status === 'doing').map(task => (
              <li key={task.id}>
                <span className="task-text">{task.text}</span>
                <div className="task-actions">
                <button 
                  onClick={() => updateTask(task.id, task.status)} 
                  disabled={task.status === 'done'}
                >
                Done
                </button>
                <button onClick={() => deleteTask(task.id)}>
                🗑️
                </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Column for DONE tasks */}
        <div className="column">
          <h2>Done</h2>
          <ul>
            {tasks.filter(task => task.status === 'done').map(task => (
              <li key={task.id}>
                <span className="task-text">{task.text}</span>
                <div className="task-actions">
                <button onClick={() => deleteTask(task.id)}>
                🗑️
                </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </div>
  );
}

export default App;