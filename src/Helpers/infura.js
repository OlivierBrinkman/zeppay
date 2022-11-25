export async function getBalance (address) { 
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "jsonrpc": "2.0",
    "method": "eth_getBalance",
    "params": [
        address,
        "latest"
    ],
    "id": 1
    });

var requestOptions = {
  method: 'POST',
  headers: headers,
  body: raw,
  redirect: 'follow'
};
const result = await fetch("https://mainnet.infura.io/v3/a7a5842cf26343fb99eef41781524c81", requestOptions)
  .then(response => response.text())
  .then(_result => {return _result})
  .catch(error => console.log('error', error));

  return JSON.parse(result).result
}