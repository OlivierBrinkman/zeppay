import { erc20ABI, useContract, useSigner } from 'wagmi'
import React from "react";
import toast, { Toaster } from 'react-hot-toast';

function TransferERC20(props) {

   const { data: signer} = useSigner()
   const contract = useContract({
      address: props.contract,
      abi: erc20ABI,
      signerOrProvider: signer,

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
         await contract.connect(signer).transfer(props.address, strtodec(props.amount, props.decimals)).then(response => {
            console.log(response);
            props.paymentComplete(response)
         }).catch(()=> props.errorOccurd())
      } catch(ex) {
         toast("Payment declined")
         props.errorOccurd()
      }
     
   }

   function toastMessage(Message) {
      toast(Message);
      props.errorOccurd()
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
