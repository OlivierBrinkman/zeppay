import "../styles/tokens.css";
import React, {useEffect} from "react";
import { _getTokens } from "../helpers/supabase";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import {  useNetwork } from "wagmi";

function Tokens(props) {

  const {chain} = useNetwork();

  const handleChange = e => {
  
    props.tokenSelect(e.value)
  }

  const items = []
  let stableHeader ={ label: <div class="token-list-header">Stablecoins</div>,disabled: true} 
  items.push(stableHeader)

    props.stableTokens.forEach(function (item, index) {
    let _item ={ value: item, 
      label:<div class="token-list-item"><img src={item.icon} height="28px" width="32px"/><span>{item.symbol}</span> {item.name} </div> }
      if(chain.name == "Goerli" || chain.name == "BSC Testnet") {
        if(item.contract_test) {
            items.push(_item)      
        }
       } else { 
          items.push(_item)
       }
  });
  let cryptoHeader ={ label: <div class="token-list-header">Cryptocurrencies</div>,disabled: true} 
    items.push(cryptoHeader)
    props.cryptoTokens.forEach(function (item, index) {
    let _item ={ value: item, 
      label:<div class="token-list-item"><img src={item.icon} height="28px" width="32px"/><span>{item.symbol}</span> {item.name} </div> }
      if(chain.name == "Goerli" || chain.name == "BSC Testnet") {
        if(item.contract_test) {
            items.push(_item)      
        }
       } else { 
          items.push(_item)
       }
  });
  

  return (
  <Select id="tokens" isSearchable={false} options={items} onChange={handleChange} isOptionDisabled={(option) => option.disabled}/>
  )
}

export default Tokens;
