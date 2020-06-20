import React, { createContext, useReducer, useContext, useEffect } from "react";
import { BrowserRouter, Route, useHistory, Switch } from "react-router-dom";
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
  isAuthenticated: localStorage.getItem("isAuthenticated"),
  user: localStorage.getItem("user"),
  token: localStorage.getItem("token"),
};

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(AuthContext);

  useEffect(() => {
    if (state.isAuthenticated) {
      history.push("/");
    } else {
      history.push("/signin");
    }
    console.log("state changed");
  }, [state]);
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route exact path="/createpost">
        <CreatePost />
      </Route>
      <Route exact path="/signout">
        <button
          onClick={() => {
            dispatch({ type: "SIGNOUT" });
          }}
        >
          Sign out
        </button>
      </Route>
      <Route exact path="/signup">
        <SignUp />
      </Route>
      <Route exact path="/signin">
        <SignIn />
      </Route>
    </Switch>
  );
};
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
