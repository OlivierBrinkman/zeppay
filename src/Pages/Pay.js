import {useParams, useNavigate} from "react-router-dom";
import {decode as base64_decode, encode as base64_encode} from 'base-64';
import { useState, useEffect } from "react";
import { erc20ABI, useContract, useAccount, useSendTransaction,usePrepareSendTransaction, useSigner} from 'wagmi';
import uuid from 'react-uuid';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
import {useNetwork  } from 'wagmi';
import JsonViewer from "../Webblocks/JsonViewer";
import {isConsole, isMobile} from "react-device-detect";
import { ethers } from "ethers";
import TransferETH from "../Helpers/TransferETH";
import TransferERC20 from "../Helpers/TransferERC20";

function Pay() {

    const {base} = useParams();  
    const { address ,isConnected} = useAccount()
    const token = process.env.REACT_APP_STORAGE_API_KEY
    const client = new Web3Storage({ token })
    const [isLoading, setIsLoading] = useState(true);
    const [request, setRequest] = useState({})
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState();
    const [hash, setHash] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    const [amount, setAmount] = useState(0);
    const { data: signer } = useSigner()

    useEffect(()=> {
       retrieveRequest(base);
       console.log(erc20ABI);
    },[])

    async function retrieveRequest(cdiLink) {
        let decoded = base64_decode(cdiLink);
        const response = await fetch(decoded);
        await response.json().then((response) => setRequestForPayment(response))
    }

    function errorOccurd(error){
         if(!error) {
            setIsLoading(false);
            setIsPaying(false);
         }
         
    }

   async function setRequestForPayment(request) {
      setRequest(request);
         setIsFetching(false);
         setTimeout(function(){
               setIsLoading(false);
         }, 1500);
      }
      useEffect(()=> {
         setTimeout(() => {
               setError("")
         }, "10000")
      }, [error])

      async function paymentComplete(data) {
         if(data.hash) {                    
            setTimeout(function(){
               logPayment(data, address);
            }, 1500);
         }
      }

      function startPaying(){
         setIsPaying(true)
         setIsLoading(true);
      }
      


  
    async function logPayment(_paymentResult, address, ) {
        const fileBlob = new Blob([{
                uuid: uuid(),
                paidBy: address,
                paymentResult:_paymentResult,
            }], { type: 'application/json' })
        
        const short = require('short-uuid');
        const nameBlob = "Transaction > " + request.amount + " " + request.token.symbol +" / " + short.generate().substring(0,6);
      
        const files = [new File([fileBlob], 'Payment_' + uuid()) ]
        const cid = await client.put(files, {name: nameBlob})
          if(cid) {
            setIsSuccess(true);
            setIsLoading(false);
          }
    }
    


    if(!isFetching) {
        if(isSuccess) {
            return (
                    <div class="wrapper w3-animate-opacity"> 
                        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/> <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
                        <h1>Payment completed</h1>
                        <span>You can close this page by clicking <a href={window.location.origin +"/"}>here</a> </span>
           
                    </div>  
            )
        }
        else {
    return (
    <div class="container page create payment">
      <div class="position-fixed bottom-0 end-0 p-3">
         <div id="liveToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
               <strong class="me-auto">Bootstrap</strong>
               <small>11 mins ago</small>
               <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
               Hello, world! This is a toast message.
            </div>
         </div>
         </div>
        <div class="pay-content">
           {!isLoading? 
           <div class="payment-overview">
              {error?
              <div class="alert alert-primary" role="alert">
                 {error} 
              </div>
              :<></>}
              <div class="payment-details">
                 <a>Pay with Zeppay</a> 
                 <h1 id="share-title">Confirm</h1>
                 {!isMobile? <>
                
                 <div class="payment-group">
                    <label>For</label>
                    <div>{request.message}</div>
                 </div>
                 <div class="payment-group">
                    <label>Price in USD</label>
                    <div>${parseInt(request.price).toLocaleString()},-</div>
                 </div>
                 <div class="payment-group total">
                    <label>Total</label>
                    <div><img src={request.token.icon} width="20"/> {request.amount} {request.token.symbol}</div>
                 </div>
                 </>: <>
                 <div class="mobile-payment-group message">
                   <span>{request.message}</span>
                 </div>
                 <div class="mobile-payment-group datetime">
                    <div>{request.dateCreated.replace('T', '')}</div>
                 </div>
                 <div class="mobile-payment-group total">
                 <div><img src={request.token.icon} width="38"/> {request.amount} {request.token.symbol}</div>
                 </div>
                  </>}

                

              </div>
              <div class="payment-buttons">
                 <div class="">
                  {request.token.contract == "Native"?
                  <TransferETH errorOccurd={errorOccurd} startPaying={startPaying} symbol={request.token.symbol} icon={request.token.icon} paymentComplete={paymentComplete} address={request.destination} amount={request.amount}/>
                   :
                   <TransferERC20 errorOccurd={errorOccurd} decimals={request.token.decimals} startPaying={startPaying} contract={request.token.contract_5} symbol={request.token.symbol} icon={request.token.icon} paymentComplete={paymentComplete} address={request.destination} amount={request.amount}/>
                   }
                 </div>
              </div>
              <div class="pay-data">
                 <div class="accordion accordion-flush" id="accordionFlushExample">
                    <div class="accordion-item">
                       <h2 class="accordion-header" id="flush-headingOne">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseOne">
                          <a> Request data</a>
                          </button>
                       </h2>
                       <div id="flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                          <div class="accordion-body">
                             <div class="payment-group">
                                <label>Send to</label> 
                                <div>{request.destination.substring(0, 10)+"..."+request.destination.substring(request.destination.length - 10,request.destination.length)}</div>
                             </div>
                             <div class="payment-group">
                                <label>Token Contract</label>
                                {request.token.contract == "Native"?
                                <div>Native</div>
                                :
                                <div>{request.token.contract.substring(0, 10)+"..."+request.token.contract.substring(request.token.contract.length - 10,request.token.contract.length)}</div>
                                }
                            </div>
                            <div class="payment-group">
                                    <label>Payment Network</label>
                                    <div>{request.chain}</div>
                                </div>
                                <div class="payment-group">
                                    <label>Date created</label>
                                    <div>{request.dateCreated}</div>
                                </div>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div class="payment-group">
                    <JsonViewer request={request}/>
                 </div>
                 </div>
           </div>
           : 
           <div class="loading-transactions">
              <div class="sk-chase">
                 <div class="sk-chase-dot"></div>
                 <div class="sk-chase-dot"></div>
                 <div class="sk-chase-dot"></div>
                 <div class="sk-chase-dot"></div>
                 <div class="sk-chase-dot"></div>
                 <div class="sk-chase-dot"></div>
              </div>
              {isPaying?
              <h3>Processing payment...</h3>
              :<></> }
           </div>
           }
        </div>
        <div class="background-overlay top"></div>
        <div class="background-overlay"></div>
     </div>
        )
    }
    }
}

export default Pay;