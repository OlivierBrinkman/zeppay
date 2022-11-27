import "../styles/tokens.css";
import React, {useEffect} from "react";
import { _getTokens } from "../helpers/supabase";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';

function Tokens(props) {


  const handleChange = e => {
  
    props.tokenSelect(e.value)
  }

  const items = []
  let stableHeader ={ label: <div class="token-list-header">Stablecoins</div>,disabled: true} 
  items.push(stableHeader)

  props.stableTokens.forEach(function (item, index) {
    let _item ={ value: item, 
      label:<div class="token-list-item"><img src={item.icon} height="24px" width="24px"/>{item.symbol} {item.name} </div> }
      items.push(_item)
  });
  let cryptoHeader ={ label: <div class="token-list-header">Cryptocurrencies</div>,disabled: true} 
  
    items.push(cryptoHeader)
  props.cryptoTokens.forEach(function (item, index) {
    let _item ={ value: item, 
      label:<div class="token-list-item"><img src={item.icon} height="24px" width="24px"/>{item.symbol} {item.name} </div> }
      items.push(_item)
  });
  

  return (
  <Select
  id="tokens"         isSearchable={false}
   options={items}  
        onChange={handleChange} 
   isOptionDisabled={(option) => option.disabled}/>
  )
}

export default Tokens;
