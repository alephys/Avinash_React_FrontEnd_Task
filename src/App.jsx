
import { useState } from 'react';
import './App.css'
import { Routes,Route, BrowserRouter } from 'react-router'

import Login from './pages/Login';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import TopicView from './components/TopicView';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/topic/:topicName" element={<TopicView />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
