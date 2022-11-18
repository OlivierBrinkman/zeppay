import React, {useState, useEffect} from "react";
import '@rainbow-me/rainbowkit/dist/index.css'
import Menu from "../Assets/menu.png";
import Logo from "../Assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';


function Navigation(props) { 
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState("/")
    const { connector: activeConnector, isConnected } = useAccount();

    useEffect(() => {
        const path = window.location.pathname;
        setActivePage(path);
        const menuToggle = document.getElementById("toggeler");
        let isToggle = menuToggle.getAttribute('aria-expanded');
        if(isToggle=="true") {
            document.getElementById("toggeler").click()
        }
    }, [navigate])

    return (
    <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
            <Link to="/">
                <a class="navbar-brand" href="#"><img src={Logo} width="35"/> Zeppay</a>
            </Link>
            <div class="desktop">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
               <img src={Menu} class="hamburger-menu"/>
            </button>
            </div>
            <div class="mobile">
                <button id="toggeler" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <img src={Menu} class="hamburger-menu"/>
                </button>
            </div>
            <div class="navbar-collapse collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-lg-0">
                    <Link to="/contact">
                        <li class="nav-item">
                            <a id={activePage=="/contact"?"active-page":""} class="nav-link contact" aria-current="page" href="#">Contact</a>
                        </li>
                    </Link>    
                </ul>
                <form class="d-flex connect-form" role="search">
                    <ul class="navbar-nav me-auto mb-lg-0">
                    {isConnected?<>
                         <Link to="/create">
                            <li class="nav-item">
                            <a id={activePage=="/create"?"active-page":""} class="nav-link create" aria-current="page" href="#">Create</a>
                            </li>
                        </Link>
                        <Link to="/profile">
                            <li class="nav-item">
                            <a id={activePage=="/transactions"?"active-page":""} class="nav-link profile" aria-current="page" href="#">Profile</a>
                            </li>
                        </Link></>:<></>}
                        <ConnectButton label="Connect Wallet"  />

                     
                    </ul>
                </form>
            </div>
        </div>
    </nav>
    )
}

export default Navigation;