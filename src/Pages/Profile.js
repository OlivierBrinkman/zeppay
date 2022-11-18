import React, {useState, useEffect} from "react";
import Transactions from "../Webblocks/Transactions";
import { createClient } from '@supabase/supabase-js'
import {useNavigate} from "react-router-dom";
import { useAccount, useSignMessage } from 'wagmi';
import Moralis  from 'moralis';
import Web3 from "web3";
import { EvmChain } from '@moralisweb3/evm-utils';
import {requestMessage} from "../Helpers/Moralis";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {getMoralisUserObject} from "../Helpers/Moralis";
function Profile() {
    const { address, isConnected } = useAccount();
    const [messageToSign, setMessageToSign] = useState("");
    const [signature, setSignature] = useState()
    let navigate = useNavigate();
    const [user, setUser] = useState({})
    const [session, setSession] = useState({})
    const [balances, setBalances] = useState([]);
    const [balancesFetched, setBalancesFetched] = useState(false);
    const savedSession = window.localStorage.getItem("session");
    const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_ANON_KEY);

    const { signMessage } = useSignMessage({
        message: messageToSign,
        onSuccess(data) {
            console.log('Success', data)
            setSignature(data);
          },
    })

    useEffect(()=> {
        if(savedSession) { 
            setUser({})
            const object = JSON.parse(savedSession);
            setUser(object.user);
            setSession(object.session);
            
        } else {
            navigate("/authorize");
        }
    },[])




    useEffect(()=> {
        if(isConnected){ 
            getBalances()
            getMoralisAuthMessage();
        }
        
    },[isConnected])


    async function getMoralisAuthMessage() { 
        const message = await requestMessage(address, EvmChain.GOERLI, 'evm' );
        setMessageToSign(message);
    }

    async function getSignatureSigner() {
        await signMessage();
    }

    async function verifyMoralisMessage(){ 
         await verifyMoralisMessage(signature, messageToSign);
    }

    async function getBalances() {
            await Moralis.start({apiKey: process.env.REACT_APP_MORALIS_API_KEY,});
            const chain = EvmChain.GOERLI;
            const response = await Moralis.EvmApi.token.getWalletTokenBalances({address,chain,});
            setBalances(response.data);
            setBalancesFetched(true);
    }
   
    async function logOut(){    
        await supabase.auth.signOut();
        window.localStorage.clear();
        navigate("/authorize");
    }

    if(!user) {
        return (<></>)
    } else {
    return (
        
        <div class="container page profile">
            <h1>Profile</h1>
            <div class="row break-mobile">
                <div class="col-sm-5">   
                        <h2>Details</h2>

                        <div class="profile-information">
                                <div class="row">
                                    <div class="profile-label">Email</div>
                                    <div class="profile-value">{user.email?user.email:"-"}</div>
                                </div>
                                <div class="row">
                                    <div class="profile-label">Email confirmed at</div>
                                    <div class="profile-value">{user.email_confirmed_at?user.email_confirmed_at:"-"}</div>
                                </div>
                                <div class="row">
                                    <div class="profile-label">Name</div>
                                    <div class="profile-value">{user.user_metadata?user.user_metadata.name:"-"}</div>
                                </div>
                                <div class="profile-buttons">
                                <button onClick={()=> getMoralisUserObject()}>Get Moralis Account</button>
                             <button onClick={()=> getSignatureSigner()}>Test signed message</button>
                            <button onClick={()=> verifyMoralisMessage()}>Verify signed message</button>
                            <div class="flex-row">
                            <ConnectButton label="Connect Wallet"  />
                             <button onClick={()=> logOut("")} class="btn btn-logout">Logout</button>
                            </div>
                                <div class="wallet-balances">
                                    <h2>Balances</h2>
                                    {isConnected?
                                    <div class="balances-list">
                                    {balances.map((_token) => (
                                        <li key={_token.symbol}>
                                        <div id="balance-item"><img src={"https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@bea1a9722a8c63169dcc06e86182bf2c55a76bbc/svg/color/"+_token.symbol.toLowerCase()+".svg"} width="45" />
                                        <span>{_token.name}</span>
                                        <span>{parseInt(Web3.utils.fromWei(_token.balance, 'ether')).toFixed(0)} {_token.symbol} </span></div>
                                        </li>
                                    ))} </div>:<h5>Wallet not connected</h5>}
                                </div>
                             </div>
                        </div>
                </div>
                <div class="col-sm-7">
                    <h2>Transactions</h2>
                    {isConnected?
                    <Transactions/>:<h5>Wallet not connected</h5>}
                </div>
             
            </div>
        </div>
    ) }
}

export default Profile;