import React from 'react'
import {Routes, Route, useLocation} from 'react-router-dom'
import Navbar from './components/layout/Navbar';
import Home from './pages/client/Home';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx'


const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");
  return (
    <div>
        {!isOwnerPath && <Navbar />}
        <div className='min-h-[70vh]'>
            <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/login'element={<Login/>}></Route>
           <Route path='/register' element={<Register/>}></Route>
            </Routes>
        </div>
    </div>
  )
}

export default App