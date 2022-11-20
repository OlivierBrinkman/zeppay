
import Construction from "../Assets/construction.png"
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    document.title = 'Zeppay | Home '
    return (
        <div class="home w3-animate-opacity">
            <div class="home-block-1">
                <div class="flex-div"><div><h1>Crypto payment infrastructure,</h1><h1>Empowering Africa based remote workers.</h1></div></div>
                <div class="home-construction-text">
                   <div><img src={Construction} width="30"/> <h3>Under Construction</h3></div>
                <p>We are currently still in the test phase and we are working hard to launch as soon as possible.
                If you have any questions, you can always leave a message via the form or send us an email to info@zeppay.app
                </p>
                <div>
                <button class="btn-contact" onClick={()=> navigate("/contact")}>Leave a message</button>  <button onClick={()=> navigate("/create")} class="btn-beta">Use beta</button>

                </div>
                </div>
            </div>
            {/* <div class="container-full home-block-2">
                <div class="row">
                    <div class="col-8">
                    <h1>Pay and get paid in cryptos</h1>
                    <span>
                        With zeppay you can quickly and easily create a payment request
                        for a crypto selected by you. Add a message and share it on any of
                        the social channels. Requests can be transferred directly from
                        your wallet within 2 clicks. Requests can also be paid in USD or EUR through the onRamper platform.    
                    </span>
                        <div>
                            <button class="btn-home">Learn more...</button>
                        </div>
                    </div>
                    <div class="col-4"></div>

                </div>
            </div>
            <div class="container-full home-block-3">
                <h1>Features</h1>
                <div class="row">
                    <div class="col-4">
                        <div class="feature-item">
                            <div class="feature-item-icon">
                                <img src={ID} width="80"/>
                            </div>
                            <div class="feature-item-subtitle">
                                Identity
                            </div>
                            <div class="feature-item-title">
                                Anonymous Requests
                            </div>
                            <div class="feature-item-content">
                                Proin lobortis tellus sapien, et tempor lorem varius id. Curabitur a nulla magna. Ut felis diam, maximus nec metus ut.                            </div>
                            <div class="feature-item-bottom">
                                <button class="btn-home">Learn more...</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="feature-item">
                            <div class="feature-item-icon">
                                <img src={World} width="80"/>
                            </div>
                            <div class="feature-item-subtitle">
                                Transfers
                            </div>
                            <div class="feature-item-title">
                                Global Support
                            </div>
                            <div class="feature-item-content">
                            Proin lobortis tellus sapien, et tempor lorem varius id. Curabitur a nulla magna. Ut felis diam, maximus nec metus ut.                            </div>
                            <div class="feature-item-bottom">
                                <button class="btn-home">Learn more...</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                    
                        <div class="feature-item">
                            <div class="feature-item-icon">
                                <img src={Lock} width="80"/>
                            </div>
                            <div class="feature-item-subtitle">
                                Costs
                            </div>
                            <div class="feature-item-title">
                                Low Fees
                           </div>
                            <div class="feature-item-content">
                            Proin lobortis tellus sapien, et tempor lorem varius id. Curabitur a nulla magna. Ut felis diam, maximus nec metus ut.                              
                         </div>
                            <div class="feature-item-bottom">
                                <button class="btn-home">Learn more...</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="feature-item">
                            <div class="feature-item-icon">
                                <img src={Bolt} width="80"/>
                            </div>
                            <div class="feature-item-subtitle">
                                Performance
                            </div>
                            <div class="feature-item-title">
                               Unrivaled Speed and Accessibility
                            </div>
                            <div class="feature-item-content">
                            Proin lobortis tellus sapien, et tempor lorem varius id. Curabitur a nulla magna. Ut felis diam, maximus nec metus ut.                               Proin lobortis tellus sapien, et tempor lorem varius id. Curabitur a nulla magna. Ut felis diam, maximus nec metus ut.</div>
                            <div class="feature-item-bottom">
                                <button class="btn-home">Learn more...</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                    <div class="feature-item">
                            <div class="feature-item-icon">
                                <img src={Receipt} width="80"/>
                            </div>
                            <div class="feature-item-subtitle">
                                Accountancy
                            </div>
                            <div class="feature-item-title">
                                Clear Receipts
                            </div>
                            <div class="feature-item-content">
                            Proin lobortis tellus sapien, et tempor lorem varius id. Curabitur a nulla magna. Ut felis diam, maximus nec metus ut.                               Proin lobortis tellus sapien, et tempor lorem varius id. Curabitur a nulla magna. Ut felis diam, maximus nec metus ut.</div>
                            <div class="feature-item-bottom">
                                <button class="btn-home">Learn more...</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-full home-block-4">
            <h1>We Support</h1>
            <div class="features">
                <div class="supported-item">
                <h3>Stablecoins</h3>
                <div>
                <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdc.svg" width="65"></img>
                <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdt.svg" width="65"></img>
                <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/dai.svg" width="65"></img>
                <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/tusd.svg" width="65"></img>
                <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/gusd.svg" width="65"></img>
                <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/husd.svg" width="65"></img>
               

                </div>
                </div>
                <div class="supported-item">
                <h3>Cryptocurrencies</h3>
                <div>
                <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/eth.svg" width="65"></img>
                <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/btc.svg" width="65"></img>
                <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/bnb.svg" width="65"></img>
                <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/matic.svg" width="65"></img>
                <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/link.svg" width="65"></img>
                <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/doge.svg" width="65"></img>
                <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/xrp.svg" width="65"></img>

                </div>

               </div>
                <div class="supported-item">
                <h3>Wallets</h3>
                <div>
                <img src="https://cdn.consensys.net/uploads/metamask-1.svg" width="65"></img>
                <img src="https://seeklogo.com/images/W/walletconnect-logo-EE83B50C97-seeklogo.com.png" width="65"></img>
                <img src="https://trustwallet.com/assets/images/media/assets/TWT.png" width="65"></img>
                <img src="https://avatars.githubusercontent.com/u/18060234?s=280&v=4" width="65"></img>

                </div>

              </div>
              <div class="supported-item">
                <h3>Payment Methods</h3>
                <div>
                <img id="visa" src={Visa} width="65"></img>
                <img id="mc" src={MC} width="65"></img>
                <img id="apple" src={Apple} width="65"></img>
                <img id="google" src={Google} width="65"></img>


                </div>

              </div>
                <div class="supported-item">
                <h3>Networks</h3> 
                <div>
                <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/eth.svg" width="65"></img>
                <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/matic.svg" width="65"></img>
                <img src="https://gateway.optimism.io/static/media/optimism.caeb9392.svg" width="65"></img>
                <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/bnb.svg" width="65"></img>
                <img src="https://www.quicknode.com/assets/icons/arb-a5d8364881c46822ed71066689478687a3acfbad416378d525cc790a76167a77.png" width="65"></img>

                </div>
            </div>
            </div>       
            </div> */}
            <div class="background-overlay overlay-login w3-animate-bottom"></div>

        </div>
    )
}

export default Home;