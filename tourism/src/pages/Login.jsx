import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { loginRoute } from "../util/APIroutes"; // Assuming you have a login route defined
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";
import BgImg from "../assets/loginImg5.png";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  // const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    console.log(formData);
    try {
      const { data } = await axios.post(loginRoute, formData);
      console.log(data);
      const userData = { user: data.userData };
      dispatch(login(userData));
      navigate("/");
    } catch (err) {
      console.log("login error:", err);
    }
  };

  return (
    <div className="auth">
      <div className="left">
        <img src={BgImg} alt="" />
      </div>
      <div className="right">
        <form onSubmit={handleSubmit}>
          <div className="heading">
            <h2>Login</h2>
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              required
            />
          </div>
          {/* <button onClick={()=>setIsForgotPassword(!isForgotPassword)}>Forgot Password</button> */}
          <Link to="/forgot-password">Forgot Password</Link>
          <button className="cssbuttons-io-button" type="submit">
            Login
          </button>
            <span className="direction-txt">Don&apos;t have an account? <Link to="/register">Register</Link></span>
        </form>
      </div>
    </div>
  );
}

export default Login;
