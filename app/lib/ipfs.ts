const key = process.env.IPFS_KEY
const secret = process.env.IPFS_SECRET

export const pinJSONToIPFS = async (JSONBody: any): Promise<string> => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        pinata_api_key: key as string,
        pinata_secret_api_key: secret as string,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSONBody,
    })
    const rdata = await response.json()
    console.log(rdata)
    const resp: string = rdata.IpfsHash
    return resp
  } catch (error: any) {
    console.error(error)
    return 'IPFS ERROR'
  }
}
