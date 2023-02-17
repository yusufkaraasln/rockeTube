import axios from "axios";
import React, { useEffect } from "react";
import "./auth.scss";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
function ResetPassword() {
  const [process, setProcess] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const navigate = useNavigate();

  const [valid, setValid] = React.useState(null);
  const [credentials, setCredentials] = React.useState({
    password: "",
    rePassword: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/check-token/${token}`
        );

        if (res.status == 200) {
          setValid(true);
        }
      } catch (error) {
        setValid(false);

        console.log(error);
      }
    })();
  }, []);

  const { id, token } = useParams();

  const handleResetRequest = async (e) => {
    e.preventDefault();

    const user = {
      password: credentials.password,
      rePassword: credentials.rePassword,
    };
    setProcess(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/user/${id}/reset-password/${token}`,
        user
      );
      setProcess(false);
      setMessage(res.data.message);
      setCredentials({
        password: "",
        rePassword: "",
      });
      toast.success(
        "Password changing successfully! You are redirected to the login page",
        {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        }
      );

      setTimeout(() => {
        window.location.replace("/");
      }, 1500);
    } catch (error) {
      console.log(error);
      setProcess(false);
    }
  };

  return (
    <>
      <div className="auth">
        <>
          {valid ? (
            <form className="auth_form">
              <span
                style={{
                  color: "#cccccca9",
                  textAlign: "center",
                  padding: "1.5rem",
                }}
              >
                Reset Your Password
              </span>

              <input
                className="auth_form_input"
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                placeholder="Password"
              />
              <input
                className="auth_form_input"
                type="password"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, rePassword: e.target.value })
                }
                placeholder="Re-Enter Password"
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
          ) : (
            <p style={{ color: "red", textAlign: "center" }}>
              Token is not valid
            </p>
          )}{" "}
        </>
      </div>
      <ToastContainer />
    </>
  );
}

export default ResetPassword;
