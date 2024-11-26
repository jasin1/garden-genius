import "./Modal.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useContext, useState } from "react";
import Header from "../../components/Headers/Header.jsx";
import Button from "../../components/Button/Button.jsx";

function Modal() {
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

  return (
    <div className="main-overlay">
      <div className="modal-wrapper">
        <Header className={"intro-welcome-txt"} Tag={"h1"}>
          Login Please
        </Header>
        <div className="form-wrapper">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="form-container">
              <label htmlFor="name-filed">
                Name
                <input
                  type="text"
                  id="name-field"
                  placeholder="Enter your name"
                  {...register("username")}
                />
              </label>
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
                  <span className="error-text">{errors.password.message}</span>
                )}
              </label>

              {error && <span className="error-text">{error}</span>}

              <div className="btn-wrapper">
                <Button type="submit" variant="alt">
                  Login
                </Button>
              </div>
              <div className="register-wrapper">
                <p>If this is your first time, please </p>

                <Button type="button" variant="orange" onClick={handleNavigate}>
                  {" "}
                  Register{" "}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Modal;
