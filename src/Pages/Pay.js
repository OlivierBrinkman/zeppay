import { useParams } from "react-router-dom";
import { decode as base64_decode } from "base-64";
import { useState, useEffect } from "react";
import { useAccount, useToken, useProvider, useNetwork } from "wagmi";
import { isMobile } from "react-device-detect";
import { getRequest, logPayment, logEvent } from "../helpers/supabase";
import Transfer from "../webblocks/transfer";
import MC from "../assets/mc.png";
import Visa from "../assets/visa.png";
import "../styles/pay.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { getPriceByChain } from "../helpers/moralis";
import Invoice from "../helpers/invoice";
import {importToken,addBNBSmartChain} from "../helpers/rpc";
import "../styles/home.css";
import { EvmChain } from "@moralisweb3/evm-utils";
import Web3 from "web3";


function Pay() {
  const { base } = useParams();
  const { isConnected, address} = useAccount();
  const [showCancel, setShowCancel] = useState(false);
  const { chain } = useNetwork();
  const [isLoading, setIsLoading] = useState(true);
  const [request, setRequest] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();
  const [canPay, setCanPay] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [tokenContract, setTokenContract] = useState("")
  const [hash, setHash] = useState("");
  const provider = useProvider();

  const web3 = new Web3(provider);

  useEffect(() => {
    if(base!="") { 
        retrieveRequest(base);
        
    }
  }, []);

  useEffect(()=> {
    if(request.token) {
      priceFetch()
      //setTokenPrice(sessionStorage.getItem(saveLabel));  
    }
  },[request])



  async function priceFetch() {
    let response;
    if(chain.name == "Ethereum") {
     response = await getPriceByChain(request.token, EvmChain.ETHEREUM);
    } else if (chain.name == "BNB Smart Chain") { 
      response = await getPriceByChain(request.token, EvmChain.BSC);
    } else if(chain.name == "Goerli") {
      response = await getPriceByChain(request.token, EvmChain.ETHEREUM);
    } else if(chain.name == "BSC Testnet") { 
      response = await getPriceByChain(request.token, EvmChain.BSC);
    }
    setTokenPrice(response)
  }

  async function retrieveRequest(cid) {
    let decodedCDI = base64_decode(cid);
    const response = await getRequest(decodedCDI);
    if(response) {
      setTokenContract(response[0].token.contract);
      setRequestForPayment(response[0]);
    }
  }



  function refresh() {
    notification("Payment restarted", "warning", 4000);
    setCanPay(false);
    setIsLoading(false);
    setIsPaying(false);
  }

  function notification(title, type, duration) {
    let danger = "#d63031";
    let success = "#2ecc71";
    let prime = "#000";
    let warning = "#e67e22";
    let background;
    if (type == "danger") {
      background = danger;
    } else if (type == "prime") {
      background = prime;
    } else if (type == "warning") {
      background = warning;
    } else {
      background = success;
    }
    Toastify({
      text: title,
      gravity: "bottom",
      duration: duration,
      close: true,
      position: "left",
      backgroundColor: background,
    }).showToast();
  }

  async function errorOccured(error) {
    notification(error, "danger", 4000);
    const response = await logEvent(404, error, address)
    setCanPay(false);
    setIsLoading(false);
    setIsPaying(false);
  }


  async function switchNetwork() {
    let requestChainId;
    switch(request.chain) {
      case "Ethereum": requestChainId = 1;
    break;
      case "BNB Smart Chain": requestChainId = 56;
    break;
      case "BSC Testnet" : requestChainId = 97;
    break;
      case "Goerli" : requestChainId = 5;
    break;
      default: requestChainId = 1;
    }

      if (window.ethereum) {
        try {
          await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
            params: [{ chainId: web3.utils.toHex(requestChainId) }],
          });
        } catch (error) {
          console.error(error);
        }
      }
    }

