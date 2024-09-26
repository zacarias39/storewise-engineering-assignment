import { useEffect, useState } from 'react';

const Task = ({ id }) => {
  const [taskName, setTaskName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');

  useEffect(() => {
    const storedName = sessionStorage.getItem(id);
    const defaultTaskName = id;

    if (!storedName) {
      const defaultTaskName = id;
      sessionStorage.setItem(id, defaultTaskName);
      setTaskName(defaultTaskName);
    } else {
      setTaskName(storedName);
    }
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
    setNewTaskName(taskName);
  };

  const handleSave = () => {
    sessionStorage.setItem(`task-${id}`, newTaskName);
    setTaskName(newTaskName);
    setIsEditing(false);
  };

  return (
    <>
      {isEditing ? (
        <>
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <div className="cim">
            <p>{taskName}</p>
          </div>
          <div className="horizon"></div>
          <div className="card-detail">
        
        <div className="btn">
          <button  onClick={handleEdit}>Edit</button>
        </div>
      </div>
          
        </>
      )}
    </>
  );
};

export default Task;
