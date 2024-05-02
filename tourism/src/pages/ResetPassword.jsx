import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import toast, {Toaster} from 'react-hot-toast'
import axios from "axios"
import { resetPasswordRoute } from "../util/APIroutes"
import BgImg from "../assets/loginImg5.png";


function ResetPassword() {
    const navigate = useNavigate()
    const [values,setValues] = useState({
        newPassword : '',
        confirmNewPassword : '',
    })

    const {id ,token} = useParams()

    const [errors,setErrors] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(handleValidation()){
            const formData = new FormData();
            formData.append('newPassword',values.newPassword);
            try{
                // const config = {
                //     headers: {
                //         Authorization: `Bearer ${token}`
                //     }
                // }
                const { data } = await axios.post(`${resetPasswordRoute}/${id}/${token}`,formData)
                console.log(data)
                navigate('/login')
            }catch(err){
                console.log("failed to update pass : ",err)
                toast.error('Update Password Failed')
            }
        }
    }

    const handleValidation = () => {
        const {newPassword, confirmNewPassword} = values
        let errors = {};
        if (!newPassword){
            errors.password = "Password is required";
            toast.error('New Password is required')
        }else if (newPassword.length < 8){
            errors.password = "New Password must be atleast 8 characters";
            toast.error("New Password must be atleast 8 characters");
        }

        if(!confirmNewPassword){
            errors.confirmNewPassword = "Confirm New Password is required";
            toast.error("Confirm New Password is required")
        }else if(confirmNewPassword !== newPassword){
            errors.confirmNewPassword = "Passwords do not match";
            toast.error("Passwords do not match !")
        }
        setErrors(errors)
        return Object.keys(errors).length === 0;
    }

    const handleChange = (e) => {
        const {name,value} = e.target
        setValues((prevState) => ({
            ...prevState,
            [name]: value,
          }));
    }

  return (
    <div className="auth">
        <Toaster
        position="top-center"
        reverseOrder={false}
      />
        <div className="left">
            <img src={BgImg} alt="background" />
        </div>
        <div className="right">
        <form onSubmit={(e) => handleSubmit(e)}>
                <div className="heading">
                    <h2>Reset Password</h2>
                </div>
                <div>
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={values.newPassword}
                        onChange={handleChange}
                        required
                    />
                    {errors.newPassword && <p>{errors.newPassword}</p>}
                </div>
                <div>
                    <input
                        type="password"
                        name="confirmNewPassword"
                        placeholder="Confirm New Password"
                        value={values.confirmNewPassword}
                        onChange={handleChange}
                        required
                    />
                    {errors.confirmNewPassword && <p>{errors.confirmNewPassword}</p>}
                </div>
                <span className="direction-txt"><Link to='/login'>Back</Link></span>
                <button type='submit' className="cssbuttons-io-button">Confirm</button>
            </form>
        </div>
    </div>
            
  )
}

export default ResetPassword