export async function getUserLocation() {
    const snifferURL = "https://api.db-ip.com/v2/free/self"
    let res = await fetch(snifferURL);
    return await res.json();
}

