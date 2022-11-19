import { useSendTransaction, usePrepareSendTransaction } from 'wagmi'
import { ethers } from "ethers";
import React, {useEffect} from "react";

function TransferETH(props) {
   const amount = ethers.utils.parseUnits(props.amount, "ether");
 const { config } = usePrepareSendTransaction({
 request: { to: props.address, value: ethers.BigNumber.from(amount) },
 })
 const { data, isLoading, isError,isSuccess, sendTransaction } =
useSendTransaction({...config, 
    onSuccess(data) {
       props.paymentComplete(data)
      },
      onSettled(data, error) {
        console.log('Settled', { data, error })
      },
      onMutate({ args, overrides }) {
        console.log('Mutate', { args, overrides })
      },
      onError(error) {
         props.errorOccurd(error)
      },
    })

      


 function send(){
    props.startPaying();
    sendTransaction?.();

   
 }
 useEffect(()=> {
    if(isSuccess) {
        props.paymentComplete(data);
    }
 },[isSuccess])
 return (
 <div>
    <div onClick={()=> send()}  class="col pay-option">
        <span>Pay with {props.amount } {props.symbol}</span><img src={props.icon} height="30"/>
    </div>
 </div>
 )
}

export default TransferETH;
