import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/template.css";
import App from "./pages/main";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  GetSiweMessageOptions,
  DisclaimerComponent,
  Theme,
} from "@rainbow-me/rainbowkit";

import { chain, configureChains, WagmiConfig, createClient } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.goerli],
  [infuraProvider({ apiKey: "a7a5842cf26343fb99eef41781524c81" })],
  [publicProvider()]
);



//ttps://bsc-dataseed.binance.org/

const { connectors } = getDefaultWallets({ appName: "Zeppay", chains });
const wagmiClient = createClient({ autoConnect: true, connectors, provider });
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
        showRecentTransactions={false}
        chains={chains}
      >
        <App />
      </RainbowKitProvider>
    </WagmiConfig>

    {/* </MoralisProvider>  */}
  </React.StrictMode>
);
