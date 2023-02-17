import axios from "axios";
import React from "react";
import "./auth.scss";
import { toast } from "react-toastify";
function ForgotPass() {
  const [process, setProcess] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [credentials, setCredentials] = React.useState({
    email: "",
  });

  const showToastMessage = (status) => {
    console.log(status);
    if (status == "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error("Something went wrong", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();

    const user = {
      email: credentials.email,
    };
    setProcess(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/reset-password",

        user
      );
      setProcess(false);
      setMessage(res.data.message);
      showToastMessage("success");
      setCredentials({ email: "" });
    } catch (error) {
      console.log(error);
      setProcess(false);
      showToastMessage("error");
    }
  };

  return (
    <div className="auth">
      <form className="auth_form">
        <span
          style={{ color: "#cccccca9", textAlign: "center", padding: "1.5rem" }}
        >
          Please enter your email address. You will receive a link to create a
          new password via email.
        </span>

        <input
          className="auth_form_input"
          type="text"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          placeholder="Email"
        />

        <button
          className="auth_form_button"
          type="submit"
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={handleResetRequest}
        >
          {!process ? (
            "Reset Password"
          ) : (
            <i
              style={{
                fontSize: "1.2rem",

                color: "#000",
                position: "absolute",
              }}
              class="fas fa-spinner fa-spin"
            ></i>
          )}
        </button>

        {message && (
          <p
            style={{ color: "green", textAlign: "center" }}
            className="auth_form_error"
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default ForgotPass;
