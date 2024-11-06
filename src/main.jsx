import './index.css';
import React from 'react';
import App from './App.jsx';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from "react-router-dom";
import PlantContextProvider from "./context/PlantContext.jsx";
import AuthContextProvider from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <AuthContextProvider>
                <PlantContextProvider>
                    <App/>
                </PlantContextProvider>
            </AuthContextProvider>
        </Router>
    </React.StrictMode>
)
