import '../Styles/Custom.css';
import '../Styles/Transitions.css';
import React, { useState, useEffect } from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Navigation from '../Webblocks/Navigation';
import Home from "./Home";
import Create from "./Create";
import Pay from "./Pay";
import Contact from "./Contact";
import NotFound from "./NotFound";
import Profile from "./Profile";
import Authorize from "./Authorize";

function App() {
  const session = window.sessionStorage.getItem("session");
  return (
    <div class="container-fluid padding-none">
      <BrowserRouter>
        <Navigation/>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/authorize" element={<Authorize />}></Route>
          <Route path="/create" element={<Create/>}></Route>
          <Route path="/pay/:base" element={<Pay />}></Route>
          <Route path="/profile" element={<Profile />}></Route>

          <Route path="/contact" element={<Contact />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
