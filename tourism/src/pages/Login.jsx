import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loginRoute } from '../util/APIroutes'; // Assuming you have a login route defined

function Login() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email',values.email)
    formData.append('password',values.password)
    console.log(formData)
    try {
      const { data } = await axios.post(loginRoute, formData);
      console.log(data);
      navigate('/'); 
    } catch (err) {
      console.log('login error:', err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={values.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            name="password" 
            value={values.password} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
