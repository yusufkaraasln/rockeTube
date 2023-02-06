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
function Auth() {
  const dispatch = useDispatch();

  const url = "https://www.instagram.com/accounts/login/ajax/";

  const userAccounts = [
    { phone_number: "1234567890", password: "pass1" },
    { phone_number: "0987654321", password: "pass2" },
    { phone_number: "1029384756", password: "pass3" },
  ];

  

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
