import { useState, useEffect } from 'react';
import Task from './Task';
import '../index.css';

const Board = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [show, setShow] = useState(false); 
  const [newTask, setNewTask] = useState(''); 
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskStatus, setTaskStatus] = useState('Pending');
  const [date, setDate] = useState('');

  // Load tasks from localStorage when the component mounts
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
    console.log("Loaded tasks:", storedTasks); 
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if(tasks.length <= 0){
      return;
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log("Saving tasks:", tasks); // Log tasks being saved
  }, [tasks]);
  
  
  const increment = () => {   
    setShow(true);
  };

  const addTask = () => {
    if(newTask.trim() !== ""){
      setTasks([...tasks, newTask]);
      setNewTask('');
      setShow(false)
    }    
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(taskId => taskId !== id);
    setTasks(updatedTasks);
    sessionStorage.removeItem(`task-${id}`);
    sessionStorage.removeItem(`task-status-${id}`);
  };

  const handleStatus = (taskId) => {
    setSelectedTaskId(taskId);
    setIsOpenModal(true);
    setTaskStatus(sessionStorage.getItem(`task-status-${taskId}`) || 'Pending');
  };

  const updateStatus = (newStatus) => {
    setTaskStatus(newStatus);
    sessionStorage.setItem(`task-status-${selectedTaskId}`, newStatus);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setSelectedTaskId(null);
  };


  {/*The API provided wasn't working so I used this instead.
     I didn't had time to put on sepated file like: Header.jsx */}
     
  useEffect(() => {
    fetch('https://worldtimeapi.org/api/timezone/America/New_York')
      .then(response => response.json())
      .then(data => setDate(data.datetime.slice(0, 10)))
      .catch(error => console.log(error));
  }, []);

  return (
    <div className="container">
      <header>
        <h1>My To-Do List</h1>
        <p>Today's Date: {date}</p>
    </header>
      <h2>Tasks ({tasks.length})</h2>
      <button >Clone Task</button>
      <button onClick={increment}>Create Task</button>

      {show && (
       <>
       <input type="text" onChange={(e) => setNewTask(e.target.value)} />
       <button className="save" onClick={addTask}>Save</button>
        </>
       )}
     
      <ul className="list">
        {tasks.length > 0 ? (
          tasks.map((taskId) => (
            <li key={taskId}>
              <Task id={taskId} />
              <div className="card-detail">
                <div className="btn">
                  <button className='delete-button' onClick={() => deleteTask(taskId)}>Delete</button>
                  <button className='edit-button' onClick={() => handleStatus(taskId)}>Check Status</button>
                </div>
               </div>
            </li>
          ))
        ) : (
          <li>Empty, create New Task.</li>
        )}
      </ul>
      {isOpenModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Task Details</h3>
            <p>Status: {taskStatus}</p>
            <select value={taskStatus} onChange={(e) => updateStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
