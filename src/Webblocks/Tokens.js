import "../styles/tokens.css";
import React, {useState, useEffect} from "react";
import Cross from "../assets/cross.png";
import Arrow from "../assets/pijl.png";
import {_getTokens} from "../helpers/supabase";

function Tokens(props) {
    return (
        <div id="tokens-list" class="tokens">
                <div class="tokens-header">
                    <div class="tokens-header-title"><a>Select a token</a><h1>Tokens</h1></div>
                    <div onClick ={()=> props.togglestate()}class="tokens-header-close">
                        <img src={Cross} width="22"/>
                    </div>
                </div>
                <div class="tokens-list">
                    <div class="stablecoin-list">
                        <span class="list-section-title">Stablecoins</span>
                            {props.stableTokens.map((_token, index) => (
                                <div onClick={()=> props.tokenSelect(_token)} key={index} class="tokens-list-item"><img src={_token.icon} width="34"/> <b>{_token.symbol}</b> - {_token.name} <img class="tokens-list-item-arrow" src={Arrow} width="18"></img> </div>
                            ))} 
                    </div>
                    <div class="crypto-list">
                        <span class="list-section-title">Cryptocurrencies</span>
                        {props.cryptoTokens.map((_token, index) => (
                                <div onClick={()=> props.tokenSelect(_token)} key={index} class="tokens-list-item"><img src={_token.icon} width="34"/> <b>{_token.symbol}</b> - {_token.name} <img class="tokens-list-item-arrow" src={Arrow} width="18"></img> </div>
                            ))} 
                    </div>
                </div>
                <div class="tokens-footer"></div>
        </div>
    )
}

export default Tokens;