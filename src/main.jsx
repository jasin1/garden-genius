import './index.css';
import React from 'react';
import App from './App.jsx';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from "react-router-dom";
import {PlantProvider} from "./context/PlantContext.jsx";
import AuthContextProvider from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <AuthContextProvider>
                <PlantProvider>
                    <App/>
                </PlantProvider>
            </AuthContextProvider>
        </Router>
    </React.StrictMode>
)
