import { useEffect, useState } from "react";
import {getUserTodos, updateData, deleteUserData, getUserPosts, capitalFirstLetter, limitTo50Chars} from "./utils";
import Tasks from "./Tasks";
import Posts from "./Posts";


const USERS_URL = "https://jsonplaceholder.typicode.com/users";
const User = ({ user, onDeleteUser, onUpdateUser }) => {
  const [fullName, setFullName] = useState(user.name); //Help to update user's Full name.
  const [emailAddress, setEmailAddress] = useState(user.email); //Help to update user's Email address.
  const [todos, setTodos] = useState([]); // Keeps User's original Tasks/Todos related inside of an array.
  const [posts, setPosts] = useState([]); // Keeps User's original post related inside of an array.
  const [showExtraData, setShowExtraData] = useState(false); // Shows User's extra data once the mouse hovered.
  const [hoveredLabel, setHoveredLabel] = useState(false); // Will show show Todos and Posts once ID <lable> area will be clicked.
  const [todosCompleted, setTodosCompleted] = useState(false); // Checks the current status of entire todo.completed arry.
  const [isAddTodoClicked, setIsAddTodoClicked] = useState(false); // Checks if the Todo Add button has been clicked.
  const [isAddPostClicked, setIsAddPostClicked] = useState(false); // Checks if the Post Add button has been clicked.
  const [cancelButtonClick, setCancelButtonClick] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState(""); // Keeps the current Post title typed by the user.
  const [newPostBody, setNewPostBody] = useState(""); // Keeps the current Post body typed by the user.
  const [newPosts, setNewPosts] = useState([]); // Keeps in an array the new Posts typed by the user (using the add button).
  const [newTodos, setNewTodos] = useState([]); // Keeps in an array the new Todos title typed by the user (using the add button).
  const [newTodoTitle, setNewTodoTitle] = useState("") // Keeps the current Todo title typed by the user.
  const [newUserData, setNewUserData] = useState({ street: " ", city: " ", zipcode: " " });

 
  { /* Creats Todos db and attach it to the user using User's Id */}
  useEffect(() => {
    const getTodos = async () => {
      const todos = await getUserTodos(user.id);
      setTodos(todos);
    };
    getTodos();
  }, [user.id]);


  { /* Creats Posts db and attach it to the user using User's Id */ }
  useEffect(() => {
    const getPosts = async () => {
      const posts = await getUserPosts(user.id);
      setPosts(posts);
    };
    getPosts();
  }, [user.id]);


  { /* Check if all tasks are completed, this will run only if todos is changed -> 
  if all tasks are completed: then main user <div> element frame will turn Green, otherwise will turn Red */ }
  useEffect(() => {
    const todosCompleted = todos
      .map((todo) => todo.completed)
      .every((status) => status); // Retruning an array with boolean for each element inside (true or false).
    setTodosCompleted(todosCompleted); //Updating it's current state
  }, [todos]);


  { /* Update User personal details into the DB URL */ }
  const handleUpdate = async () => {
    const updatedUser = {
      ...user,
      name: fullName,
      email: emailAddress,
      address: {
        ...user.address,
        street: newUserData.street,
        city: newUserData.city,
        zipcode: newUserData.zipcode,
      },
    };
  
    try {
      const { data } = await updateData(USERS_URL, user.id, updatedUser);
      console.log('Updated User:', data);
  
      // Update the state with the latest user data
      setFullName(data.name);
      setEmailAddress(data.email);
      setNewUserData({
        street: data.address.street,
        city: data.address.city,
        zipcode: data.address.zipcode,
      });
  
      // Call the callback to update User component if needed
      onUpdateUser(data);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };


  { /* Deletes a specific User from the DB URL */ }
  const handleDelete = async () => {
    try { 
      const { data } = await deleteUserData(USERS_URL, user.id);
      onDeleteUser(user.id);
      console.log("User's data Deleted", data);
    } catch (error) {
      console.error("Error Deleting User from DB:", error)
    }
  };


  { /* First will check if the current todo matches with the todoId arg, 
  if they matched, it'll create a new obj based on other info using 
  spread op and will sets completed property as 'true', if the id's not matching,
  it'll return the original obj without any changes */ }
  const handleIsComplete = async (todoId) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, completed: true };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };


  { /* Function that handles the Add button click, if it's the Todo's button clicked 
   it'll show the to add only title, and if it's post it'll show the title and body options */ }
  const handleAddButton = async (type) => {
    if (type === "todo") {
      const newTodo = {
        userId: user.id,
        title: newTodoTitle,
        completed: true
      };
      setNewTodos((prevTodos) => [...prevTodos, newTodo]);
      setNewTodoTitle("");
      setCancelButtonClick(false);

    } else if (type === "post") {
      const newPost = {
        userId: user.id,
        title: newPostTitle,
        body: newPostBody,
      };
      setNewPosts((prevPosts) => [...prevPosts, newPost]);
      setNewPostTitle("");
      setNewPostBody("");
      setCancelButtonClick(false);
    }
  };

  
    return (
      <>
        <div style={{ display: "flex" }}>
          <div
            style={{
              border: todosCompleted ? "2px solid green" : "2px solid red",
              marginBottom: "4px",
              padding: "4px",
              textAlign: "left",
              backgroundColor: hoveredLabel ? "#f4a688" : null,
            }}>
            
            <label
              onClick={() => setHoveredLabel((reverseHovered) => !reverseHovered)}>
              <strong> ID: </strong> {user.id}
            </label>{" "}
            <br /> <br />

            <strong> Name: </strong>
            <input
              style={{ backgroundColor: hoveredLabel ? "#f4a688" : null }}
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}/>
            <br /> <br />
            
            <strong> Email: </strong>
            <input
              style={{ backgroundColor: hoveredLabel ? "#f4a688" : null }}
              type="text"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}/>
            <br /> <br />
            
            <button
              style={{ backgroundColor: "#ffec5c", marginRight: "5px" }}
              onMouseOver={() => setShowExtraData(true)}
              onClick={() => setShowExtraData(false)}>
              Other Data
            </button>
            
            <button
              style={{ backgroundColor: "#afcc5c", marginRight: "5px" }}
              onClick={() => {
                handleUpdate();
              }}>
              Update Data
            </button>
            
            <button
              style={{ backgroundColor: "#f4c688", marginTop: "3px" }}
              onClick={() => {
                handleDelete();
              }}>
              Delete Data
            </button>
            
            {showExtraData ? (
            <div style={{
                        border: "2px solid black",
                        marginTop: "3%",
                        padding: "3%"
                      }}>
              <strong> Street: </strong> 
              <input 
                onChange={(e) => setNewUserData((prevData) => ({ ...prevData, street: e.target.value }))}/>
              <br />
              <strong> City: </strong> 
              <input  
                onChange={(e) => setNewUserData((prevData) => ({ ...prevData, city: e.target.value }))}/>
              <br />
              <strong> Zip Code: </strong> 
              <input  
                onChange={(e) => setNewUserData((prevData) => ({ ...prevData, zipcode: e.target.value }))}/>
              <br />
          </div>
          ) : null}
        </div>

        <div
          style={{
            marginLeft: "20px",
            display: "inline-block",
            padding: "10px",
            marginBottom: "4px",
            backgroundColor: "white",
            border: hoveredLabel ? "2px solid black" : null,
          }}>

          {hoveredLabel ? (
            <>
              <div
                style={{
                  border: todosCompleted ? "2px solid green" : "2px black",
                  padding: "1%",
                  marginBottom: "3px",
                  visibility: (isAddTodoClicked || isAddPostClicked) && cancelButtonClick ? "hidden" : "visible",
                }}
              >
                <strong style={{ color: "green", marginRight: "67%" }}>
                  {" "}
                  Todos: User {user.id}{" "}
                </strong>
                <button
                  style={{
                    marginTop: "5px",
                    backgroundColor: "#ffec5c",
                    border: "1px solid black",
                    padding: "5px",
                  }}
                  onClick={() => setIsAddTodoClicked(true)}>
                  Add
                </button> <br />
                {todos.map((todo) => (
                  <Tasks
                    key={todo.id}
                    todoId={todo.id}
                    todoTitle={todo.title}
                    isCompleted={todo.completed}
                    completedTitle={capitalFirstLetter(todo.completed.toString())}
                    onMarkCompleted={() => handleIsComplete(todo.id)} />
                ))}
                 {newTodos.map((todo) => (
                  <Tasks
                    key={`newTodos-${todo.id}`}
                    todoTitle={todo.title}
                    isCompleted={todo.completed}
                    completedTitle={capitalFirstLetter(todo.completed.toString())}
                    onMarkCompleted={() => handleIsComplete(todo.id)} />
                ))}
              </div>

              {isAddTodoClicked ? (
                <>
                  <div style={{ border: "1px solid black", padding: "20px" }}>
                  <strong style={{ marginRight: "3px", color: "#ff66b3" }}>
                    {" "}
                    New Todo - User: {user.id}{" "}
                  </strong> <br /> <br />
                    <strong style={{ margin: "auto," }}> Title: </strong>
                    <input
                      type="text"
                      onChange={(e) => setNewTodoTitle(e.target.value)}/>
                      {" "}
                    <strong style={{ margin: "auto," }}> Completed: </strong>
                    <br /> 
                    <button
                      style={{
                        marginLeft: "63%",
                        marginRight: "10px",
                        backgroundColor: "#ffec5c",
                        border: "1px solid black",}}
                        onClick={() => {
                                setCancelButtonClick(true);
                                setIsAddTodoClicked(false);
                                setIsAddPostClicked(false);
                                }}>
                      Cancel
                    </button>
                    <button
                      style={{
                        backgroundColor: "#ffec5c",
                        border: "1px solid black"}}
                      onClick={() => {
                        handleAddButton("todo");
                        setIsAddTodoClicked(false);
                      }}>
                      {" "}
                      Add{" "}
                    </button>
                  </div>
                </>
              ) : null}

              <div
                style={{
                  border: "3px solid black",
                  padding: "1%",
                  marginTop: "3px",
                  visibility: (isAddTodoClicked || isAddPostClicked) && cancelButtonClick ? "hidden" : "null"}}>
                <strong style={{ color: "blue", marginRight: "67%" }}>
                  {" "}
                  Posts: User {user.id}{" "}
                </strong>
                <button
                  style={{
                    marginBottom: "3px",
                    backgroundColor: "#ffec5c",
                    border: "1px solid black",
                    padding: "5px" }}
                  onClick={() => setIsAddPostClicked(true)}>
                  Add
                </button>
                <br />
                {posts.map((post) => (
                  <Posts
                    key={post.id}
                    postTitle={post.title}
                    postBody={limitTo50Chars(post.body)}/>
                ))}
                {newPosts.map((post, index) => (
                  <Posts
                    key={`newPost-${index}`}
                    postTitle={post.title}
                    postBody={limitTo50Chars(post.body)}/>
                ))}
              </div>

              {isAddPostClicked ? (
                <>
                  <strong style={{ marginRight: "3px", color: "#ff66b3" }}>
                    {" "}
                    New Post - User: {user.id} {" "}
                  </strong>
                  <div style={{ border: "1px solid black", padding: "20px" }}>
                    <strong style={{ margin: "auto," }}> Title: </strong>
                    <input type="text"
                      onChange={(e) => setNewPostTitle(e.target.value)}/>
                      {" "}
                    <br /> <br />
                    <strong style={{ margin: "auto," }}> Body: </strong>
                    <input type="text"
                      onChange={(e) => setNewPostBody(e.target.value)}/>
                      {" "}
                    <br /> <br />
                    <button
                      style={{
                        marginLeft: "62%",
                        marginRight: "10px",
                        backgroundColor: "#ffec5c",
                        border: "1px solid black",
                      }}
                      onClick= {() => {
                        setCancelButtonClick(true);
                        setIsAddTodoClicked(false);
                        setIsAddPostClicked(false);
                      }}>
                      Cancel
                    </button>
                    <button
                      style={{
                        backgroundColor: "#ffec5c",
                        border: "1px solid black",
                      }}
                      onClick={() => {
                        handleAddButton("post");
                        setIsAddPostClicked(false);}} >
                      {" "}
                      Add{" "}
                    </button>
                  </div>
                </>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default User;
