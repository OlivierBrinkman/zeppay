import Moralis from 'moralis';
import jwt from "jsonwebtoken";
import { createClient } from '@supabase/supabase-js'
import web3 from "web3";

async function initMoralis() {
  await Moralis.start({apiKey: process.env.REACT_APP_MORALIS_API_KEY,});
}

export async function getMoralisUserObject() {
  await initMoralis();
  return Moralis.User.current()
}

export async function createSignedAccount() {
  web3.eth.personal.sign("Hello world", "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "test password!")
  .then(console.log);
}

export async function verifySignature(_message, _signature) { 
 
  await initMoralis()
  const message = _message;
  const signature = _signature;
  const network = "evm";
  
  const verifiedData = Moralis.Auth.verify({
    message: message,
    signature: signature,
    network: network,
  });

}

export async function requestMessage(address, chain, network) {
  await Moralis.start({apiKey: process.env.REACT_APP_MORALIS_API_KEY,});
  const result = await Moralis.Auth.requestMessage({
    address,
    chain,
    network,
    domain: 'authenticate.zeppay.app',
    statement: 'Please sign this message to confirm your identity.',
    uri: 'https://zeppay.app',
    expirationTime: '2023-01-01T00:00:00.000Z',
    timeout: 15,
  });

  const { message } = result.toJSON();

  return message;
}

function addDays(days) {
  var result = new Date();
  result.setDate(result.getDate() + days);
  return result.toISOString()
}

export async function requestTransactionSignatureMessage(addressTo, chain, network) {

    await Moralis.start({apiKey: process.env.REACT_APP_MORALIS_API_KEY,});
    const result = await Moralis.Auth.requestMessage({
      address:addressTo,
      chain,
      network,
      domain: 'Authenticate.Zeppay.app',
      statement: 'Please sign this transaction to confirm and authenticate your identity.',
      uri: 'https://zeppay.app',
      expirationTime: addDays(10),
      timeout: 15,
    });
    
    const { message } = result.toJSON();
  
    return message;
}

export async function verifyMessage(signature, message) {
    const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_ANON_KEY);
    await Moralis.start({apiKey: process.env.REACT_APP_MORALIS_API_KEY,});
    const _message = message
    const _signature = signature
    const _network = "evm"
    
    const verifiedData = await Moralis.Auth.verify({
      message: _message,
      signature: _signature,
      network: _network,
    })

    const authData = verifiedData.data;
    let { data: users } = await supabase.from('users').select("*").eq('moralis_provider_id', authData.profileId);
    let _user;
    if(users.length != 0) { 
      alert("user already connected")
    } else {
        const response = await supabase.from('users').insert([
            { created_at: new Date(),
            moralis_provider_id: authData.profileId,
            metadata : authData
         }])    
          _user = response.data;
        }

        const token = jwt.sign(
          {
            ..._user,
            aud: 'authenticated',
            role: 'authenticated',
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
          },
          "SxaQ5OLMRp/lmQqdaOP369jJsNUuKvTXU7ksIRBTzQLkL90wtYCJFbvTBZpE7e8a40Q/US/lGWFRe5SUnmNeeg==",
        );

        console.log(token)
      
}

  