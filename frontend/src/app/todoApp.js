import React, { Component } from 'react';
//import Header from './components/layout/Header';
import Todos from './components/Todos';
import AddTodo from './components/AddTodo';
//import About from './components/pages/About';
import axios from 'axios';
// import { v4 as uuidv4 } from "uuid";
import './todoApp.css';

class TodoApp extends Component {
  state = {
    todos: [],
  };

  //'https://jsonplaceholder.typicode.com/todos?_limit=10'
  componentDidMount() {
    axios
      .get('http://localhost:3000/todos/all')
      .then(res => this.setState({ todos: res.data }));
  }

  // Arrow function or need to bind.(this) to markComplete !!!!
  markComplete = id => {
    // Map through and toggle the state
    this.setState({
      todos: this.state.todos.map(todo => {
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }
        return todo;
      }),
    });
  };

  // Delete Todo. Filter out the ids that are passed in using spread operator
  // Copy everything what is in there with spread op.
  delTodo = id => {
    axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`).then(res =>
      this.setState({
        todos: [...this.state.todos.filter(todo => todo.id !== id)],
      }),
    );
  };

  // Add Todo

  addTodo = title => {
    axios
      .post('https://jsonplaceholder.typicode.com/todos', {
        title,
        completed: false,
      })
      .then(res => this.setState({ todos: [...this.state.todos, res.data] }));
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          <React.Fragment>
            <AddTodo addTodo={this.addTodo} />
            <Todos
              todos={this.state.todos}
              markComplete={this.markComplete}
              delTodo={this.delTodo}
            />
          </React.Fragment>
          {/* <Route path="/about" component={About} /> */}
        </div>
      </div>
    );
  }
}

export default TodoApp;
