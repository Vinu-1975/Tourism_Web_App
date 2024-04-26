import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { registerRoute } from '../util/APIroutes';

function Register() {
  const navigate = useNavigate()

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(name,value)
    setValues(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username',values.name)
    formData.append('email',values.email)
    formData.append('password',values.password)
    console.log(formData)
    try {
      const { data } = await axios.post(registerRoute,formData)
      console.log(data)
      navigate('/login')
    }
    catch(err) {
      console.log('register error : ',err)
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={values.name} 
            onChange={handleChange} 
            required 
          />
        </div>
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
