import React, {useState, useEffect } from "react";
import {Navigate, useNavigate ,useLocation} from 'react-router-dom';
import { QRCode } from "react-qrcode-logo";
import Logo from "../assets/logo.png";
import Copy from "../assets/copy.png";
import Whatsapp from "../assets/whatsapp.png";
import Telegram from "../assets/tele.png";
import Slack from "../assets/slack.png";
import Gmail from "../assets/gmail.png";
import Pijl from "../assets/pijl.png";
import "../styles/share.css"
function Share() {
    const location = useLocation();
    const navigate = useNavigate();
    const [request,setRequest] = useState({});

    useEffect(()=> {
        if(location.state) {
            setRequest(location.state.request);
     
        }
    },[location])
    return (
  
        <div class="container page share w3-animate-bottom">
            <a onClick={() => navigate("/create")}> {"<"} Reset request</a>
            <h1>Share</h1>
            <div class="share-content">
                <div class="qrcode">
                        <QRCode
                            size="320"
                            value={location.state.cdiLink}
                            ecLevel="H"
                            quietZone=""
                            bgColor="transparent"
                            enableCORS="true"
                            fgColor="#000"
                            logoWidth="45"
                            logoImage={Logo}
                            removeQrCodeBehindLogo="true"
                            eyeRadius={[
                                { // top/left eye
                                    outer: [10, 10, 10, 10],
                                    inner: [2, 2, 2, 2],
                                },
                                { // top/left eye
                                    outer: [10, 10, 10, 10],
                                    inner: [2, 2, 2, 2],
                                },
                                { // top/left eye
                                    outer: [10, 10, 10, 10],
                                    inner: [2, 2, 2, 2],
                                }]}
                            eyeColor={[{ // top/left eye
                                outer: '#000',
                                inner: '#000',
                            },
                            { // top/left eye
                                outer: '#000',
                                inner: '#000',
                            },
                            { // top/left eye
                                outer: '#000',
                                inner: '#000',
                            }]}
                        />
                        <div class="qrcode-copy">
                            <div>
                            <h3>Click to copy</h3>
                            <img src={Copy} width="24"/>
                            </div>
                        </div>
                </div>
                <div class="socialshare-content">
                    <div class="socialshare s1"><div class="social-icon"><img src={Whatsapp} width="32"/></div> <div id="te">Whatsapp</div> <img class="s-img" src={Pijl} width="20"/></div>
                    <div class="socialshare s2"><div class="social-icon"><img src={Telegram} width="32"/></div> <div id="te">Telegram</div> <img  class="s-img" src={Pijl} width="20"/></div>
                    <div class="socialshare s3"><div class="social-icon"><img src={Slack} width="32"/></div> <div id="te">Slack</div> <img  class="s-img" src={Pijl} width="20"/></div>
                    <div class="socialshare s4"><div class="social-icon"><img src={Gmail} width="32"/></div> <div id="te">Gmail</div> <img  class="s-img" src={Pijl} width="20"/></div>

                </div>
            </div>
               
        </div>

    

    )
}

export default Share;