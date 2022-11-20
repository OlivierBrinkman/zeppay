import { useSendTransaction, usePrepareSendTransaction } from 'wagmi'
import { ethers } from "ethers";
import React, {useEffect} from "react";
import toast, { Toaster } from 'react-hot-toast';
function TransferETH(props) {
   const amount = ethers.utils.parseUnits(props.amount, "ether");
   const { config } = usePrepareSendTransaction({request: { to: props.address, value: ethers.BigNumber.from(amount)}})
   const { data,isSuccess, sendTransaction } =useSendTransaction({...config, 
      onSuccess(data) {
         props.paymentComplete(data)
         },
         onError(error) {
         props.errorOccurd()
   },})

   function send(){
      props.startPaying()
      try {
         sendTransaction?.()
      } catch(ex) {
         props.errorOccurd()

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

export default TransferETH;
