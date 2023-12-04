import { useState } from "react";
import { updateData, getUserTodos } from "./utils";

const Tasks = ({todoId ,todoTitle, completedTitle, isCompleted, onMarkCompleted  }) => {

  const TODOS_URL = "https://jsonplaceholder.typicode.com/todos";

  const [todos, setTodos] = useState([]);

  const [updatedCompletedTitle, setUpdatedCompletedTitle] = useState(completedTitle);

    {/* Updates todos that completed */}

  const updateTodosData = async () => {
    const updatedTodo = {...todos, title: "", completedTitle: "", };
    const {data} = await updateData(TODOS_URL, todoId, updatedTodo)
    console.log("Update Data:", data);
    setTodos(data)
    setUpdatedCompletedTitle('True');
    onMarkCompleted();
  };


  return (
    <div style={{border:"2px solid purple", marginBottom:"3px", textAlign:"left", paddingBottom:"3px" }}>
     <strong style={{marginLeft: "4px"}}> Title: </strong> {todoTitle} <br />
     <strong style={{marginLeft: "4px"}}> completed: </strong> {updatedCompletedTitle} 
     {isCompleted == false ? (
      <button 
        onClick={() => updateTodosData()}
        style={{marginLeft:"70%",
                padding: "5px", 
                border: "1px solid Black",
                backgroundColor:"#ffec5c"}}>
                Mark Completed 
      </button>      
      ) : null }
    </div>
  )
}
export default Tasks


