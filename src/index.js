import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import { db } from "./utils/firebase";

function App() {
  let [todos, setTodos] = React.useState([]);
  let [newText, setNewText] = React.useState([]);

  React.useEffect(function() {
    async function loadTodos() {
      let snapshot = await db.collection("todos").get();
      setTodos(snapshot.docs);
    }
    loadTodos();
  }, []);

  function deleteTodo(id) {
    db.collection("todos")
      .doc(id)
      .delete();
    let newAr = todos.filter(v => v.id !== id);
    setTodos(newAr);
  }

  async function addTodo() {
    let obj = { txt: newText, author: "dlwlsk" };
    let docref = await db.collection("todos").add(obj);
    let doc = await db
      .collection("todos")
      .doc(docref.id)
      .get();
    setTodos([...todos, doc]);
  }

  function onSubmit(event) {
    event.preventDefault();
    addTodo();
  }

  return (
    <div>
      {todos.map(v => (
        <button
          key={v.id}
          onClick={function() {
            deleteTodo(v.id);
          }}
        >
          {v.data().author} - {v.data().txt}
        </button>
      ))}
      <hr />
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={newText}
          onChange={event => setNewText(event.target.value)}
        />
        <button>ADD</button>
      </form>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
