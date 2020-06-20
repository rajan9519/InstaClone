import React, { createContext, useReducer } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import {
  Home,
  SignUp,
  Profile,
  SignIn,
  CreatePost,
} from "./components/screens";
import { reducer } from "./reducer/authReducer";

export const AuthContext = createContext();
export const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const AfterSign = () => {
  return (
    <div>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route exact path="/createpost">
        <CreatePost />
      </Route>
    </div>
  );
};

const BeforeSign = () => {
  return (
    <div>
      <Route exact path="/signup">
        <SignUp />
      </Route>
      <Route exact path="/signin">
        <SignIn />
      </Route>
    </div>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{
          state,
          dispatch,
        }}
      >
        <NavBar />
        {!state.isAuthenticated ? <BeforeSign /> : <AfterSign />}
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
