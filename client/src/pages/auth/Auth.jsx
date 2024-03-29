import axios from "axios";
import React from "react";
import "./auth.scss";
import { useDispatch, useSelector } from "react-redux";
import { redirect } from "react-router-dom";
import {
  loginFailure,
  loginSuccess,
  loginRequest,
} from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const state = useSelector((state) => state.auth);
  const [credentials, setCredentials] = React.useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginRequest());

    const user = {
      email: credentials.email,
      password: credentials.password,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/login",
        user
      );
      dispatch(loginSuccess(res.data));
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (error) {
      console.log(error);
      dispatch(loginFailure("Kullanıcı adı veya şifre hatalı"));
    }
  };

  return (
    <div className="auth">
      <form className="auth_form" onSubmit={handleLogin}>
        <input
          className="auth_form_input"
          type="text"
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          placeholder="Email"
        />
        <input
          className="auth_form_input"
          type="password"
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          placeholder="Password"
        />
        <button className="auth_form_button" type="submit">
          Login
        </button>
        <div className="register">
          <span>Don't have an account?</span>

          <span className="register_link" onClick={() => navigate("/register")}>
            Register
          </span>
        </div>
        <div className="forgot_pass">
          <span
            onClick={() => navigate("/forgot-password")}
          >I forgot my password</span>
        </div>

        {state.error && (
          <p
            style={{ color: "red", textAlign: "center" }}
            className="auth_form_error"
          >
            {state.error}
          </p>
        )}
      </form>
    </div>
  );
}

export default Auth;
