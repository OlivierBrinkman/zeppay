import Construction from "../assets/construction.png";
import { useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from '@rainbow-me/rainbowkit'
import {useAccount} from "wagmi"

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
      className:"home-toast"
    }).showToast();
  }
  

  function toApp() {
    if(!isConnected) {
      notification("No wallet connected", "danger")
    }
  }
  document.title = "Zeppay | Home ";
  return (
    <div class="home w3-animate-opacity">
      <div class="home-block-1">
        <div class="flex-div">
          <div>
            <h1>Crypto payment infrastructure,</h1>
            <h1>Empowering freelancers and creators.</h1>
          </div>
        </div>
        <div class="home-construction-text">
          <div>
            <img src={Construction} width="50" /> <h3>Hey there</h3>
          </div>
          <p>
             Good to see you. Zeppay is currently in beta. Questions? Leave a message. 
          </p>
          <div>
            <button class="btn-contact" onClick={() => navigate("/contact")}>
              Leave a message
            </button>{" "}
            {isConnected? 
            <button type="button" onClick={() => navigate("/create")} class="btn-beta">
              Use beta
            </button>:
            <button type="button"  onClick={() => openConnectModal()} class="btn-beta">
              Connect Wallet
          </button>}
          </div>
        </div>
      </div>
      <div class="background-overlay overlay-login"></div>
    </div>
  );
}

export default Home;
