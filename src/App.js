import "./App.css";
import Home from "./Home";
import { Route, NavLink, HashRouter } from "react-router-dom";
import PokeDex from "./PokeDex";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  return (
    <HashRouter>
      <div>
        <Route exact path="/" component={Home}/>
        <Route path="/pokedex" component={PokeDex}/>
      </div>
      
    </HashRouter>
  );
}

export default App;
