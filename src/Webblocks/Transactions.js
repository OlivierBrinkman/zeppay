import React,{useState, useEffect} from "react";
import web3 from "web3";
import {useAccount,} from 'wagmi'

function Transactions() {
    const {address} = useAccount();
    const[transactions, setTransactions] = useState([]);
    const [toggleBlock, setToggleBlock] = useState(0);
    const Moralis = require("moralis").default;
    const { EvmChain } = require("@moralisweb3/evm-utils");
    const APIKEY = process.env.REACT_APP_MORALIS_API_KEY;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=> {
        initMoralis().then(function () {
            getTransactionByAddress()
        })
    },[])

    useEffect(()=> {
        if(transactions.length === 0) {
            setIsLoading(false)
        } else {
      
        }
        
    },[transactions])

   async function initMoralis(){
        await Moralis.start({apiKey: APIKEY,});
   }
    
    async function getTransactionByAddress(){
        const chain = EvmChain.GOERLI;
        const response = await Moralis.EvmApi.transaction.getWalletTransactions({address,chain});
        setTransactions(response.data.result);
    }

    function toggleTableRow(blockHash) {
        if(blockHash == toggleBlock) { 
            setToggleBlock(0);
        }else {
            setToggleBlock(blockHash)
        }
    }

    return (
        <div class="container-transactions">
            <div class="transactions-content">
                {isLoading? 
                <div class="loading-transactions">
                   <div class="sk-chase">
                        <div class="sk-chase-dot"></div>
                        <div class="sk-chase-dot"></div>
                        <div class="sk-chase-dot"></div>
                        <div class="sk-chase-dot"></div>
                        <div class="sk-chase-dot"></div>
                        <div class="sk-chase-dot"></div>
                    </div>
                </div>: 
                
                <div class="transaction-list">
                    <div class="listview-transactions">
                    <div class="list-item-header">
                         <div class="item-txhash">Hash</div>   
                         <div class="item-block">Block number</div> 
                         <div class="item-datetime">Date</div>   
                         <div class="item-value">Value in Ether</div>   
                    </div>
                    
                        {transactions.map((transaction, index) => (
                        <li key={index} class="list-item-row" id={toggleBlock == transaction.block_number?"list-row-open":""} onClick={()=> toggleTableRow(transaction.block_number)}>
                            <div>
                                <div class="item-txhash col">{transaction.block_hash.substr(0,4)}...{transaction.block_hash.substr(transaction.block_hash.length - 4,transaction.block_hash.length)} </div>   
                                <div class="item-block col">{transaction.block_number}</div> 
                                    <div class="item-datetime col">{transaction.block_timestamp.substr(5,transaction.block_timestamp.length - 10).replace("T", " ")}</div>   
                                <div class="item-value col">{ Number.parseFloat(web3.utils.fromWei(transaction.value, 'ether')).toFixed(4)}</div>  
                            </div>
                            {toggleBlock == transaction.block_number?
                            <div  class="row-content" >
                                <form>
                                    <div class="transaction-collapse-item">
                                        <div class="transaction-collapse-item-text">Destination</div>
                                        <div class="transaction-collapse-item-value">{transaction.to_address.substr(0,7)}...{transaction.to_address.substr(transaction.to_address.length - 7,transaction.to_address.length)} </div>
                                    </div>
                                    <div class="transaction-collapse-item">
                                        <div class="transaction-collapse-item-text">Nonce</div>
                                        <div class="transaction-collapse-item-value">{transaction.nonce}</div>
                                    </div>
                                    <div class="transaction-collapse-item">
                                        <div class="transaction-collapse-item-text">Gas</div>
                                        <div class="transaction-collapse-item-value">{transaction.gas}</div>
                                    </div>
                                    <div class="transaction-collapse-item">
                                        <div class="transaction-collapse-item-text">Gas price</div>
                                        <div class="transaction-collapse-item-value">{transaction.nonce}</div>
                                    </div>
                                    <div class="transaction-collapse-item">
                                        <div class="transaction-collapse-item-text">Gas used</div>
                                        <div class="transaction-collapse-item-value">{transaction.receipt_gas_used}</div>
                                    </div>
                                    <div class="transaction-collapse-item">
                                        <div class="transaction-collapse-item-text">Nonce</div>
                                        <div class="transaction-collapse-item-value">{transaction.nonce}</div>
                                    </div>
                                    <div class="transaction-collapse-item">
                                        <div class="transaction-collapse-item-text">Data</div>
                                        <div class="transaction-collapse-item-value">{transaction.data}</div>
                                    </div>
                                    <div class="transaction-collapse-item">
                                        <a href={"https://etherscan.io/tx/" + transaction.block_hash}>View in Etherscan</a>
                                    </div>
                                </form>
                            </div>:<></>}
                        </li>
                    ))}
                    </div> 
                </div>}          
            </div>
        </div>
    )
}

export default Transactions;