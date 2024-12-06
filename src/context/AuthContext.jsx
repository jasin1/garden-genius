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
    // Handle session fetching and state initialization
    const fetchSessionAndInitialize = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error fetching session:", error);
          return;
        }

        setUser(session?.user || null); // Update user state
        setStatus("done"); // Mark as initialized
      } catch (err) {
        console.error("Unexpected error during session fetch:", err);
      }
    };

    fetchSessionAndInitialize(); // Initial session fetch

    // Set up onAuthStateChange listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null); // Update user state

      // Navigation logic based on the user's auth state
      if (session?.user) {
        if (window.location.pathname === "/login") {
          navigate("/search"); // Redirect to /search if logged in from /login
        }
      } else {
        // Allow access to specific routes even if not logged in
        const publicRoutes = ["/login", "/register", "/verifyEmail"];
        if (!publicRoutes.includes(window.location.pathname)) {
            navigate("/login"); // Redirect to login for protected routes
        }
    }
    });

    // Cleanup function
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [navigate]);

  const signUp = async (email, password, username) => {
    try {
      const { data, error } = await supabase.auth.signUp(
        {
          email,
          password,
          options:{
            data: { display_name: username },
            
          },
        });

      if (error) {
        console.error("Sign-up error:", error.message);
        setSignUpStatus("error");
        return { error };
      }

      if (data.user) {
        console.log("Sign-up successful. User:", data.user);
        navigate("/verifyEmail");
        setSignUpStatus("email_sent"); // Update status for feedback
        // return { message: "Verification email sent. Please check your inbox." };
      }
    } catch (err) {
      console.error("Unexpected error during sign-up:", err.message);
      setSignUpStatus("error");
      return { error: err.message };
    }
  };

  useEffect(() => {
    if (signUpStatus === "email_sent") {
      const timer = setTimeout(() => setSignUpStatus(null), 5000);
      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
}, [signUpStatus]);

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
    setSignUpStatus,
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
