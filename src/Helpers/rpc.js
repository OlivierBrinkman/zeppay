import {useProvider, useAccount} from "wagmi"
import Web3 from "web3";

export async function getBalance(chain, address) {
  let _provider;
  if(chain == "Ethereum") { 
    _provider = "https://rpc.ankr.com/eth";
  } else {
    _provider = "https://rpc.ankr.com/eth_goerli"
  }
    const web3 = new Web3(_provider);
    const balance = await web3.eth.getBalance(address);    
    return web3.utils.fromWei(balance.toString(), 'ether')

  
}

export async function getBalanceBNB(chain, address){
    const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
    let contractAddress;
    if(chain=="BNB Smart Chain") {
        contractAddress="0x0000000000000000000000000000000000001002"
    } else {
        contractAddress="0x7feA43b76C08E98d569964Ef1267d7bA5a050e3a"
    }
    const balanceGWEI = (await web3.eth.getBalance(address)).toString();
    const parsedBalance = Web3.utils.fromWei(balanceGWEI, 'ether');
    return parsedBalance
}

async function getERC20TokenBalance(_provider, contact) {
    const Web3 = require("web3");
    const provider = _provider;
    const Web3Client = new Web3(new Web3.providers.HttpProvider(provider));

}

export async function addBNBSmartChain() {
        try {
            const wasAdded  = await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0x38',
                    chainName: 'Binance Smart Chain',
                    nativeCurrency: {
                        name: 'Binance Coin',
                        symbol: 'BNB',
                        decimals: 18
                    },
                    rpcUrls: ['https://bsc-dataseed.binance.org/'],
                    blockExplorerUrls: ['https://bscscan.com']
                }]
            })
            if (wasAdded) {
              console.log('Thanks for your interest!');
            } else {
              console.log('Your loss!');
            }
          } catch (error) {
            console.log(error);
          }
}

export async  function importToken(token) { 
    const tokenAddress = token.contract;
    const tokenSymbol = token.symbol;
    const tokenDecimals = token.decimals;
    const tokenImage = token.icon;
    
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });
    
      if (wasAdded) {
        console.log('Thanks for your interest!');
      } else {
        console.log('Your loss!');
      }
    } catch (error) {
      console.log(error);
    }
}