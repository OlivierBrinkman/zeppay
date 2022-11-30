import '../styles/custom.css';
import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Navigation from '../webblocks/navigation';
import Home from "./home";
import Create from "./create";
import Pay from "./pay";
import Share from "./share";
import Contact from "./contact";
import NotFound from "./notfound";
function App() {
  document.title = "Zeppay"



  return (
    <div class="container-fluid padding-none">
      <BrowserRouter>
        <Navigation/>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/create" element={<Create/>}></Route>
          <Route path="/pay/:base" element={<Pay />}></Route>
          <Route path="/share" element={<Share />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
