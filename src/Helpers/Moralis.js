import Moralis from "moralis";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import { EvmChain } from "@moralisweb3/evm-utils";
import axios from "axios";

export async function getPriceByChain(token, _chain) {
  const APIKEY = process.env.REACT_APP_MORALIS_API_KEY;
  const saveLabel = token.symbol + "_USD";
  await Moralis.start({ apiKey: APIKEY });
  const chain = _chain;
  const address = token.contract;
  const response = await Moralis.EvmApi.token.getTokenPrice({address,chain});
  const usdPrice = Number.parseFloat(response.data.usdPrice).toFixed(2);
  sessionStorage.setItem(saveLabel, usdPrice);
  return usdPrice;

}
export async function fetchTokenPrice(token, chain) {

  const APIKEY = process.env.REACT_APP_MORALIS_API_KEY;
  let chainLower = chain.name.toLowerCase(); 
  let chainEncoded = chainLower.replace(" ", "%20");  
  const saveLabel = token.symbol + "_USD";
  var savedPrice = sessionStorage.getItem(saveLabel);
  if (savedPrice) {
    return savedPrice;
  } else {
    const address = token.contract;
    await Moralis.start({ apiKey: APIKEY });
      const response = await Moralis.EvmApi.token.getTokenPrice({
        address,
        chainEncoded,
      });
      const usdPrice = Number.parseFloat(response.data.usdPrice).toFixed(2);
      sessionStorage.setItem(saveLabel, usdPrice);
  return usdPrice

   
  
  }
}

async function initMoralis() {
  await Moralis.start({ apiKey: process.env.REACT_APP_MORALIS_API_KEY });
}

export async function getBSCBalance(address, chain) {
  let chainLower = chain.toLowerCase(); 
  let chainEncoded = chainLower.replace(" ", "%20");
  const options = {
    method: 'GET',
    url: 'https://deep-index.moralis.io/api/v2/'+address+'/balance',
    params: {chain: chainEncoded},
    headers: {accept: 'application/json', 'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY}
  };
  
  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
}

export async function getMoralisUserObject() {
  await initMoralis();
  return Moralis.User.current();
}

export async function verifySignature(message, signature) {
  await initMoralis();
  const network = "evm";
  const verifiedData = Moralis.Auth.verify({
    message: message,
    signature: signature,
    network: network,
  });
  return verifiedData;
}

function addDays(days) {
  var result = new Date();
  result.setDate(result.getDate() + days);
  return result.toISOString();
}

export async function requestTransactionSignatureMessage(addressTo, chain, network) {
  await Moralis.start({ apiKey: process.env.REACT_APP_MORALIS_API_KEY });
  const result = await Moralis.Auth.requestMessage({
    address: addressTo,
    chain,
    network,
    domain: "Authenticate.Zeppay.app",
    statement: "Please sign this transaction to confirm and authenticate your identity.",
    uri: "https://zeppay.app",
    expirationTime: addDays(10),
    timeout:60,
  });
  const { message } = result.toJSON();
  return message;
}

export async function requestTransactionVerifyMessage(addressTo, chain, network) {
    await Moralis.start({ apiKey: process.env.REACT_APP_MORALIS_API_KEY });
    const result = await Moralis.Auth.requestMessage({
      address: addressTo,
      chain,
      network,
      domain: "Pay.Zeppay.app",
      statement: "This confirms that the payment has reached you and is ready to be paid and Zeppay Fees are charged for our services",
      uri: "https://zeppay.app",
      expirationTime: addDays(10),
      timeout:60,
    });

  const { message } = result.toJSON();

  return message;
}

export async function getTransactionCount() {
  await Moralis.start({ apiKey: process.env.REACT_APP_MORALIS_API_KEY });

  const address = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

  const chain = EvmChain.ETHEREUM;

  const response = await Moralis.EvmApi.transaction.getWalletTransactions({ address, chain });

  return response.data.total;
}

function getChain(chain) {
   let chainLower = chain.toLowerCase(); 
  let chainEncoded = chainLower.replace(" ", "%20");
  let chainDef;
  switch(chainEncoded) {
    case "bsc":
      chainDef = EvmChain.BSC
      break;
    case "eth":
      chainDef = EvmChain.ETHEREUM
      break;
    case "bsc%20testnet":
      chainDef = EvmChain.BSC_TESTNET
      break;
    case "goerli":
      chainDef = EvmChain.GOERLI
      break;
    default:
      break;
  } 
  return chainDef
}

export async function getNativeBalance(_address, _chain) {
  await Moralis.start({ apiKey: process.env.REACT_APP_MORALIS_API_KEY });
  let chain;
  if (_chain == 1) {
    chain = EvmChain.ETHEREUM;
  } else if (_chain == 5) {
    chain = EvmChain.GOERLI;
  }
  const response = await Moralis.EvmApi.balance.getNativeBalance({_address,chain});
  return response;
}

export async function verifyMessage(signature, message) {
  const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_ANON_KEY);
  await Moralis.start({ apiKey: process.env.REACT_APP_MORALIS_API_KEY });
  const _message = message;
  const _signature = signature;
  const _network = "evm";

  const verifiedData = await Moralis.Auth.verify({
    message: _message,
    signature: _signature,
    network: _network,
  });

  const authData = verifiedData.data;
  let { data: users } = await supabase.from("users").select("*").eq("moralis_provider_id", authData.profileId);
  let _user;
  if (users.length != 0) {
    alert("user already connected");
  } else {
    const response = await supabase.from("users").insert([
      {
        created_at: new Date(),
        moralis_provider_id: authData.profileId,
        metadata: authData,
      },
    ]);
    _user = response.data;
  }

  const token = jwt.sign(
    {
      ..._user,
      aud: "authenticated",
      role: "authenticated",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    },
    "SxaQ5OLMRp/lmQqdaOP369jJsNUuKvTXU7ksIRBTzQLkL90wtYCJFbvTBZpE7e8a40Q/US/lGWFRe5SUnmNeeg=="
  );

  console.log(token);
}
