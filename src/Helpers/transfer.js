import {erc20ABI,useNetwork,useContract,useAccount,useSigner,usePrepareSendTransaction,useSendTransaction,useProvider } from "wagmi";
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
      props.errorOccured("Error: user has declined payment");

    },
     onSuccess(data) {
      console.log(data)
     },
     onMutate({ args, overrides }) {
      console.log('Mutate', { args, overrides })
    },
    onSettled(data) {
      console.log(data)
    },
   });

    const { config } = usePrepareSendTransaction({
            request: {
               to: props.address,
               value: web3.utils.toWei(props.amount, "ether"),
             },
             enabled: false,
    })
    const {sendTransaction } = useSendTransaction({...config,
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


    async function hasEnoughFunds() {
      const balance = await contract.balanceOf(address);
      let hexBalance = balance._hex;
      let int = web3.utils.hexToNumberString(hexBalance) / decimalSplit();
      if(int < props.amount) {
        return false;
      } else {
        return true;
      }
    }

    function decimalSplit() {
      let d = props.decimals;
      if(d == 6) {
        return 1e6
      } else if(d == 8) {
        return 1e8
      } else if(d == 12) {
        return 1e12
      } else if(d == 18) {
        return 1e18
      }
    }
  
   async function send() {
    if(props.contract == "") {
      props.errorOccured("Token not supported on Goerli Network");

    } else {
      const BigNumber = require('bignumber.js');
      if (props.chain != chain.name) {
        props.errorOccured("Switch to " + props.chain);
      } else {
        props.startPaying(); 
          if (props.symbol == "ETH") {
             sendEth();
          } else {
           const eFunds = await hasEnoughFunds();
           if(!eFunds) {
               props.errorOccured("Error: user has insufficient balance");
           } else {
             let amount_wei = new BigNumber(props.amount).shiftedBy(parseInt(props.decimals)).toString();
             try {
               const res = await contract.connect(signer).transfer(props.address, amount_wei);
               if (res.hash) {
                 props.paymentComplete(res);
               }
               else { 
                 props.errorOccured("Error: user has insufficient balance");
               }
             } catch(ex) { 
                     props.errorOccured(formatErrorMessage(ex));
 
             }
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
 