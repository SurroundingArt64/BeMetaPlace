import { Db } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NFTTypes } from '../../components/NFT'
import { TableNFTSalesProps } from '../../components/TableNFTSales'
import { withDatabase } from '../../lib/mongo'

async function handler(req: NextApiRequest, res: NextApiResponse, MDB: Db) {
    switch (req.method) {
        case 'POST': {
            return postBuyOffer(req, res, MDB)
        }
    }
}

async function postBuyOffer(
    req: NextApiRequest,
    res: NextApiResponse,
    MDB: Db
) {
    try {
        const parsedJSON: NFTTypes = JSON.parse(req.body)
        const listing: TableNFTSalesProps['data'][0] = {
            owner: parsedJSON.owner as string,
            address: parsedJSON.item.address as string,
            tokenId: parsedJSON.item.tokenId as string,
            price: parsedJSON.item.value,
            timestamp: new Date().getTime().toString(),
            type: 'BUY',
        }
        MDB?.collection('LISTINGS').insertOne(listing)

        return res.json({
            message: 'NFT added successfully',
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
