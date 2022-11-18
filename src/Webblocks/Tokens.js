import "../Styles/Tokens.css";
import { ethContracts } from "../Helpers/ETHContracts";
import Cross from "../Assets/cross.png";
import Arrow from "../Assets/pijl.png";
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
                    <ul>
                    {ethContracts.tokens.map((_token, index) => (
                            <li onClick={()=> props.tokenSelect(_token)} key={index} class="tokens-list-item"><img src={_token.icon} width="34"/> <b>{_token.symbol}</b> - {_token.name} <img class="tokens-list-item-arrow" src={Arrow} width="18"></img> </li>
                        ))} 
                    </ul>
                </div>
                <div class="tokens-footer"></div>
        </div>
    )
}

export default Tokens;