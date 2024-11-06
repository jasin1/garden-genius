import './App.css';
import Home from './pages/Home/Home.jsx';
import Search from './pages/search/Search.jsx';
import Saved from './pages/saved/Saved.jsx';
import Profile from './pages/profile/Profile.jsx';
import Onboarding from "./pages/Onboarding/Onboarding.jsx";
import PlantDetail from "./pages/PlantDetails/PlantDetails.jsx";
import Login from "./pages/login/Login.jsx";
import {Routes, Route} from "react-router-dom";




function App() {


    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/search" element={<Search/>}/>
                <Route path="/saved" element={<Saved/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/onboarding" element={<Onboarding/>}/>
                <Route path="/plantdetail/:id" element={<PlantDetail/>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>


        </>
    )
}

export default App;
