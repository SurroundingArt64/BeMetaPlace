import { Db } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { withDatabase } from '../../../lib/mongo'

async function handler(req: NextApiRequest, res: NextApiResponse, MDB: Db) {
    switch (req.method) {
        case 'GET': {
            return getNFTs(req, res, MDB)
        }
    }
}

async function getNFTs(req: NextApiRequest, res: NextApiResponse, MDB: Db) {
    try {
        const { params } = req.query
        const address = params[0]
        let tokenId
        if (params.length > 1) tokenId = params[1]
        const query = tokenId
            ? { 'item.address': address, 'item.tokenId': tokenId }
            : { 'item.address': address }
        let nft = await MDB?.collection('NFT').find(query).toArray()
        return res.json({
            message: JSON.parse(JSON.stringify(tokenId ? nft && nft[0] : nft)),
            success: true,
        })
    } catch (error) {
        return res.json({
            message: new Error(error as string).message,
            success: false,
        })
    }
}

export default withDatabase(handler)
