import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
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
      <Route exact path="/signup">
        <SignUp />
      </Route>
      <Route exact path="/signin">
        <SignIn />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
    </BrowserRouter>
  );
}

export default App;
