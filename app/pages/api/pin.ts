import { NextApiRequest, NextApiResponse } from 'next'
import { pinJSONToIPFS } from '../../lib/ipfs'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'POST': {
            return pinNFTDataToIpfs(req, res)
        }
    }
}

interface IPinNFTDataToIpfsReq extends NextApiRequest {
    body: {
        name: string
        image: string
        description?: string
        video?: string
    }
}

async function pinNFTDataToIpfs(
    req: IPinNFTDataToIpfsReq,
    res: NextApiResponse
) {
    const uri = await pinJSONToIPFS(req.body)
    return res.json({ uri, success: true })
}
