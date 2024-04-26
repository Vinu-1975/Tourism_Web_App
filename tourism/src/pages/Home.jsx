import { useSelector } from "react-redux"

function Home() {
  console.log('home')
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const user = useSelector((state) => state.auth.user); 
  console.log(isAuthenticated,user)
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
    </>
  )
}

export default Home