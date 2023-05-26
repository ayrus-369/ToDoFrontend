import React, { useEffect, useState } from "react";
import ToDo from "./components/ToDo";
import { addToDo, getAllToDo, updateToDo, deleteToDo } from "./utils/HandleApi";
import { format } from "date-fns";

function App() {
  const [currentDate, setCurrentDate] = useState("");
  const [toDo, setToDo] = useState([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [toDoId, setToDoId] = useState("");
  const [completedTaskIds, setCompletedTaskIds] = useState([]);
  const [activeSection, setActiveSection] = useState("incomplete"); // Track active section: incomplete or completed

  useEffect(() => {
    getAllToDoFromLocalStorage();
    setCurrentDate(format(new Date(), "EEEE, MMMM d"));
    getAllToDo(setToDo);
  }, []);

  const getAllToDoFromLocalStorage = () => {
    const storedToDo = localStorage.getItem("toDo");
    if (storedToDo) {
      setToDo(JSON.parse(storedToDo));
    }
    const storedCompletedTaskIds = localStorage.getItem("completedTaskIds");
    if (storedCompletedTaskIds) {
      setCompletedTaskIds(JSON.parse(storedCompletedTaskIds));
    }
  };

  const updateMode = (_id, text) => {
    setIsUpdating(true);
    setText(text);
    setToDoId(_id);
  };

  const moveTaskToCompleted = async (id) => {
    const updatedToDo = toDo.map((item) => {
      if (item._id === id) {
        const updatedItem = { ...item, completed: true };
        updateToDo(updatedItem); // Update the completed flag in the database
        return updatedItem;
      }
      return item;
    });

    setToDo(updatedToDo);
    setCompletedTaskIds([...completedTaskIds, id]);
    localStorage.setItem("toDo", JSON.stringify(updatedToDo));
    localStorage.setItem(
      "completedTaskIds",
      JSON.stringify([...completedTaskIds, id])
    );

    try {
      await updateToDo(id, { completed: true });
    } catch (error) {
      console.log(error);
    }
  };

  const completedTasks = toDo.filter((item) =>
    completedTaskIds.includes(item._id)
  );
  const incompleteTasks = toDo.filter(
    (item) => !item.completed && !completedTaskIds.includes(item._id)
  );

  const activeTaskCount = incompleteTasks.length;

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <div className="dateandtime">
          <div className="date">
            {currentDate}
          </div>
          <div className="task-count">
            {activeTaskCount} Active Tasks
          </div>
          </div>
          
          <div className="nav-bar">
            <a
            href="#"
              className={activeSection === "incomplete" ? "active" : ""}
              onClick={() => handleSectionChange("incomplete")}
            >
              Incomplete Tasks
          </a>
            <a
            href="#"
              className={activeSection === "completed" ? "active" : ""}
              onClick={() => handleSectionChange("completed")}
            >
              Completed Tasks
              </a>
          </div>
        </div>
        <div className="top">
          <input
            type="text"
            placeholder="Enter a task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div
            className="add"
            onClick={
              isUpdating
                ? () =>
                    updateToDo(toDoId, text, setToDo, setText, setIsUpdating)
                : () => addToDo(text, setText, setToDo)
            }
          >
            {isUpdating ? "Update Task" : "Add Task"}
          </div>
        </div>
        <div className="sections">
          {activeSection === "incomplete" && (
            <div className="section">
              <h2>Incomplete Tasks</h2>
              <div className="list">
                {incompleteTasks.map((item) => (
                  <ToDo
                    key={item._id}
                    id={item._id}
                    text={item.text}
                    completed={item.completed}
                    updateMode={() => updateMode(item._id, item.text)}
                    deleteToDo={() => deleteToDo(item._id, setToDo)}
                    toggleCompleted={() => moveTaskToCompleted(item._id)}
                  />
                ))}
              </div>
            </div>
          )}
          {activeSection === "completed" && (
            <div className="section">
              <h2>Completed Tasks</h2>
              <div className="list">
                {completedTasks.map((item) => (
                  <ToDo
                    key={item._id}
                    id={item._id}
                    text={item.text}
                    deleteToDo={() => deleteToDo(item._id, setToDo)}
                    completed={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
