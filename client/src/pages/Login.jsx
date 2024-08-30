import { useRef } from "react";
import Poster from "../assets/1.png";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser, setToken, setLoggedIn } from "../reducer/userSlice";
import { loginAPI } from "../api/users";

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (email === "" || password === "") {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const response = await loginAPI(email, password);
      dispatch(setUser(response?.user));
      dispatch(setToken(response?.token));
      dispatch(setLoggedIn(true));
      localStorage.setItem("_user", JSON.stringify(response?.user));
      localStorage.setItem("_token", response?.token);
      localStorage.setItem("_loggedIn", true);
      toast.success(response.message);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Login Error:", err.message);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="login">
      <div className="login__form">
        <h1>Already have an account?</h1>
        <label>Your personal job finder is here</label>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            ref={emailRef}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            ref={passwordRef}
            required
          />
          <button className="btn_submit" type="submit">
            Sign in
          </button>
        </form>
        <span>
          <label htmlFor="">Don’t have an account?</label>
          <Link to="/signup">
            Sign Up
          </Link>
        </span>
      </div>
      <div className="login__poster">
        <label>Your Personal Job Finder</label>
        <img src={Poster} alt="" />
      </div>
    </div>
  );
};

export default Login;
