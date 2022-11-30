import React,{useState, useEffect}from 'react'
import { useSignMessage,useAccount} from 'wagmi'
import {getRequestMessage} from "../helpers/wagmi";
import { EvmChain } from "@moralisweb3/evm-utils";

function NotFound() {
    
    return (
        <div class="container page notfound">
            <h1>404 - Page Not Found</h1>

        </div>
    )
}

export default NotFound;