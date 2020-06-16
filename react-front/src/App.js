import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import NavBar from "./components/NavBar";
import { Home, SignUp, Profile, SignIn } from "./components/screens";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/SignUp">
        <SignUp />
      </Route>
      <Route exact path="/SignIn">
        <SignIn />
      </Route>
      <Route exact path="/Profile">
        <Profile />
      </Route>
    </BrowserRouter>
  );
}

export default App;
