import React, { useState, useEffect } from "react";
import { encode as base64_encode } from "base-64";
import { QRCode } from "react-qrcode-logo";
import { useNavigate } from "react-router-dom";
import Moralis from "moralis";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { EvmChain } from "@moralisweb3/evm-utils";
import Whatsapp from "../assets/whatsapp.png";
import Telegram from "../assets/tele.png";
import Copy from "../assets/copy.png";
import Discord from "../assets/discord.png";
import Messenger from "../assets/messenger.png";
import Slack from "../assets/slack.png";
import SMS from "../assets/sms.png";
import Gmail from "../assets/gmail.png";
import VK from "../assets/vk.png";
import Sign from "../assets/sign.png";
import Tokens from "../webblocks/tokens";
import { isMobile } from "react-device-detect";
import { requestTransactionSignatureMessage } from "../helpers/moralis";
import { logRequest } from "../helpers/supabase";
import Toastify from "toastify-js";
import { verifyMessage } from "ethers/lib/utils";
import "toastify-js/src/toastify.css";
import { _getTokens } from "../helpers/supabase";
import Select from "react-select";

function Create() {
  const navigate = useNavigate();
  const { address, isDisconnected, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [shareText, setShareText] = useState("");
  const [tokenPrice, setTokenPrice] = useState();
  const [plainText, setPlainText] = useState("");
  const [isPageLoading, setIsLoading] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [isAmountInvalid, setIsAmountInvalid] = useState(false);
  const APIKEY = process.env.REACT_APP_MORALIS_API_KEY;
  const [cdiLink, setCdiLink] = useState("");
  const [isShare, setIsShare] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isTokenPopUp, setIsTokenPopUp] = useState(false);
  const [transactionToSign, setTransactionToSign] = useState();
  const [rawFiles, setRawFiles] = useState([]);
  const [request, setRequest] = useState({
    destination: "",
    token: {},
    amount: 0,
    name: "",
    chain: "",
    message: "",
    price: 0,
    image: "",
    dateCreated: new Date(),
    signature: "",
    signedMessage: "",
  });


  const [stableTokens, setStableTokens] = useState([]);
  const [cryptoTokens, setCryptoTokens] = useState([]);
  useEffect(() => {
    getStableTokens();
    getCryptoTokens();
  }, []);

  async function getStableTokens() {
    const response = await _getTokens("Stable");
    setStableTokens(response);
    setRequest((request) => ({ ...request, token: response[0] }));
    getTokenPriceSetToken(response[0]);
  }

  async function getCryptoTokens() {
    const response = await _getTokens("Crypto");
    setCryptoTokens(response);
  }

  const {signMessage } = useSignMessage({
    message: request.signedMessage,
    onSuccess(data, variables) {
      const address = verifyMessage(variables.message, data);
      notification("Request signed successfully", "success");
      setRequest((request) => ({ ...request, signature: data }));
      setTimeout(function () {
        finishAndShareRequest(data);
        setIsSigning(false);
      }, 2000);
    },
    onError(error) {
      setIsLoading(false);
      setIsSigning(false);
      setShowCancel(false);
      notification("Signature declined", "danger");
    },
  });

  useEffect(() => {
    if (isSigning) {
      setTimeout(function () {
        setShowCancel(true);
      }, 8000);
    }
  }, [isSigning]);

  function notification(title, type) {
    let danger = "#d63031";
    let success = "#2ecc71";
    let background;
    if (type == "danger") {
      background = danger;
    } else {
      background = success;
    }
    Toastify({
      text: title,
      gravity: "bottom",
      duration: 3000,
      position: "left",
      close: true,
      backgroundColor: background,
    }).showToast();
  }

  useEffect(() => {
    if (isDisconnected) {
      navigate("/");
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      setRequest((request) => ({
        ...request,
        destination: address,
        chain: chain.name,
      }));
    }
  }, []);

  useEffect(() => {
    setIsAmountInvalid(false);
    if (request.amount != 0) {
      var formattedPrice = Number.parseFloat(tokenPrice * request.amount).toFixed(2);

      setRequest((request) => ({
        ...request,
        price: formattedPrice.toString(),
      }));
    }
  }, [request.amount, request.token]);

  useEffect(() => {
    if (cdiLink != "") {
      setIsShare(true);
      setIsLoading(false);
    }
  }, [cdiLink]);

  useEffect(() => {
    if (request.signedMessage) {
      getSignatureSigner();
    }
  }, [request.signedMessage]);

  async function getTokenPriceSetToken(token) {
    if (token) {
      setRequest((request) => ({ ...request, token: token }));
      const saveLabel = token.symbol + "_USD";
      var savedPrice = sessionStorage.getItem(saveLabel);
      if (savedPrice) {
        setTokenPrice(savedPrice);
      } else {
        const chain = EvmChain.ETHEREUM;
        const address = token.contract;
        await Moralis.start({ apiKey: APIKEY });
        const response = await Moralis.EvmApi.token.getTokenPrice({
          address,
          chain,
        });
        const usdPrice = Number.parseFloat(response.data.usdPrice).toFixed(2);
        sessionStorage.setItem(saveLabel, usdPrice);
        setTokenPrice(usdPrice);
      }
    }
  }

  async function storeRequest() {
    if (request.token != {}) {
      if (request.amount == 0) {
        notification("Missing amount", "danger");
        setIsAmountInvalid(true);
      } else {
        if (request.amount.includes(",")) {
          notification("Comma's are not allowed", "danger");
          setIsAmountInvalid(true);
        } else {
          setIsSigning(true);
          setIsAmountInvalid(false);
          setIsLoading(true);
          await prepareRequestSignature();
        }
      }
    } else {
      notification("Missing Token", "danger");
    }
  }

  async function prepareRequestSignature() {
    const signatureMessage = await getTransactionSignatureMessage();
    setRequest((request) => ({ ...request, signedMessage: signatureMessage }));
  }

  async function getTransactionSignatureMessage() {
    const message = await requestTransactionSignatureMessage(address, EvmChain.ETHEREUM, "evm");
    return message;
  }

  function refresh() {
    setIsLoading(false);
    setShowCancel(false);
    setIsSigning(false);
  }

  async function getSignatureSigner() {
    await signMessage();
  }

  async function finishAndShareRequest(signature) {
    let response = await logRequest(signature, request);
    if (response.length == 20) {
      try {
        let payURL = window.location.origin + "/pay/" + base64_encode(response);
        setCdiLink(payURL);
        var _text =
          "Hi, would you please transfer me *" +
          request.amount +
          "* *" +
          request.token.symbol +
          "* for '*" +
          request.message +
          "*' via " +
          "\n\n" +
          payURL +
          " \n\n" +
          "_ " +
          "\n\n" +
          "_Made with Zeppay_";
        var _textplain = "Hi, would you please pay me " + parseInt(request.amount).toLocaleString() + "" + request.token.symbol + " for " + request.message + " via " + "\n\n" + payURL;
        setPlainText(_textplain);
        navigate('/share',{state:{request:request,cdiLink:payURL, shareText:shareText, plainText:_textplain}});
      } catch {
        setIsLoading(false);
      }
    }
  }

  function closeTokenPopUp() {
    setIsTokenPopUp(false);
  }

  function setSelectedToken(token) {
    setRequest((request) => ({ ...request, token: token }));
    getTokenPriceSetToken(token);
    setIsTokenPopUp(false);
  }

  return (
    <div id="mainframe" class="hidden w3-animate-opacity">
      <div class="container page create no-relative ">
        {!isShare && isPageLoading ? (
          <>
            <a>{true ? "Sign transaction" : "Authenticate"}</a> <h1 id="share-title">{true ? "Waiting on signature" : "Creating request"}</h1>
          </>
        ) : (
          <>
            {isShare ? (
              <>
                {" "}
                <a onClick={() => setIsShare(false)}> {"<"} Edit request</a>
                <h1 id="share-title">Share</h1>
              </>
            ) : (
              <>
                <a>New request</a> <h1 id="share-title">Create</h1>
              </>
            )}
          </>
        )}
        {isPageLoading ? (
          <div class={isMobile ? "loading-transactions w3-animate-bottom" : "loading-transactions"}>
            <div class="sk-chase">
              <div class="sk-chase-dot"></div>
              <div class="sk-chase-dot"></div>
              <div class="sk-chase-dot"></div>
              <div class="sk-chase-dot"></div>
              <div class="sk-chase-dot"></div>
              <div class="sk-chase-dot"></div>
            </div>

            {showCancel ? (
              <button onClick={() => refresh()} class="btn btn-primary btn-restart w3-animate-bottom">
                Page stuck? Refresh here
              </button>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <>
            <form>
              <div class="row ">
                {!isShare ? (
                  <>
                    <div class="create-content">
                      <div class="list-group mb-3">
                     
                      <span class="token-label">Currency</span>

                          <Tokens stableTokens={stableTokens} cryptoTokens={cryptoTokens} selectedToken={request.token} tokenSelect={setSelectedToken} togglestate={closeTokenPopUp} />
                      
                          {/* <div class="tokens-list-item selected">
                            <img src={request.token.icon} width="34" /> <b>{request.token.symbol}</b> - {request.token.name}{" "}
                            <span onClick={() => document.getElementById("token-select").classList.toggle("hide")} class="change-token-link">
                              Select
                            </span>
                          </div> */}
                     
                      </div>
                      <div class="form-create">
                        <div class="input-group mb-3">
                          <div class="input-group-prepend">
                            <span class="input-group-text">Destination</span>
                          </div>
                          <input class="form-control" value={address} aria-label="With textarea"></input>
                        </div>
                        <div class="input-group mb-3">
                          <div class="input-group-prepend">
                            <span class="input-group-text">Amount </span>
                          </div>
                          <input
                            id={isAmountInvalid ? "invalid-amount" : ""}
                            type="text"
                            placeholder="0.125"
                            onChange={(e) =>
                              setRequest((request) => ({
                                ...request,
                                amount: e.target.value,
                              }))
                            }
                            value={request.amount}
                            class="form-control amount"
                            aria-label="Amount (to the nearest dollar)"
                          />
                          <div class="input-group-append">
                            <span class="input-group-text end">
                              ~$
                              {Number.parseFloat(tokenPrice * request.amount).toFixed(2)}
                              ,-
                            </span>
                          </div>
                        </div>
                        <div class="input-group textarea mb-3">
                          <div class="input-group-prepend">
                            <span class="input-group-text">Message </span>
                          </div>
                          <textarea
                            rows="3"
                            o
                            onChange={(e) =>
                              setRequest((request) => ({
                                ...request,
                                message: e.target.value,
                              }))
                            }
                            class="form-control"
                            value={request.message}
                            aria-label="With textarea"
                          ></textarea>
                        </div>
                        <div class="input-group bottom-mobile">
                          {!isMobile ? (
                            <button type="button" onClick={() => storeRequest()} class="btn btn-primary btn-lg btn-generate btn-sign">
                              <span>Sign</span>
                              <img src={Sign} width="20" />
                            </button>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>{" "}
                    </div>
                    {isMobile ? (
                      <div class="create-mobile-bottom w3-animate-bottom">
                        <button type="button" onClick={() => storeRequest()} class="btn btn-primary btn-lg btn-sign">
                          <span>Sign</span>
                          <img src={Sign} width="20" />
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <div class="share-content w3-animate-opacity">
                    <div class="display-flex social">
             
                      {isMobile ? (
                        <div class="mb-3 mobile-share-container">
                          <span class="share-request-label">Copy me</span>
                          <div onClick={() => navigator.clipboard.writeText(plainText).then(() => alert("Request copied."))} class="share-text">
                            {plainText.toString()}
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                      <div class="socials">
                        <div>
                          {" "}
                          <a type="button" target="_blank" href={"https://api.whatsapp.com/send?text=" + shareText}>
                            <img src={Whatsapp} width="18" /> <span>Whatsapp</span>
                          </a>{" "}
                        </div>
                        <div>
                          {" "}
                          <a type="button" target="_blank" href={"https://t.me/share/url?url=" + encodeURIComponent(cdiLink) + "&text=" + encodeURIComponent(shareText)}>
                            <img src={Telegram} width="18" /> <span>Telegram</span>
                          </a>{" "}
                        </div>
                        <div>
                          {" "}
                          <a type="button" href={"https://www.facebook.com/sharer.php?u=" + cdiLink}>
                            <img src={Messenger} width="18" />
                            <span>Messenger</span>
                          </a>{" "}
                        </div>
                        <div>
                          {" "}
                          <a type="button" onClick={() => navigator.clipboard.writeText(shareText).then(() => window.location.assign("slack://app?&tab=messages", "_blank"))}>
                            <img src={Slack} width="18" />
                            <span>Slack</span>
                          </a>{" "}
                        </div>
                        <div>
                          {" "}
                          <a type="button" onClick={() => navigator.clipboard.writeText(shareText).then(() => window.location.assign("slack://app?&tab=messages", "_blank"))}>
                            <img src={Discord} width="18" />
                            <span>Discord</span>
                          </a>{" "}
                        </div>
                        <div>
                          {" "}
                          <a
                            type="button"
                            href={"http://vk.com/share.php?url=" + encodeURIComponent(cdiLink) + "&title=Pay me " + request.amount + "" + request.token.symbol + "&comment=" + shareText}
                          >
                            <img src={VK} width="18" />
                            <span>VK</span>
                          </a>{" "}
                        </div>
                        <div>
                          {" "}
                          <a target={"_blank"} href={"mailto:subject=Pay me " + request.amount + "" + request.token.symbol + "&body=" + shareText} type="button">
                            <img src={Gmail} width="18" />
                            <span>Gmail</span>
                          </a>
                        </div>
                        <div>
                          {" "}
                          <a href={"sms:{phone_number}?body=" + shareText} type="button">
                            <img src={SMS} width="18" />
                            <span>SMS</span>
                          </a>
                        </div>
                        <div>
                          {" "}
                          <a onClick={() => navigator.clipboard.writeText(cdiLink).then(() => alert("Request URL copied."))} type="button">
                            <img src={Copy} width="18" />
                            <span>Copy</span>
                          </a>
                        </div>
                      </div>
                    </div>
                    {!isMobile ? (
                      <div class="signature">
                        <label>Share me</label>
                        <div onClick={() => navigator.clipboard.writeText(plainText).then(() => alert("Request copied."))} class="share-text">
                          {plainText.toString()}
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div class="modal-dialog  modal-dialog-centered">
                        <div class="modal-content ">
                          <div class="modal-header">
                            <span class="modal-title" id="exampleModalLabel">
                              Share
                            </span>
                          </div>
                          <div class="modal-body">
                            <div class="socials">
                              <button onClick={() => navigator.clipboard.writeText(plainText).then(() => alert("Request URL copied."))} type="button" class="btn btn-social copy">
                                <img src={Copy} width="45" />
                              </button>
                              <a href={cdiLink} type="navigator" class="btn btn-social pay">
                                Pay Directly
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </>
        )}
        <div class="background-overlay top"></div>

        <div class="background-overlay "></div>
      </div>
    </div>
  );
}

export default Create;
