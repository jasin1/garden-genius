import "./home.css";
import whiteLogo from "../../assets/white-logo.svg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import Button from "../../components/Button/Button.jsx";
import Notification from "../../components/Notification/Notification.jsx";
import { useContext, useState, useEffect } from "react";

function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signUp, signUpStatus,setSignUpStatus } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Effect to reset signUpStatus after 5 seconds
  useEffect(() => {
    if (signUpStatus === "email_sent") {
      const timer = setTimeout(() => {
        setSignUpStatus(null);
      }, 5000);

      // Cleanup timer if component unmounts or state changes
      return () => clearTimeout(timer);
    }
  }, [signUpStatus, setSignUpStatus]);




  async function handleFormSubmit(data) {
    try {
      const { email, password, username } = data;
      const response = await signUp(email, password, username);

      console.log("Signup response received:", response);

      if (!response) {
        throw new Error("No response from the signup function");
      }

      if (response.error) {
        console.log("Signup error:", response.error.message);
        setError(response.error.message); // Show error if any
      } else {
        setSignUpStatus("email_sent");  // Set the status to show the success notification
        navigate("/verifyEmail");
      }
    } catch (error) {
      console.error("Signup error: ", error.message);
      setError(error.message || "An unexpected error occurred.");
    }
  }

  function handleNavigate() {
    navigate("/login");
  }

  const handleCloseNotification = () => {
    setError(null);
  };



  return (
    <main>
      <section className="login-splash">
        <div className="main-image-wrapper">
          <div className="overlay">
            <div className="login-whitelogo-wrapper">
              <img src={whiteLogo} alt="main logo" />
            </div>
            <p>
              Our platform is your gateway to discovering the perfect plants for
              your garden oasis. Whether you are a seasoned gardener or just
              starting out, GardenGenius is here to help you bring your
              gardening dreams to life.
            </p>
          </div>
        </div>

        <div className="intro-container">
          <div className="intro-wrapper">
            <div className="intro-header">
              <h1 className="intro-welcome-txt">Sign up!</h1>

              <p>
                 Embark on your green journey with us! Sign up today and discover a world of botanical beauty.
              </p>
            </div>

            
              <div className="form-wrapper">
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                  <div className="form-container">
                    <label htmlFor="name-filed">
                      Name
                      <input
                        type="text"
                        id="name-field"
                        placeholder="Enter your name"
                        {...register("username", {
                          required: "Username is required",
                        })}
                      />
                    </label>
                    <label htmlFor="email-field">
                      Email
                      <input
                        type="email"
                        id="email-field"
                        placeholder="Enter your email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/i,
                        })}
                      />
                      {errors.email && (
                        <span className="error-text">
                          {errors.email.message}
                        </span>
                      )}
                    </label>
                    <label htmlFor="password-field">
                      password
                      <input
                        type="password"
                        id="password-field"
                        placeholder="Enter your password"
                        {...register("password", {
                          required: "Password is required",
                        })}
                      />
                      {errors.password && (
                        <span className="error-text">
                          {errors.password.message}
                        </span>
                      )}
                    </label>
                    <div className="btn-wrapper">
                      <Button type="submit" variant="alt">
                        Sign up Now
                      </Button>
                    </div>
                    <div className="register-wrapper">
                      <p>Already have an account? </p>

                      <Button
                        type="button"
                        variant="orange"
                        onClick={handleNavigate}
                      >
                        Login
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
          </div>
        </div>
        
          <Notification message={error|| "A verification email has been sent. Please check your inbox."} onClose={handleCloseNotification} />
        
      </section>
    </main>
  );
}

export default Home;
