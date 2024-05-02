import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import './App.css'
import ResetPassword from './pages/ResetPassword';
import Recc from './pages/Recc';
import Maps from './pages/Maps';


function App() {
  return (
    <BrowserRouter>
      {/* <nav>
        <Link to="/">Login</Link>
        <Link to="/register">Register</Link>
      </nav> */}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:id/:token' element={<ResetPassword/>} />
        <Route path="/" element={<Home />} />
        <Route path="/recc" element={<Recc />} />
        <Route path="/maps" element={<Maps />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
