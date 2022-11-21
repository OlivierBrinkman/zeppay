import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';


function initClient() {
    const token = process.env.REACT_APP_STORAGE_API_KEY
    const client = new Web3Storage({ token });
    return client;
}
export async function logEvent(address, location, _request) {
        let client  = initClient();
        const short = require('short-uuid');
        let uuid = short.generate().substring(0,6);
        //   const fileBlob = new Blob([{
        //           uuid: uuid,
        //           action:action, 
        //           address: address,
        //           locatie:location
        //       }], { type: 'application/json' })

                const request = {
                    uuid: uuid,
                    request: _request,
                    dateTime: new Date()
                }

                const files = [
                    new File([JSON.stringify(request)], 'request.json'),
                    new File([JSON.stringify(location)], 'location.json')
                  ]
          
            const cid = await client.put(files, "Request_Log");
          return cid
      }
    

      export async function retrieveEventRequest(cid) {
        const eventLink = "https://"+cid+".ipfs.w3s.link/request.json";
        const result = await fetch(eventLink).then(res => res.json()).then(data => {return data}).catch(err => { throw err })
        return result.request;
    }


      