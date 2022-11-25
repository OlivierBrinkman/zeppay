import {erc20ABI,useNetwork,useContract,useAccount,useSigner,useBalance,usePrepareSendTransaction,useSendTransaction,useProvider } from "wagmi";
 import React from "react"
 import Web3 from "web3";
 import {getBalance} from "./infura";
 function TransferERC20(props) {
  
   const { chain } = useNetwork();
   const { data: signer } = useSigner();
   const {address} = useAccount();
   const provider = useProvider()
   const web3 = new Web3(provider)

   const contract = useContract({
     address: props.contract,
     abi: erc20ABI,
     signerOrProvider: signer,
     onError(error) {
      console.log(error)
     },
     onSuccess(data) {
      console.log(data)
     }
   });

    const { config } = usePrepareSendTransaction({
            request: {
               to: props.address,
               value: web3.utils.toWei(props.amount, "ether"),
             },

    })
    const {  data, isLoading, isSuccess,sendTransaction } = useSendTransaction({
      ...config,
      onError(error) {
        props.errorOccured(formatErrorMessage(error));
      },
      onSuccess(data) {
        props.paymentComplete(data)
      },
      onMutate({ args, overrides }) {
        console.log('Mutate', { args, overrides })
      },
      onSettled(data, error) {
        console.log(data)
      },
    })


    function formatErrorMessage(error) {
      let index = error.toString().indexOf("(");
      const message = error.toString().slice(0,index).toString();
      return message;
    }


   async function send() {
    const BigNumber = require('bignumber.js');
     if (props.chain != chain.name) {
       props.errorOccured("Switch to " + props.chain);
     } else {
       props.startPaying(); 
         if (props.symbol == "ETH") {
            sendEth();
         } else {
          let bigNumber = await contract.balanceOf(address)
          let hexBalance = bigNumber._hex;
          const balance = web3.utils.hexToNumber(hexBalance)/1000000;
          if(balance < props.amount) {
              props.errorOccured("Error: account has insufficient balance");
          } else {
            let amount_wei = new BigNumber(props.amount).shiftedBy(parseInt(props.decimals)).toString()
            const res = await contract.connect(signer).transfer(props.address, amount_wei);
            if (res.hash) {
              props.paymentComplete(res);
            }
            else { 
              console.log(res)
            }
          }
         }
     }
   }
 


  async function sendEth() {
    const balanceHex = await getBalance(address);
    const balance = web3.utils.fromWei(web3.utils.hexToNumberString(balanceHex))*1000;
    if(balance < props.amount) { 
      props.errorOccured("Error: account has insufficient balance");
    } else {
      await sendTransaction?.()
    }
   }

    return (
      <div>
        <div onClick={() => send()} class="col pay-option">
          <span>
            Pay with {props.amount} {props.symbol}
          </span>
          <img src={props.icon} height="30" />
        </div>
      </div>
    );
 }
 
 export default TransferERC20;
 