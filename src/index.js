import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/template.css";
import App from "./pages/main";
import {getDefaultWallets,RainbowKitProvider,darkTheme} from "@rainbow-me/rainbowkit";
import {chain,configureChains, WagmiConfig,createClient,createStorage} from "wagmi";



import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
require('dotenv').config()

const BinanceChain = {
  id: 56,
  name: 'BNB Smart Chain',
  network: 'BNB Smart Chain',
  iconUrl: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/bnb.svg',
  iconBackground: '#ffffff',
  nativeCurrency: {
    decimals: 8,
    name: 'Binance Coin',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: 'https://bsc-dataseed.binance.org/',
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' },
    etherscan: { name: 'BscScan', url: 'https://bscscan.com' },
  },
  testnet: false,
};
const BinanceChainTestnet = {
  id: 97,
  name: 'BSC Testnet',
  network: 'BSC Testnet',
  iconUrl: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/bnb.svg',
  iconBackground: '#ffffff',
  nativeCurrency: {
    decimals: 8,
    name: 'Binance Coin',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://explorer.binance.org/smart-testnet' },
    etherscan: { name: 'BscScan', url: 'https://explorer.binance.org/smart-testnet' },
  },
  testnet: true,
};


const {chains, provider, webSocketProvider} = configureChains(
  [chain.mainnet, chain.goerli],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({ appName: "Zeppay", chains });
const wagmiClient = createClient({ 
  autoConnect: true, 
  connectors,
  storage: createStorage({ storage: window.localStorage },),
  provider,
  webSocketProvider });
   
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    {/* <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}> */}
    <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#5657FE",
            accentColorForeground: "#fff",
            borderRadius: "large",
            fontStack: "system",
            overlayBlur: "small",
          })}
          modalSize="compact" 
          showRecentTransactions={false}
          chains={chains}>
          <App />
        </RainbowKitProvider>
    </WagmiConfig>

    {/* </MoralisProvider>  */}
  </React.StrictMode>
);
