import axios from "axios";
import { useState } from "react";
import { forgotPasswordRoute } from "../util/APIroutes";
import { Link } from "react-router-dom";
import BgImg from "../assets/loginImg5.png";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    try {
      const { data } = await axios.post(forgotPasswordRoute, formData);
      console.log(data);
    } catch (err) {
      console.log("forgot password error : ", err);
    }
  };

  return (
    <div className="auth">
      <div className="left">
        <img src={BgImg} alt="background" />
      </div>
      <div className="right">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="heading">
            <h2>Forgot Password</h2>
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          <span className="direction-txt"><Link to="/login">Back to Login</Link></span>
          <button type="submit" className="cssbuttons-io-button">Send Link</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
