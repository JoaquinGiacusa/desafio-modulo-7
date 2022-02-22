import { state } from "./state";
import "./router";

//components
import "./components/button";
import "./components/header";
import "./components/card";

//pages
import "./pages/home";
import "./pages/signIn";
const cs = state.getState();
// console.log(cs);

// state.setState((state.getState().petsNear = "soy una mascotita anashei"));
// console.log(cs);
