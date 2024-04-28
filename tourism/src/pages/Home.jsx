import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"

function Home() {
  console.log('home')
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const user = useSelector((state) => state.auth.user); 
  console.log(isAuthenticated,user)

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(()=> {

    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          setError(error.message);
        }
      )
    }else{
      setError('Geolocation is not supported')
    }
  },[])

  return (
    <>
      <div>Home</div>
      <div>
        {isAuthenticated ? (
          <div>
            <h3>Welcome {user.username}</h3>
            <p>Email: {user.email}</p>
          </div>
        ) : (
          <div>
            <h3>Welcome Guest</h3>
            <p>Please login to continue</p>
          </div>
        )}
      </div>
      <div>
      {error && <p>Error: {error}</p>}
      {location && (
        <p>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      )}
      {/* Fetch personalized content based on location */}
    </div>
    </>
  )
}

export default Home