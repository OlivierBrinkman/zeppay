import { erc20ABI, useContract, useSigner ,useSendTransaction } from 'wagmi'
import React, {useEffect} from "react";
import toast, { Toaster } from 'react-hot-toast';
import { ethers } from "ethers";
import web3 from "web3";
function TransferERC20(props) {

   const { data: signer} = useSigner()
   const contract = useContract({
      address: props.contract,
      abi: erc20ABI,
      signerOrProvider: signer,

   })

   const { sendTransaction, error } = useSendTransaction({
      mode: 'recklesslyUnprepared',
      request: {
        to: props.address,
        value: web3.utils.toWei(props.amount, 'ether'),
      },onError(error) {
         console.log('Erroreeeee')
       },
       onSuccess(data) {
         props.paymentComplete(data)
         },
    })



   function strtodec(amount,dec){
         let stringf = "";
         for(var i=0;i<dec;i++){
            stringf = stringf+"0";
         }
         return amount+stringf;
   }

   async function send() {
      props.startPaying()
      try {
         if(props.symbol=="ETH") {
              await sendTransaction();
         } else {
            const res = await contract.connect(signer).transfer(props.address, strtodec(props.amount, props.decimals));
            if(res.hash) { 
               props.paymentComplete(res)
            }
         }
      } catch(ex) {
         console.log(ex);
      }
     
   }


 return (
 <div>
    <div onClick={()=> send()}  class="col pay-option">
        <span>Pay with {props.amount } {props.symbol}</span><img src={props.icon} height="30"/>

    </div>
 </div>
 )
}

export default TransferERC20;
