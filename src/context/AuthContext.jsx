import { createContext, useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient.js";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({});

function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("pending");
  const [signUpStatus, setSignUpStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null); // Set user if session exists
      setStatus("done");
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null); // Set user whenever auth state changes

      // If the user logs in, navigate them to the /search page
      if (session?.user && window.location.pathname === "/login") {
        navigate("/search");
      } else if (
        !session?.user &&
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        navigate("/login"); // Redirect to login if no user and not on login/register page
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (email, password, username) => {
    try {
      // Call the Supabase sign-up function
      const { data, error } = await supabase.auth.signUp(
        {
          email,
          password,
        },
        {
          data: { display_name: username },
        }
      );
  
      if (error) {
        console.error("Sign-up error:", error.message);
        setSignUpStatus("error");
        return { error };
      }
  
      if (data.user) {
        console.log("Sign-up successful. User:", data.user);
        setSignUpStatus("email_sent"); // Update status for feedback
        setUser(null); // User isn't authenticated until verification
        return { user: data.user, message: "Verification email sent." };
      } else {
        console.log("Sign-up initiated. Waiting for email verification.");
        setSignUpStatus("email_sent");
        return { message: "Verification email sent, please verify to log in." };
      }
    } catch (err) {
      console.error("Unexpected error during sign-up:", err.message);
      setSignUpStatus("error");
      return { error: err.message };
    }
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
    console.log("User logged in successfully:", data.user);
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
    signUpStatus,
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
