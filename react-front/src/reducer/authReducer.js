import socket from "./socketInstance";

export const reducer = (state, action) => {
  switch (action.type) {
    case "SIGNIN":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("isAuthenticated", true);
      socket.emit("join", action.payload.user._id);
      console.log(action.payload.user._id);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case "SIGNOUT":
      localStorage.clear();
      socket.disconnect();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};
