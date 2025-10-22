
import { useState } from 'react';
import './App.css'
import { Routes,Route, BrowserRouter } from 'react-router'

import Login from './pages/Login';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';

function App() {

  return <>
  <BrowserRouter>
    {/* <UserContext.Provider value={{ username, setUsername }}> */}
        {/* <Navbar/> */}
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
    {/* </UserContext.Provider> */}
  </BrowserRouter>
  </>
}

export default App
