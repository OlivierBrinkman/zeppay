import { useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import { useConnectModal, useAccountModal, useChainModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { isMobile } from "react-device-detect";


import "../styles/home.css";

function Home() {
  const navigate = useNavigate();
  const { address, isDisconnected, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();


  function notification(title, type) {
    let danger = "#d63031";
    let success = "#5657FE";
    let background;
    if (type == "danger") {
      background = danger;
    } else {
      background = success;
    }
    Toastify({
      text: title,
      gravity: "bottom",
      newWindow: true,
      duration: 3000,
      position: "left",
      backgroundColor: background,
      className: "home-toast",
    }).showToast();
  }


function openInNewTab(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

  return (
    <div class="home w3-animate-opacity">
      <div class="home-block-1">
        <div class="flex-div">
          <div>
            <h1>Crypto payment infrastructure,</h1>
            <h1>Empowering freelancers and creators.</h1>
            {isMobile?      <button type="button" onClick={() => openInNewTab('https://metamask.app.link/dapp/zeppay.app/')} class="btn-dapp">
                Use beta
              </button> :<></>}
          </div>
        </div>
        <div class="home-construction-text w3-animate-left">
          <div>
           <h3>Hey there</h3>
          </div>
          <p>Good to see you. Zeppay is currently in beta. Questions? Leave a message.</p>
          <div>
            <button class="btn-contact" onClick={() => navigate("/contact")}>
              Leave a message
            </button>{" "}
            {isConnected ? (<>
              {!isMobile?      <button type="button" onClick={() => navigate("/create")} class="btn-beta">
                Use beta
              </button> :<></>}</>
            ) : (
              <button type="button" onClick={() => openConnectModal()} class="btn-beta">
                Connect Wallet
              </button>
            )}
          </div>
        </div>

      </div>

 <div class="home-overlay w3-animate-opacity"></div>

    </div>
  );
}

export default Home;
