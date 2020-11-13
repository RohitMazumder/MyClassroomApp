import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import Home from "./components/Home";
import Register from "./components/Register";
import Classroom from "./components/Classroom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <AuthenticatedRoute exact path="/" component={Home} />
        <AuthenticatedRoute exact path="/home" component={Home} />
        <AuthenticatedRoute path="/classroom/:uid" component={Classroom} />
      </Switch>
    </Router>
  );
}

export default App;
