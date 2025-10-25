import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/authContext';
import EventCalendar from './pages/EventCalendar';
import NotFound from './pages/NotFound';
import AuthPages from './pages/AuthPages';
import GoogleCallback from './components/GoogleCallback';
import UserProfile from './pages/Profile';
import CreateUser from './pages/CreateUser';
import Safeguarding from './pages/Safeguarding';


export default function App() {
  // const getAutoTheme = () => {
  //   const hour = new Date().getHours();
  //   return hour >= 10 || hour < 7 ? 'dark' : 'light';
  // };

  // const [theme, setTheme] = useState(getAutoTheme);
  // const [userOverride, setUserOverride] = useState(false);

  // useEffect(() => {
  //   if (!userOverride) {
  //     const id = setInterval(() => setTheme(getAutoTheme()), 60000);
  //     return () => clearInterval(id);
  //   }
  // }, [userOverride]);

  // const toggleTheme = () => {
  //   setUserOverride(true);
  //   setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  // };



  //questa crud ("scelta a caso") l'ho inserita per non fare andare in stand-by il servizio di backend
  const eseguiCRUD = async () => {
    try {
      const response = await axiosInstance.get("/users");
    } catch (e) {
      console.log(`axios get users ${e}`);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      eseguiCRUD()
    }, 60000);

    return () => clearInterval(interval);
  }, []);



  return (

    <BrowserRouter>
      <AuthProvider>
        {/* <div className={`app-root ${theme}`}> */}
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/auth/google-callback" element={<GoogleCallback />} />
          <Route path='/events' element={<EventCalendar />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/Login" element={<AuthPages />} />
          <Route path="/me" element={<UserProfile />} />
          <Route path="/newUser" element={<CreateUser />} />
          <Route path="/safeguarding" element={<Safeguarding />} />

        </Routes>
        <Footer />
        {/* </div> */}
      </AuthProvider>
    </BrowserRouter>
  );
}