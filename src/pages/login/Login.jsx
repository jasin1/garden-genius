import whiteLogo from "../../assets/white-logo.svg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useContext, useState } from "react";
// import axios from "axios";
import Button from "../../components/Button/Button.jsx";
import Header from "../../components/Headers/Header.jsx";
import Notification from "../../components/Notification/Notification.jsx";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  async function handleFormSubmit(data) {
    // console.log('Login nu!', register)

    try {
      // Call login from AuthContext which handles Supabase login internally
      const response = await login(data.email, data.password);
       console.log("Error received from AuthContext:", response?.error);

      if (response?.error) {
        setError(response.error); // Show error if any
      } else {
        navigate("/search"); // Redirect to homepage after successful login
      }
    } catch (error) {
      console.error("Login error: ", error);
      setError("Login failed: " + error.message);
    }
  }

  function handleNavigate() {
    navigate("/register");
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
              <Header className={"intro-welcome-txt"} Tag={"h1"}>
                Welcome Back!
              </Header>
              <p>
                Let&apos;s get our hands dirty and dive back into the green
                world of gardening together!
              </p>
            </div>
            <div className="form-wrapper">
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="form-container">
                  {/* <label htmlFor="name-filed">
                    Name
                    <input
                      type="text"
                      id="name-field"
                      placeholder="Enter your name"
                      {...register("username")}
                    />
                  </label> */}
                  <label htmlFor="email-filed">
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
                      <span className="error-text">{errors.email.message}</span>
                    )}
                  </label>

                  <label htmlFor="password-filed">
                    Password
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
                      Login
                    </Button>
                  </div>
                  <div className="register-wrapper">
                    <p>If this is your first time, please </p>

                    <Button
                      type="button"
                      variant="orange"
                      onClick={handleNavigate}
                    >
                      {" "}
                      Register{" "}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {error && (
          <Notification message={error} onClose={handleCloseNotification} />
        )}
      </section>
    </main>
  );
}

export default Login;
