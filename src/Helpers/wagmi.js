import { useSignMessage} from 'wagmi';
import Moralis from "moralis";

function addDays(days) {
    var result = new Date();
    result.setDate(result.getDate() + days);
    return result.toISOString();
}

export async function getRequestMessage(_address, chain, network) {
    await Moralis.start({ apiKey: process.env.REACT_APP_MORALIS_API_KEY });
    const result = await Moralis.Auth.requestMessage({
      address: _address,
      chain,
      network,
      domain: "Authenticate.Zeppay.app",
      statement: "Please sign this request to confirm and authenticate your identity. ",
      uri: "https://zeppay.app",
      expirationTime: addDays(10),
      timeout: 15,
    });
    const {message} = result.toJSON();
    return message;
}
