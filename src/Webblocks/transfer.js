import { erc20ABI, useNetwork, useContract, useSignMessage, useAccount, useFeeData,  useSigner, useBalance, usePrepareSendTransaction, useSendTransaction, useProvider } from "wagmi";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import {requestTransactionVerifyMessage} from "../helpers/moralis";
import { EvmChain } from "@moralisweb3/evm-utils";
import {getBalance,getBalanceBNB,sendERC20Tokens} from "../helpers/rpc";
import { sign } from "jsonwebtoken";
function TransferERC20(props) {

  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const {data: fees} = useFeeData();
  const provider = useProvider();
  const web3 = new Web3(provider);
const [messageToSign, setMessageToSign] = useState({})
let isSigned = false;
  const [isSigning, setIsSigning] = useState(false);

  const contract = useContract({
    address: props.contract,
    abi: erc20ABI,
    signerOrProvider: provider,
    onError(error) {
      props.errorOccured("Error: user has declined payment");
    },
    onSuccess(data) {
      console.log(data);
    },
    onMutate({ args, overrides }) {
      console.log("Mutate", { args, overrides });
    },
    onSettled(data) {
      console.log(data);
    },
  }); 

  const {signMessage } = useSignMessage({
    message: messageToSign,
    onSuccess(data, error) {
      props.startPaying();
 
      if(chain.name == "Ethereum" || chain.name == "Goerli") { 
        if(props.request.token.symbol == "ETH") {
          try { 
            sendETH();
          } catch(e) { 
            props.errorOccured(formatErrorMessage(e));
          }
        } 
        else {
          try { 
            sendTokens();
          } catch(e) { 
            props.errorOccured(formatErrorMessage(e));
        }   
      }}else if (chain.name == "BNB Smart Chain" || chain.name == "BSC Testnet") {
        if(props.request.token.symbol == "BNB") {
          try { 
            sendBNB();
          } catch(e) { 
            props.errorOccured(formatErrorMessage(e));
          }
        } else {
          try { 
            sendTokens();
          } catch(e) { 
            props.errorOccured(formatErrorMessage(e));
          }
        }
      }
    },
    onError(error) {
      setIsSigning(false)
      props.errorOccured(formatErrorMessage(error));
    }   
  });

  useEffect(()=> {
    setSigningMessage()
  },[])

  

  async function setSigningMessage() {
    let _evm; 
    switch(props.request.chain) {
      case "Ethereum": _evm = EvmChain.ETHEREUM;
    break;
      case "BNB Smart Chain": _evm = EvmChain.BSC;
    break;
      case "BSC Testnet" : _evm = EvmChain.BSC_TESTNET;
    break;
      case "Goerli" : _evm = EvmChain.GOERLI;
    break;
      default: _evm = EvmChain.ETHEREUM 
    }
    const message = await requestTransactionVerifyMessage(address, _evm, "evm");
    setMessageToSign(message); 
  }

  const { config } = usePrepareSendTransaction({
    request: {
      to: props.request.destination,
      value: web3.utils.toWei(props.request.amount, "ether"),
    },
  });


  
  async function switchNetwork() {
    let requestChainId;
    switch(props.request.chain) {
      case "Ethereum": requestChainId = 1;
    break;
      case "BNB Smart Chain": requestChainId = 56;
    break;
      case "BSC Testnet" : requestChainId = 97;
    break;
      case "Goerli" : requestChainId = 5;
    break;
      default: requestChainId = 1;
    }

      if (window.ethereum) {
        try {
          await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
            params: [{ chainId: web3.utils.toHex(requestChainId) }],
          });
        } catch (error) {
          console.error(error);
        }
      }
    }
  const {sendTransaction} = useSendTransaction({
    ...config,
    onError(error) {
      props.errorOccured(formatErrorMessage(error));
    },
    onSuccess(data) {
      console.log(data)
      props.paymentComplete(data);
    },
    onMutate({ args, overrides }) {
      console.log("mutate")
    },
    onSettled(data, error) {
      console.log("settled")
    },
  });

  function formatErrorMessage(error) {
    let index = error.toString().indexOf("(");
    const message = error.toString().slice(0, index).toString();
    return message;
  }

  async function hasEnoughFunds() {
    const balance = await contract.balanceOf(address);
    let hexBalance = balance._hex;
    let int = web3.utils.hexToNumberString(hexBalance) / decimalSplit();
    if (int < props.request.amount) {
      return false;
    } else {
      return true;
    }
  }

  function decimalSplit() {
    let d = props.request.token.decimals;
    if (d == 6) {
      return 1e6;
    } else if (d == 8) {
      return 1e8;
    } else if (d == 12) {
      return 1e12;
    } else if (d == 18) {
      return 1e18;
    }
  }
  
  async function sendTokens() {
    const funds = await hasEnoughFunds();
    if(funds) {
      const BigNumber = require("bignumber.js");
      let amount_wei = new BigNumber(props.request.amount).shiftedBy(parseInt(props.request.token.decimals)).toString();
      try {
        const res = await contract.connect(provider).transfer(props.request.destination, amount_wei,{
          gasLimit: 25000,
          nonce: undefined});
        if (res.hash) {
          props.paymentComplete(res);
        } else {
          props.errorOccured("Error: user has insufficient balance");
        }
      } catch (ex) {
        props.errorOccured(formatErrorMessage(ex));
      }
    } else { 
      props.errorOccured("Error: user has insufficient balance");
    }
  }

  async function sendBNB() {
    const balance = await getBalanceBNB(chain.name, address);

    if(balance > props.request.amount) { 
      await sendTransaction?.();
    } else {
      props.errorOccured("Error: user has insufficient balance");
    }
  }

  async function sendETH() {
      let balance = await getBalance(chain.name,address);
      if (balance < props.request.amount) {
        props.errorOccured("Error: account has insufficient balance");
      } else {
        await sendTransaction?.();
      }    
  }
  function openInNewTab(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function startSending() {
    {
      props.startPaying();
      if(props.request.token.symbol == "ETH" || props.request.token.symbol == "BNB") {
        sendTransaction?.()
      } else {
        sendTokens();
      }
    }
  }

  return (
    <div class="display-flex">
    <div id="switch"onClick={()=> switchNetwork()}class="col pay-option swtich" >Switch Network</div>
    
      <div onClick={() => startSending()} class="col pay-option blue">
        <span>Pay</span>
        
      </div>
    </div>
  );
}

export default TransferERC20;