function openInNewTab(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
  async function setRequestForPayment(request) {
    if (isConnected) {
      setRequest(request);
      setIsFetching(false);
      setIsLoading(false);
    if (request.chain != chain.name) {
      notification("Switch Network!", "danger", 4000);
    }
  }

  }

  async function paymentComplete(data) {   
    if (data.hash) {
      notification("Verifying signature...", "prime", 4000);
      setTimeout(function () {
        _logPayment(data.hash);
        setIsSuccess(true);
        document.getElementById("slideup").classList.add("complete")
      }, 3000);
    }
  }

  function startPaying() {
    setIsLoading(true);
    setIsPaying(true);
    setTimeout(function () {
      setShowCancel(true);
    }, 8000);
  }

  


  async function _logPayment(hash) {
    setHash(hash);
    logPayment(hash, request, base64_decode(base));

    setIsSuccess(true);
    setIsLoading(false);
  }
    if (isSuccess) {
      return (
        <div class="wrapper">
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            {" "}
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" /> <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
          <h1>Payment completed</h1>
          <span>
            You can close this page by clicking <a href={window.location.origin + "/"}>here</a>{" "}
          </span>
        {/* <Invoice hash={hash} request={request} address={address}/> */}
        <div id="slideup" class="home-overlay w3-animate-opacity"></div>

        </div>
      );
    } else {
      return (<>
        <div class="container page create payment  ">
          <div class="pay-content">
            {!isLoading ? (
              <div class="payment-overview">
                {error ? (
                  <div class="alert alert-primary" role="alert">
                    {error}
                  </div>
                ) : (
                  <></>
                )}
                <div class="payment-details">
                  <a>Pay with Zeppay</a>
                  {isMobile ? <></> : <h1 id="share-title">Confirm</h1>}
                  {!isMobile ? (
                    <>
                      <div class="payment-group message">
                        <div>{request.message}</div>
                      </div>

                      <div class="payment-group total">
                        <div>
                          <img src={request.token.icon} width="20" /> {request.amount.toLocaleString()} {request.token.symbol}
                        </div>
                        <span class="total-amount-usd">~ ${Number.parseFloat(tokenPrice * request.amount).toFixed(2)}</span>
                        <div class="amount-per-unit">
                          1 {request.token.symbol} : ~${tokenPrice}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div class="mobile-payment-group total">
                        <div>
                          <img src={request.token.icon} width="40" /> {request.amount.toLocaleString()} {request.token.symbol}
                        </div>
                      </div>
                    </>
                  )}
                </div>
            
                <div class="pay-data w3-animate-top">
               
                  <div class="payment-group large">
                    <div>{request.message ? request.message : "No message"}</div>
                  </div>

                  <div class="payment-group total mobile">
                    <span class="total-amount-usd">~ ${Number.parseFloat(tokenPrice * request.amount).toFixed(2)}</span>
                    <div class="amount-per">
                      <div class="amount-per-unit">
                        1 {request.token.symbol} : ~${tokenPrice}
                      </div>
                    </div>
                  </div>
                  <div class="payment-buttons">
                    
                  {isConnected ? (
                    <div class="">
                 
                      <div class="import-buttons">
                      {isMobile?
                      <div class="dapp-container">
                          <button  onClick={() => openInNewTab('https://metamask.app.link/dapp/'+window.location.href)} class="btn-import">Pay with dApp</button>
                        </div> : <></>}
                      {request.chain=="BNB Smart Chain"?<button onClick={()=> addBNBSmartChain()} class="btn-import"><img src={"https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/black/bnb.svg"} width="24"/> Import network</button>:<></>}

                      
                      
                      </div>

                      <Transfer switchNetwork={switchNetwork} paymentComplete={paymentComplete} errorOccured={errorOccured} startPaying={startPaying} request={request} contract={request.chain=="Ethereum" || request.chain ==  "BNB Smart Chain"?request.token.contract:request.token.contract_test}/>
                      <div onClick={() => notification("Coming soon", "prime", 4000)} class="col pay-option fiat">
                          <span>
                            Pay with card
                          </span>
                          <img src={MC} height="20" />
                          <img src={Visa} height="20" />
                 
                        </div>
                    </div> 
                  ) : (
                    <div class="not-connected">
                      <ConnectButton label="Connect Wallet" />
                    </div>
                  )}
                </div>
                </div>
               
              </div>
            ) : (
              <div class="loading-transactions pay">
                <div class="sk-chase">
                  <div class="sk-chase-dot"></div>
                  <div class="sk-chase-dot"></div>
                  <div class="sk-chase-dot"></div>
                  <div class="sk-chase-dot"></div>
                  <div class="sk-chase-dot"></div>
                  <div class="sk-chase-dot"></div>
                </div>
                {isPaying ? (
                  <>
                    <h3>Processing payment...</h3>

                    {showCancel ? (
                      <button onClick={() => refresh()} class="btn btn-primary btn-restart w3-animate-bottom">
                        Page stuck? Try open in Dapp or use another browser. 
                      </button>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>

          <div class="home-overlay w3-animate-opacity"></div>

    
        </div>

        </>
      );
    }
  
}

export default Pay;
