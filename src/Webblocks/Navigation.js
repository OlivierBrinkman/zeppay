import React, { useState, useEffect } from "react";
import "@rainbow-me/rainbowkit/dist/index.css";
import Menu from "../assets/menu.png";
import Logo from "../assets/logo.png";
import Arrow from "../assets/arrow.png";

import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { isMobile } from "react-device-detect";

function Navigation(props) {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("/");
  const { connector: activeConnector, isConnected } = useAccount();

  useEffect(() => {
    const path = window.location.pathname;
    setActivePage(path);
    const menuToggle = document.getElementById("toggeler");
    let isToggle = menuToggle.getAttribute("aria-expanded");
    if (isToggle == "true") {
      document.getElementById("toggeler").click();
    }
  }, [navigate]);

  return (
    <>
      <nav class="navbar navbar-expand-lg">
        <div class="container nav">
          <Link to="/">
            <a class="navbar-brand" href="#">
              <img src={Logo} width="35" />
              <span>Zeppay</span> {isMobile && activePage.includes("/pay") ? <div id="pay-upper">Pay </div> : <></>}{isMobile && activePage.includes("/create") ? <div id="pay-upper">Create </div> : <></>}{isMobile && activePage.includes("/share") ? <div id="pay-upper">Share </div> : <></>}{isMobile && activePage == "/" ? <div id="pay-upper">Zeppay </div> : <></>}{""}
            </a>
          </Link>
          <div class="desktop">
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            ></button>
          </div>
          <div class="mobile">
            <button
              id="toggeler"
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <img src={Menu} class="hamburger-menu" />
            </button>
          </div>
          <div class="navbar-collapse collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-lg-0">
              {isConnected ? (
                <>
                  <Link to="/create">
                    <li class="nav-item last-create">
                      <a id={activePage == "/create" ? "active-page" : ""} class="nav-link create" aria-current="page" href="#">
                        <span>Create</span>
                        <img src={Arrow} width="14" />
                      </a>
                    </li>
                  </Link>
                </>
              ) : (
                <></>
              )}
              <Link to="/contact">
                <li class="nav-item">
                  <a id={activePage == "/contact" ? "active-page" : ""} class="nav-link contact" aria-current="page" href="#">
                    <span>Contact</span>
                    <img src={Arrow} width="14" />
                  </a>
                </li>
              </Link>
            </ul>
            <form class="d-flex connect-form c" role="search">
              <ul class="navbar-nav me-auto mb-lg-0">
                <ConnectButton label="Connect" />
              </ul>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navigation;
