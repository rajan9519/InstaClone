import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useState,
} from "react";
import { BrowserRouter, Route, useHistory, Switch } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import {
  Home,
  SignUp,
  Profile,
  SignIn,
  CreatePost,
  SnackBar,
  show,
} from "./components/screens";
import { reducer } from "./reducer/authReducer";
import { ChatRoom } from "./components/presentation";
import socket from "./reducer/socketInstance";

export const AuthContext = createContext();
export const initialState = {
  isAuthenticated: localStorage.getItem("isAuthenticated"),
  user: JSON.parse(localStorage.getItem("user")),
  token: localStorage.getItem("token"),
};

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(AuthContext);
  const { auth, setAuth } = useState(state.isAuthenticated);

  useEffect(() => {
    if (state.isAuthenticated) {
      if (window.location.pathname === "/signin") {
        history.push("/");
      }
      socket.emit("join", state.user._id);
      console.log(socket);
    } else {
      history.push("/signin");
    }
    console.log("state changed", state.user);
  }, [state]);

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/profile/:userId">
        <Profile />
      </Route>
      <Route exact path="/createpost">
        <CreatePost />
      </Route>
      <Route exact path="/signout">
        <button
          onClick={() => {
            show("Signed Out", "green");
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
      <Route exact path="/chatroom/:recieverId">
        <ChatRoom />
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
        <SnackBar />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
