
import React, {useState, useEffect} from "react"
import {encode as base64_encode, base64_decode} from 'base-64';
import { QRCode } from "react-qrcode-logo";
import { useNavigate } from "react-router-dom";
import Moralis  from 'moralis';
import { EvmChain } from '@moralisweb3/evm-utils';
import { ethContracts } from "../Helpers/ETHContracts";
import Whatsapp from "../Assets/whatsapp.png";
import Telegram from "../Assets/telegram.png";
import Copy from "../Assets/copy.png";
import Share from "../Assets/share.png";
import WeChat from "../Assets/wechat.png";
import Messenger from "../Assets/messenger.png";
import { useAccount, useNetwork ,useSignMessage } from 'wagmi';
import Slack from "../Assets/slack.png";
import uuid from 'react-uuid';
import Tokens from "../Webblocks/Tokens";
import {isMobile} from "react-device-detect";
import {requestTransactionSignatureMessage} from "../Helpers/Moralis";


function Create() {
    const navigate = useNavigate();
    const { address, isDisconnected, isConnected } = useAccount()
    
    const { chain } = useNetwork()
    const [shareText, setShareText] = useState("")
    const [tokenPrice, setTokenPrice] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [qrResult, setQrResult] = useState("https://zeppay.app/pay/UNKNOWNHASH");
    const APIKEY = process.env.REACT_APP_MORALIS_API_KEY;
    const [cdiLink, setCdiLink] = useState("");
    const [isShare, setIsShare] = useState(false);
    const [isSigning, setIsSigning] = useState(false);

    const [isTokenPopUp, setIsTokenPopUp] = useState(false);
    const [transactionToSign, setTransactionToSign] = useState();
    const [rawFiles, setRawFiles] = useState([])
    const [request, setRequest] = useState({
        destination:"",
        token:{},
        amount:0,
        name:"",
        chain:"",
        message:"",
        price:0,
        image:"",
        dateCreated: new Date(),
        signature:"",
        signedMessage: ""
        }
    );

    const { data, isError, isSuccess, signMessage } = useSignMessage({
        message: request.signedMessage,
        onSuccess(data) {
            setRequest(request => ({...request,signature:data}));
            finishAndShareRequest(); 

            setIsSigning(false);
          },
          onError(error) {
            setIsLoading(false)
            console.log(error);
            setIsSigning(false);
          }
    })


    useEffect(()=> {
        if(isDisconnected) {
            navigate("/")
        }
    },[isConnected])

    useEffect(()=> {
        if(isConnected) {
            setRequest(request => ({...request,destination: address,token: ethContracts.tokens[0], chain:chain.name}));
            getTokenPriceSetToken(ethContracts.tokens[0])
           const savedSession = window.localStorage.getItem("session");
           if(savedSession){ 
                const object = JSON.parse(savedSession);
                setRequest(request => ({...request,name: object.user.user_metadata.name}))
           }
        }
    },[])
    
    useEffect(()=> {
        if(request.amount != 0) {
            var formattedPrice = Number.parseFloat(tokenPrice * request.amount).toFixed(2);
            setRequest(request => ({...request,price: formattedPrice}))
        }
    },[request.amount, request.token])

    useEffect(()=> {
        if(cdiLink != "") {
            setIsShare(true);
            setIsLoading(false);
        }
    },[cdiLink])

    useEffect(()=> {
        if(request.signedMessage) { 
            getSignatureSigner()
        }
    },[request.signedMessage])



    async function getTokenPriceSetToken(token) {
        if(token) {
            setRequest(request => ({...request,token: token}))
            const saveLabel = token.symbol+"_USD";
            var savedPrice = sessionStorage.getItem(saveLabel);
            if(savedPrice) {
                setTokenPrice(savedPrice);
            } else {
                if(token.contract=="Native") { 
                    setTokenPrice(1400);
                } else {
                    
                    const chain = EvmChain.ETHEREUM;
                    const address = token.contract;
                    await Moralis.start({apiKey: APIKEY});
                    const response = await Moralis.EvmApi.token.getTokenPrice({address, chain,});
                    const usdPrice = Number.parseFloat(response.data.usdPrice).toFixed(2) 
                    sessionStorage.setItem(saveLabel, usdPrice);
                    setTokenPrice(usdPrice);
                }
            }
        } else {}
    }

    async function storeRequest() { 
        setIsSigning(true)
        setIsLoading(true);
        await prepareRequestSignature();       
    }

    async function prepareRequestSignature() { 
        const signatureMessage = await getTransactionSignatureMessage();
        setRequest(request => ({...request, signedMessage:signatureMessage}))
            // + "\n \n" +"_____JSON REQUEST OBJECT_____ " +"\n"+ JSON.stringify(request)}
    }
    
    async function getTransactionSignatureMessage() { 
        const message = await requestTransactionSignatureMessage(address, EvmChain.GOERLI, 'evm' );
        return message;        
    }
    
    async function getSignatureSigner() {
        await signMessage();
    }

    
    async function finishAndShareRequest() {
        const abi = [{path: address+"/request/"+uuid(),content: btoa(JSON.stringify(request)),},];
        const APIKEY = process.env.REACT_APP_MORALIS_API_KEY;
        await Moralis.start({apiKey: APIKEY,});
        try {
            const response = await Moralis.EvmApi.ipfs.uploadFolder({abi});
            let payURL = window.location.origin +"/pay/" + base64_encode(response.result[0].path)
            setCdiLink(payURL);
            var _text ="Hi, would you please transfer me *" +request.amount +"* *" +request.token.symbol +"* for '*" +request.message +"*' via " +"\n\n" +payURL +  " \n\n" + "_ " + "\n\n" +"_Made with Zeppay_";
            var text = escape(_text);
            setShareText(text);
        } catch {setIsLoading(false)}
    }

 




    async function filesUploaded(e) {
        let files = e.target.files[0];
        let baseTextFile = await convertBase64(files);
        setRequest(request => ({...request,image: baseTextFile}))
    }

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {resolve (fileReader.result);};
            fileReader.onerror = (error) => {reject(error);};
        });
    };

    function closeTokenPopUp(){ 
        setIsTokenPopUp(false)
    }

    function setSelectedToken(token) {
        setRequest(request => ({...request,token: token}))
        //getTokenPriceSetToken(token)
        setIsTokenPopUp(false);
    }

    return (
        <div class="container page create no-relative">
            {!isShare && isLoading?<><a>{isSigning?"Sign transaction":"2 - 5 seconds"}</a> <h1 id="share-title">{isSigning?"Waiting on signature":"Creating request"}</h1></>:
            <>
            {isShare?<>  <a onClick={()=> setIsShare(false)}> {"<"} Edit request</a><h1 id="share-title">Share</h1></>:<><a>New request</a> <h1 id="share-title">Create</h1></>}</>}
            {isLoading? 
           <div class={isMobile?"loading-transactions w3-animate-bottom": "loading-transactions"}>
           <div class="sk-chase">
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
            </div>
        </div>:<>
            <form>
                <div class="row ">{!isShare?<>
                    <div class="create-content">
                        <div class="list-group">
                            {isTokenPopUp? <Tokens selectedToken={request.token} tokenSelect={setSelectedToken} togglestate={closeTokenPopUp}/>: 
                                <div   class="tokens-list-item selected"><img src={request.token.icon} width="34"/> <b>{request.token.symbol}</b> - {request.token.name} <span onClick={()=> setIsTokenPopUp(true)} class="change-token-link">Select</span></div>
                            }
                            {/* {ethContracts.tokens.map((_token) => (
                                <li onClick={()=> getTokenPriceSetToken(_token)} id={request.token==_token?"active-list-item":""} class="list-group-item list-group-item-action"><img src={_token.icon} width="27"/> <b>{_token.symbol}</b> - {_token.name}</li>
                            ))}  */}
                        </div> 
                        <div class="form-create">
                        <div class="input-group disabled-address">
                                <div class="input-group-prepend">
                                    <span class="input-group-text destination" id="basic-addon1">Send to</span>
                                </div>
                                <input type="text" class="form-control readonly-field" disabled value={request.destination} placeholder="Address" aria-label="Username" aria-describedby="basic-addon1"/>
                            </div>
                            {/* <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Name</span>
                                    </div>
                                    
                                    <input  onChange={(e)=> setRequest(request => ({...request,name: e.target.value}))} class="form-control" value={request.name} aria-label="With textarea"></input>
                                    </div> */}
                        <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Amount </span>
                                </div>
                                <input type="text" placeholder="0.125" onChange={(e)=> setRequest(request => ({...request,amount: e.target.value}))} value={request.amount}class="form-control amount" aria-label="Amount (to the nearest dollar)"/>
                                <div class="input-group-append">
                                    <span class="input-group-text end">~${ Number.parseFloat(tokenPrice * request.amount).toFixed(2)},-</span>
                                </div>
                            </div>

                                <div class="input-group textarea mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Message </span>
                                    </div>
                                    <textarea rows="3"  o onChange={(e)=> setRequest(request => ({...request,message: e.target.value}))} class="form-control" value={request.message} aria-label="With textarea"></textarea>
                                    </div>

                                    {/* <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text file-upload-label">Files</span>
                                        </div>                                        
                                            <input class="form-control form-control-lg file-upload" id="formFileLg" multiple onChange={e=> filesUploaded(e)} type="file" />
                                        </div> */}
                       
                                    <div class="input-group bottom-mobile">
                                        {!isMobile? 
                                        <button type="button" onClick={()=> storeRequest()} class="btn btn-primary btn-lg btn-generate" disabled={!request.amount || !request.message}><span>Share</span></button>
                                            :<></>}
                                    </div>
                                </div>  </div>
                                {isMobile? 
                            <div class="create-mobile-bottom w3-animate-bottom">
                                    <button type="button" onClick={()=> storeRequest()} class="btn btn-primary btn-lg" disabled={!request.amount || !request.message}><span>Share</span></button>
                            </div>:<></>}               
                  </>:
                    
                    <div class="share-content w3-animate-opacity">
        
                        <div class="display-flex social">
                           <QRCode  size="220" value={cdiLink} ecLevel="L" quietZone="5" bgColor="transparent"enableCORS="true"fgColor="#000"qrStyle="dots"logoWidth="30"logoImage={request.token.icon}removeQrCodeBehindLogo="false" eyeRadius={[[20, 0, 0, 0],[0, 20, 0, 0],[0, 0, 0, 20],]}/>
                                <div class="socials">
                                        <button type="button" class="btn isdesktop whatsapp">
                                            <img src={Whatsapp} width="30"/>
                                        </button> 
                                        <button type="button" class="btn isdesktop telegram">
                                            <img src={Telegram} width="30"/>
                                        </button>    
                                        <button type="button" class="btn isdesktop  messenger">
                                            <img src={Messenger} width="30"/>
                                        </button>  
                            
                                        <button type="button" class="btn isdesktop  discord">
                                            <img src={Slack} width="30"/>
                                        </button>   
                                        <button type="button" class="btn isdesktop  wechat">
                                            <img src={WeChat} width="30"/>
                                        </button>    
                                        <button onClick={()=> navigator.clipboard.writeText(cdiLink).then(()=> alert("Request URL copied."))} type="button" class="btn isdesktop copy">
                                            <img src={Copy} width="30"/>
                                      </button>
                                     
                                </div>   
                            </div>
                            <div class="signature">
                                    <label>Your Signature</label>
                                    <code>{request.signature}</code>
                                </div>
                        
                           <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog  modal-dialog-centered">
                                <div class="modal-content ">
                                <div class="modal-header">
                                    <span class="modal-title" id="exampleModalLabel">Share</span>
                                </div>

                              <div class="modal-body">
                                    <div class="socials">
                                        <button type="button" class="btn btn-social whatsapp">
                                            <img src={Whatsapp} width="50"/>
                                        </button> 
                                        <button type="button" class="btn btn-social telegram">
                                            <img src={Telegram} width="50"/>
                                        </button>    
                                        <button type="button" class="btn btn-social messenger">
                                            <img src={Messenger} width="50"/>
                                        </button>     
                                        <button type="button" class="btn btn-social discord">
                                            <img src={Slack} width="50"/>
                                        </button>   
                                        <button type="button" class="btn btn-social wechat">
                                            <img src={WeChat} width="50"/>
                                        </button>    
                                        <button onClick={()=> navigator.clipboard.writeText(cdiLink).then(()=> alert("Request URL copied."))} type="button" class="btn btn-social copy">
                                            <img src={Copy} width="45"/>
                                        </button>   
                                        <a href={cdiLink} type="navigator" class="btn btn-social pay">
                                            Pay Directly
                                        </a>   
                                    </div>       
                                </div>
                                </div>
                            </div>
                            </div>   
                    </div>}
                </div>
            </form>
            </>}
            <div class="background-overlay top"></div>

            <div class="background-overlay"></div>
        </div>
    )
}

export default Create;