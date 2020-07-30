import React from 'react';
import './App.css';
import Chat from "./components/chat";
import {BrowserRouter as Router, Route} from "react-router-dom";

const App = () => {
    return (
        <Router>
            <div className="App">
                <Route path="/rooms/:roomName" component={Chat} />
            </div>
        </Router>
    );
}

export default App;
