import { useParams } from "react-router-dom";
import { decode as base64_decode } from "base-64";
import { useState, useEffect } from "react";
import { useAccount,useNetwork } from "wagmi";
import { isMobile } from "react-device-detect";
import { getRequest, logPayment, logEvent } from "../helpers/supabase";
import TransferERC20 from "../helpers/transfer";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { fetchTokenPrice } from "../helpers/moralis";

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

  useEffect(() => {
    retrieveRequest(base);
  }, []);

  async function retrieveRequest(cid) {
    let decodedCDI = base64_decode(cid);
    const response = await getRequest(decodedCDI);
    const price = await fetchTokenPrice(response[0].token);
    setTokenPrice(price);
    setRequestForPayment(response[0]);
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

  async function setRequestForPayment(request) {
    if (isConnected) {
      if (request.chain != chain.name) {
        notification("Switch Network!", "danger", 4000);
      }
    }
    setRequest(request);
    setIsFetching(false);
    setTimeout(function () {
      setIsLoading(false);
    }, 500);
  }

  async function paymentComplete(data) {
    if (data.hash) {
      notification("Verifying signature...", "prime", 4000);
      setTimeout(function () {
        _logPayment(data.hash);
        setIsSuccess(true);
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
    notification("All check", "success", 4000);
    console.log(base + " " + base64_decode(base));
    logPayment(hash, request, base64_decode(base));

    setIsSuccess(true);
    setIsLoading(false);
  }

  function paymentSettled() {
    setCanPay(false);
    setIsLoading(false);
    setIsPaying(false);
  }

  if (!isFetching) {
    if (isSuccess) {
      return (
        <div class="wrapper w3-animate-opacity">
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            {" "}
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" /> <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
          <h1>Payment completed</h1>
          <span>
            You can close this page by clicking <a href={window.location.origin + "/"}>here</a>{" "}
          </span>
        </div>
      );
    } else {
      return (
        <div class="container page create payment ">
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
                          <img src={request.token.icon} width="20" /> {request.amount} {request.token.symbol}
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
                          <img src={request.token.icon} width="48" /> {parseInt(request.amount).toLocaleString()} {request.token.symbol}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div class="pay-data">
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
                </div>
                <div class="payment-buttons">
                  {isConnected ? (
                    <div class="">
                      <div class="chain-status">Network status :{request.chain != chain.name ? <span class="wrong-network"> Switch to {request.chain}</span> : <span class="ok-network">Ok</span>}</div>
                      <TransferERC20
                        errorOccured={errorOccured}
                        decimals={request.token.decimals}
                        startPaying={startPaying}
                        contract={request.chain == "Ethereum" ? request.token.contract : request.token.contract_5}
                        symbol={request.token.symbol}
                        icon={request.token.icon}
                        paymentSettled={paymentSettled}
                        paymentComplete={paymentComplete}
                        address={request.destination}
                        chain={request.chain}
                        amount={request.amount}
                      />
                    </div>
                  ) : (
                    <div class="not-connected">
                      <ConnectButton label="Connect Wallet" />
                    </div>
                  )}
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
                        Page stuck? Refresh here
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
          {isMobile ? (
            <div class="background-overlay-mobile-pay"></div>
          ) : (
            <>
              <div class="background-overlay top"></div>
              <div class="background-overlay"></div>
            </>
          )}
        </div>
      );
    }
  }
}

export default Pay;
