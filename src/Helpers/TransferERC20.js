import { erc20ABI, useAccount, useContract,useProvider, useSigner } from 'wagmi'
import { ethers } from "ethers";
import React, {useEffect} from "react";
import Moralis from 'moralis';
import ABI from "./ABI.json";
import Web3 from "web3";
function TransferERC20(props) {

   const { address } = useAccount()
   const provider = useProvider()
   const { data: signer} = useSigner()
   const BigNumber = require("bignumber.js")


   
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
     let result = await contract.connect(signer).transfer(props.address, strtodec(props.amount, props.decimals))   
 
      if(result) {
       console.log(result)
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
