import axios from "axios";
import React from "react";
import "./auth.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  loginFailure,
  loginSuccess,
  loginRequest,
} from "../../redux/auth/authSlice";

function Register() {
  const [credentials, setCredentials] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = React.useState("");
  const [error, setError] = React.useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const user = {
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/register",
        user
      );
      setMsg(res.data.message);
    } catch (error) {
      console.log(error);
      setError("Zaten kayıtlısınız");
    }
  };

  return (
    <div className="auth">
      <form className="auth_form" onSubmit={handleRegister}>
        <input
          className="auth_form_input"
          type="text"
          onChange={(e) =>
            setCredentials({ ...credentials, name: e.target.value })
          }
          placeholder="Name"
        />
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
          Register
        </button>
        {msg && (
          <p
            style={{ color: "green", textAlign: "center" }}
            className="auth_form_error"
          >
            {msg}
          </p>
        )}

        {error && (
          <p
            style={{ color: "red", textAlign: "center" }}
            className="auth_form_error"
          >
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

export default Register;
