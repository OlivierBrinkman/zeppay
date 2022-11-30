import React, {useState, useEffect } from "react";
import {Navigate, useNavigate ,useLocation} from 'react-router-dom';
import { QRCode } from "react-qrcode-logo";
import Logo from "../assets/logo.png";
import _Copy from "../assets/copy.png";
import Whatsapp from "../assets/whatsapp.png";
import Telegram from "../assets/tele.png";
import Slack from "../assets/slack.png";
import Gmail from "../assets/gmail.png";
import Pijl from "../assets/pijl.png";
import "../styles/share.css";
import { Preview, print } from 'react-html2pdf';
import Bleep from "../assets/bleep.mp3";
import Toastify from "toastify-js";


import Invoice from "../helpers/invoice";
function Share() {
    const location = useLocation();
    const navigate = useNavigate();
    const [request,setRequest] = useState({});
    const audio = new Audio(Bleep);
    document.title = "Zeppay - Share"

    useEffect(()=> {
        if(location.state) {
            setRequest(location.state.request);
            document.getElementById("page").style.opacity=1;
     
        }
    },[location])
    function notification(title, type) {
        let danger = "#d63031";
        let success = "#5657FE";
        let background;
        if (type == "danger") {
          background = danger;
        } else {
          background = success;
        }
        Toastify({
          text: title,
          gravity: "bottom",
          duration: 3000,
          position: "left",
          close: true,
          backgroundColor: background,
        }).showToast();
      }
    

    function OpenWhatsapp() {
        window.open("https://wa.me/?text=" + location.state.plainText, "_blank", "noopener,noreferrer")
    }

    function OpenTelegram() {
        window.open("https://t.me/share/url?url=Payment Request&text=" + location.state.plainText, "_blank", "noopener,noreferrer")
    }

    function OpenSlack() {
        window.open("slack://user?team={TEAM_ID}&id={USER_ID}" + location.state.plainText, "_blank", "noopener,noreferrer")
    }

    function OpenGmail() {
        window.open("https://mail.google.com/mail/u/0/?fs=1&to=&su=Payment Request&body="+location.state.plainText+"&tf=cm", "_blank", "noopener,noreferrer")
    }

    function Copy() {
        audio.loop = false;
        audio.play()
        navigator.clipboard.writeText(location.state.cdiLink)  
        notification("Request copied to clipboard", "success");
  
    }
    return (
  
        <div id="page" class="container page share">
            
            {/* <Invoice request={location.state.request}/> */}
            <a onClick={() => navigate("/create")}> {"<"} Reset request</a>
            <h1>Share</h1>
            <div class="share-content">
                <div onClick={()=> Copy()} class="qrcode">
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
                            <img src={_Copy} width="24"/>
                            </div>
                        </div>
                </div>
                <div class="socialshare-content">
                    <div onClick={()=> OpenWhatsapp()} class="socialshare s1"><div class="social-icon"><img src={Whatsapp} width="32"/></div> <div id="te">Whatsapp</div> <img class="s-img" src={Pijl} width="20"/></div>
                    <div onClick={()=> OpenTelegram()} class="socialshare s2"><div class="social-icon"><img src={Telegram} width="32"/></div> <div id="te">Telegram</div> <img  class="s-img" src={Pijl} width="20"/></div>


                    <div onClick={()=> OpenSlack()} class="socialshare s3"><div class="social-icon"><img src={Slack} width="32"/></div> <div id="te">Slack</div> <img  class="s-img" src={Pijl} width="20"/></div>
                    <div onClick={()=> OpenGmail()} class="socialshare s4"><div class="social-icon"><img src={Gmail} width="32"/></div> <div id="te">Gmail</div> <img  class="s-img" src={Pijl} width="20"/></div>

                </div>
            </div>
               
        <div class="background-overlay "></div>
        </div>

    

    )
}

export default Share;