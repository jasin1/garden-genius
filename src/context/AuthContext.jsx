import { createContext, useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient.js";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({});

function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("pending");
  // const [userPlants, setUserPlants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("supabase auth",supabase.auth);
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setStatus("done");

      if (session && window.location.pathname === "/login") {
        navigate("/search"); // Redirect logged-in users from the login page to /search
      }
    });

    // Set up listener for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);

      if (session?.user) {
        if (window.location.pathname === "/login") {
          navigate("/search");
        }
      } else {
        const publicRoutes = ["/login", "/register"];

        if (!publicRoutes.includes(window.location.pathname)) {
          navigate("/search");
        }
      }
    });

    // Cleanup on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (email, password, username) => {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: username,
        },
      },
    });

    if (error) {
      console.error("sign-up error:", error);
      return;
    }

    setUser(user);
    navigate("/search");
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);

      if (error.message.includes("invalid login credentials")) {
        return { error: "User not found. Please register." };
      }
      return { error: error.message };
    }
    

    setUser(data.user);
    // navigate("/search");
    return { user: data.user };
  };

  const logout = async () => {
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
      {status === "done" ? children : <p>Loading...</p>}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
