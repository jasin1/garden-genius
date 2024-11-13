import {createContext, useEffect, useState} from "react";
import { supabase } from "../config/supabaseClient.js";
import {useNavigate} from "react-router-dom";



export const AuthContext = createContext({});

function AuthContextProvider({children}) {

    const [user, setUser] = useState(null);
    const [status, setStatus] = useState("pending");
    const navigate = useNavigate();

    useEffect(() => {
        // Get the initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
          setUser(session?.user || null);
          setStatus('done');
        });
    
        // Set up listener for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null);
          if (session) {
            navigate("/search"); // Redirect to /search if logged in
        } else {
            navigate("/"); // Redirect to homepage if logged out
        }
        });
    
        // Cleanup on unmount
        return () => {
          subscription.unsubscribe();
        };
      }, [navigate]);


    const signUp = async (email, password) => {
        const{user, error} = await supabase.auth.signUp({
            email,
            password,
        });

        if(error){
            console.error("sign-up error:", error.message);
            return;
        }
    
        setUser(user);
        navigate("/search");

    };

    const login = async (email, password) =>{
        const {user, error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if(error){
            console.error("Login error: ", error.message);
            return;
        }
        setUser(user);
        navigate("/search");
    };

    const logout = async ()=>{
        await supabase.auth.signOut();
        setUser(null);
        navigate("/login");

    };

    const AuthData = {
        user,
        status,
        login,
        logout,
        signUp,
    };




    return (
        <AuthContext.Provider value={AuthData}>
            {status === 'done' ? children : <p>Loading...</p>}
        </AuthContext.Provider>
    );

}

export default AuthContextProvider;