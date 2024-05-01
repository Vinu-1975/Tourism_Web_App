import { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import { registerRoute } from "../util/APIroutes";
import toast, { Toaster } from "react-hot-toast";
import BgImg from "../assets/loginImg5.png";

function Register() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });


  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(name,value)
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      values.gender = gender
      const formData = new FormData();
      formData.append("username", values.name);
      formData.append("email", values.email);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("gender", values.gender);
      formData.append("password", values.password);
      formData.append("confirmPassword", values.confirmPassword);
      console.log(formData);
      try {
        const { data } = await axios.post(registerRoute, formData);
        console.log(data);
        if (data.status === false) {
          toast.error(data.message);
        }
        if (data.status == true) {
          navigate("/login");
        }
      } catch (err) {
        console.log("register error : ", err);
        toast.error("Registration failed");
      }
    } else {
      console.log("validation failed");
    }
  };

  const handleValidation = () => {
    const { name, email, phoneNumber, password, confirmPassword } = values;
    let errors = {};
    if (!name) {
      errors.username = "Username is required";
      toast.error("Username is required");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = "Email is required";
      toast.error("Email is required");
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email";
      toast.error("Invalid email");
    }

    if (!phoneNumber) {
      errors.phoneNumber = "Phone number is required";
      toast.error("Phone number is required");
    } else if (phoneNumber.length !== 10) {
      errors.phoneNumber = "Invalid phone number";
      toast.error("Invalid phone number");
    }

    // if(!gender){
    //   errors.gender = "choose one"
    // }

    if (!password) {
      errors.password = "Password is required";
      toast.error("Password is required");
    } else if (password.length < 8) {
      errors.password = "Password must be atleast 8 characters";
      toast.error("Password must be atleast 8 characters");
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
      toast.error("Confirm password is required");
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
      toast.error("Passwords do not match");
    }
    setErrors(errors);
    console.log(errors);
    return Object.keys(errors).length === 0;
  };

  const [gender, setGender] = useState("Male");

  const handleChangeR = (event) => {
    setGender(event.target.value);
  };

  return (
    <div className="auth lato-light">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="left">
        <img src={BgImg} alt="" />
      </div>
      <div className="right">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="heading">
            <h2>Register</h2>
          </div>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={values.name}
              onChange={handleChange}
            />
            <span className="input-border"></span>
            {errors.username && <p>{errors.username}</p>}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && <p>{errors.email}</p>}
          </div>
          <div>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={values.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div>
            {/* <select
                name="gender"
                value={values.gender}
                onChange={handleChange}
                // required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select> */}
            <div className="radio-inputs lato-regular">
              <label className="radio">
                <input
                  type="radio"
                  name="radio"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={handleChangeR}
                />
                <span className="name">Male</span>
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="radio"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={handleChangeR}
                />
                <span className="name">Female</span>
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="radio"
                  value="Others"
                  checked={gender === "Others"}
                  onChange={handleChangeR}
                />
                <span className="name">Others</span>
              </label>
            </div>
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              // required
            />
            {errors.password && <p>{errors.password}</p>}
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={values.confirmPassword}
              onChange={handleChange}
              // required
            />
            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          </div>
          <button className="cssbuttons-io-button" type="submit">
            Create Acount
          </button>
          <span className="direction-txt">Already have an account? <Link to='/login'>Login</Link></span>
        </form>
      </div>
    </div>
  );
}

export default Register;
