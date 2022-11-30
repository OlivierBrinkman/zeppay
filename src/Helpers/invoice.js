import React, {useState, useEffect} from "react";
import { Preview, print } from 'react-html2pdf';
import "../styles/invoice.css";
import Logo from "../assets/logo.png";
import html2pdf from "html2pdf.js";
import { useTransaction } from 'wagmi'
import Download from "../assets/download.png";
function Invoice(props) {
    const [request, setRequest] = useState({});
    const [payData, setPayData] = useState({});
    const short = require("short-uuid");
    const utcStr = new Date().toUTCString();
    const { data, isError, isLoading } = useTransaction({
        hash: props.hash
     })


    useEffect(()=> {
        if(props.request) {
            setRequest(props.request);
            console.log(props.request)
            print('a', 'jsx-template')
        }
    },[props])

    function generatePDF() {
        var opt = {
            margin:       0.4,
            filename:     'invoice-payment.pdf',
            image:        { type: 'pdf', quality: 0.4 },
            html2canvas:  { scale: 1},
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
          };
        const element = document.getElementById('invoice');
        html2pdf().set(opt).from(element).save();
    }

    if(!request) {
        return (
            <h1>Loading PDF</h1>
        );
    } else { 
        return (<>
        <button class="btn btn-primary btn-download " type="button" onClick={()=> generatePDF()}>Download receipt <img src={Download} width="20"/></button>
        <div class="invoice-content">
                    <div id="invoice" class="invoice">
                        <div class="invoice-header">
                            <h3>Confirmed Payment</h3>
                            <h1>Receipt</h1>
                            <img src={Logo} width="80"></img>
                        </div>  
                        <div class="table-row">
                            {data? 
                                <table class="table table-light table-striped">
                                    <thead>
                                        <tr>
                                        <th class="text-start"scope="col">Property</th>
                                        <th class="text-end" scope="col">Value</th>
                                    
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th class="text-start" scope="row">
                                                Hash
                                            </th>
                                            <th class="text-end" scope="row">
                                                {data.hash}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th class="text-start" scope="row">
                                                Block Hash
                                            </th>
                                            <th class="text-end" scope="row">
                                            {data.blockHash}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th class="text-start" scope="row">
                                                Block Number
                                            </th>
                                            <th class="text-end" scope="row">
                                            {data.blockNumber}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th class="text-start" scope="row">
                                                Index
                                            </th>
                                            <th class="text-end" scope="row">
                                            {data.transactionIndex}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th class="text-start" scope="row">
                                            Confirmations
                                            </th>
                                            <th class="text-end" scope="row">
                                            {data.confirmations}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th class="text-start" scope="row">
                                                Nonce
                                            </th>
                                            <th class="text-end" scope="row">
                                            {data.nonce}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th class="text-start" scope="row">
                                                Paid By
                                            </th>
                                            <th class="text-end" scope="row">
                                                {data.from}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th class="text-start" scope="row">
                                                Paid To
                                            </th>
                                            <th class="text-end" scope="row">
                                                {data.to}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th class="text-start" scope="row">
                                            Paid At 
                                            </th>
                                            <th class="text-end" scope="row">
                                            {utcStr}
                                            
                                            </th>
                                        </tr>
                                        <tr>
                                            <th class="text-start" scope="row">
                                            Gas Limit
                                            </th>
                                            <th class="text-end" scope="row">
                                            {data.gasLimit?data.gasLimit._hex:""}
                                            
                                            </th>
                                        </tr>
                                        <tr>
                                            <th class="text-start" scope="row">
                                            Gas Price
                                            </th>
                                            <th class="text-end" scope="row">
                                            {data.gasPrice?data.gasPrice._hex:""}
                                            
                                            </th>
                                        </tr>
                                        <tr>
                                            <th class="text-start" scope="row">
                                            Max Fee Per Gas
                                            </th>
                                            <th class="text-end" scope="row">
                                                {data.maxFeePerGas?data.maxFeePerGas._hex:""}

                                            
                                            </th>
                                        </tr>
                                        <tr>
                                            <th class="text-start" scope="row">
                                                Data
                                            </th>
                                            <th class="text-end break" scope="row">
                                            {data.data}
                                            </th>
                                        </tr>
                                    </tbody>
                                </table>
                            :<></>} 
                        </div>  

                        <div class="table-row">
                            {request?
                            <table class="table table-light table-striped">
                                <thead>
                                    <tr>
                                        <th class="text-start"scope="col">Request</th>
                                        <th class="text-end" scope="col">Value</th>
                                    </tr>
                                </thead>
                                    <tbody>
                                    <tr>
                                            <th class="text-start" scope="row">
                                            UUID 
                                            </th>
                                            <th class="text-end" scope="row">
                                            {request.unique_uuid}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th class="text-start" scope="row">
                                                Created By  
                                            </th>
                                            <th class="text-end" scope="row">
                                                {request.location_json?request.location_json.ipAddress:""}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th class="text-start" scope="row">
                                            Created At 
                                            </th>
                                            <th class="text-end" scope="row">
                                            {request.created_at}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th class="text-start" scope="row">
                                                Amount 
                                            </th>
                                            <th class="text-end" scope="row">
                                            {request.token?<img src={request.token.icon} width="26"/>:""} {request.amount}  {request.token?request.token.symbol:""}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th class="text-start" scope="row">
                                                Amount in USD 
                                            </th>
                                            <th class="text-end" scope="row">
                                                ${request.value},-
                                            </th>
                                        </tr>
                                        <tr>
                                            <th class="text-start" scope="row">
                                                Network 
                                            </th>
                                            <th class="text-end" scope="row">
                                            {request.chain}
                                            </th>
                                        </tr>

                                        <tr>
                                            <th class="text-start" scope="row">
                                                Country of origin  
                                            </th>
                                            <th class="text-end" scope="row">
                                            {request.location_json?request.location_json.countryName:""}
                                            </th>
                                        </tr>


                                        <tr>
                                            <th class="text-start" scope="row">
                                                Request Signature 
                                            </th>
                                            <th class="text-end break" scope="row">
                                            {request.signature}
                                            </th>
                                        </tr>
                                    </tbody>
                            </table>:<></>}
                        </div>
                    </div>
                    </div>
                </>
        )
    }
   
}

export default Invoice;