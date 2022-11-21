import { useSendTransaction, usePrepareSendTransaction } from 'wagmi'
import { ethers } from "ethers";
import React, {useEffect} from "react";
import toast, { Toaster } from 'react-hot-toast';
function TransferETH(props) {
   const amount = ethers.utils.parseUnits(props.amount, "ether");
   const { config } = usePrepareSendTransaction({request: { to: props.address, value: ethers.BigNumber.from(amount)}})
   const { data,error,isSuccess,isError, sendTransaction } = useSendTransaction({config})




   return (
      <div>
           <button class="col pay-option"  type="button" onClick={() => sendTransaction?.()}>
            Send {props.amount} {props.symbol}
            </button>
      </div>
   )
}

export default TransferETH;
