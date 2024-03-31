import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setCredentials } from "../store/auth-slice";
import { useLoginMutation } from "../api/auth-api-slice";

function Login() {
  const userRef = useRef();
  const errRef = useRef();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pass]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email: user, password: pass }).unwrap();
      console.log(userData);
      dispatch(setCredentials(userData));
      setUser("");
      setPass("");
      navigate("/welcome");
    } catch (err) {
      if (!err?.originalStatus) {
        setErrMsg("No server response");
      } else if (err?.originalStatus?.status === 400) {
        setErrMsg("Missing username or password");
      } else if (err?.originalStatus?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUser(e.target.value);
  const handlePassInput = (e) => setPass(e.target.value);

  const content = isLoading ? (
    <h1>Loading...</h1>
  ) : (
    <>
      <p ref={errRef} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          value={user}
          onChange={handleUserInput}
          autoComplete="off"
          required
        />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={pass} onChange={handlePassInput} required />
        <button>Sign In</button>
      </form>
    </>
  );

  return content;
}

export default Login;
