
import React from "react";
import { useBalance } from 'wagmi';

function BalanceByContract(props) { 

    const { data } = useBalance({
        address: '0x7feA43b76C08E98d569964Ef1267d7bA5a050e3a',
        token: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        onSuccess(data) {
            console.log('Success', data)
          },
      })
      
    return (
        <div class="balance-item">
            <div class="balance-item-icon">
                <img src={props.token.icon} width="40"></img>
            </div>
            <div class="balance-item-middle">
                <h3>{props.token.symbol}</h3>
                <span>{props.token.name}</span>
            </div>
            <div class="balance-item-price">
                
            </div>
            <div class="balance-item-balance">
            Balance: {data?.formatted} {data?.symbol}
            </div>
            {props.token.symbol}
        </div>
    )
}

export default BalanceByContract;