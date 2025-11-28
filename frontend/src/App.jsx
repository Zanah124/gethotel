import React from 'react'
import {Routes, Route, useLocation} from 'react-router-dom'
import Navbar from './components/layout/Navbar';
import NavbarAdmin from './components/layout/NavbarAdmin.jsx';
import Home from './pages/client/Home';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Hotels from './pages/admin/hotels.jsx';

const App = () => {
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div>
        {/* Navbar conditionnelle */}
      {isAdminPath ? <NavbarAdmin /> : <Navbar />}

        <div className='min-h-[70vh]'>
            <Routes>
              {/*Route global utilise Navbar */}
            <Route path='/' element={<Home/>}></Route>
            <Route path='/login'element={<Login/>}></Route>
           <Route path='/register' element={<Register/>}></Route>

            {/*Route global utilise NavbarAdmin */}
           <Route path='/admin/dashboard' element={<Dashboard/>}></Route>
           <Route path='/admin/hotels' element={<Hotels/>}></Route>
            </Routes>
        </div>
    </div>
  )
}

export default App