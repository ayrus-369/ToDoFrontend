import React from 'react'
import {BiEdit} from "react-icons/bi"
import {AiFillDelete} from "react-icons/ai"
import { BiCheckCircle } from "react-icons/bi";



const CompletedTask = ({ text, deleteToDo }) => (
    <div className="task">
      
        <BiCheckCircle className="success-icon" />
      
      <div className="text">{text}</div>
      
        <AiFillDelete className="icon" onClick={deleteToDo} />
   
    </div>
  );
const IncompleteTask = ({ text, updateMode, deleteToDo, toggleCompleted }) => (
  <div className="task">
    <input type="checkbox" checked={false} onChange={toggleCompleted} />
    <div className="text">{text}</div>
    <div className="icons">
      <BiEdit className="icon-edit" onClick={updateMode} />
      <AiFillDelete className="icon" onClick={deleteToDo} />
    </div>
  </div>
);

const ToDo = ({ id, text, completed, updateMode, deleteToDo, toggleCompleted }) => {
  return completed ? (
    <CompletedTask text={text} deleteToDo={deleteToDo} />
  ) : (
    <IncompleteTask
      text={text}
      updateMode={updateMode}
      deleteToDo={deleteToDo}
      toggleCompleted={toggleCompleted}
    />
  );
};

export default ToDo;
