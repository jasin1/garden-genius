import {createContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import isTokenValid from "../helpers/istokenvalid.js";



export const AuthContext = createContext({});

function AuthContextProvider({children}) {

    const [info, setInfo ] = useState([]);
    const [Auth, setAuth] = useState({
        isAuth: false,
        user: null,
        status: 'pending',
    });

    async function updateUserInfo(userInfo) {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `https://api.datavortex.nl/gardengenius/users/${Auth.user.username}`,
                {
                    info: JSON.stringify(userInfo)
                },
                {
                    headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );


        } catch (error) {
            console.error("Error updating user information:", error);
        }
    }


    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        // is de token nog geldig? check met iat helper function

        if (token && isTokenValid(token)) {
            void login(token);

        } else {
            setAuth({
                isAuth: false,
                user: null,
                status: 'done',
            })
        }
    }, []);


    async function login(token) {
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        try {
            const response = await axios.get(`https://api.datavortex.nl/gardengenius/users/${decodedToken.sub}`,
                {
                    headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data && response.data.username && response.data.email) {

                setAuth({
                    isAuth: true,
                    user: {
                        username: response.data.username,
                        email: response.data.email,
                        info: response.data.info,
                    },
                    status: 'done',
                });
                navigate('/search');

            }

        } catch (e) {
            console.error('login error: ', e);
            logout();
        }
    }

    async function getUserInfo() {
        try {
            const token = localStorage.getItem('token');
            const username = Auth.user.username;
            const response = await axios.get(
                `https://api.datavortex.nl/gardengenius/users/${username}/info`,
                {
                    headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const userInfo = response.data;
            const plantIds = userInfo.map(id => id);


            setInfo(plantIds);

            return plantIds;

        } catch (error) {
            console.error("Error retrieving user information:", error);
        }
    }


    function logout() {
        setAuth({
            isAuth: false,
            user: null,
            status: 'done',
        })
        navigate('/login');
    }


    const AuthData = {
        isAuth: Auth.isAuth,
        user: Auth.user,
        login: login,
        logout: logout,
        updateUserInfo: updateUserInfo,
        getUserInfo: getUserInfo,
        Info: info,
    };


    return (
        <AuthContext.Provider value={AuthData}>
            {Auth.status === 'done' ? children : <p>Loading...</p>}
        </AuthContext.Provider>
    );

}

export default AuthContextProvider;