import { Db } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NFTTypes } from '../../components/NFT'
import { TableNFTSalesProps } from '../../components/TableNFTSales'
import { pinJSONToIPFS } from '../../lib/ipfs'
import { withDatabase } from '../../lib/mongo'

async function handler(req: NextApiRequest, res: NextApiResponse, MDB: Db) {
    switch (req.method) {
        case 'GET': {
            return getNFTs(res, MDB)
        }
        case 'POST': {
            return addNFT(req, res, MDB)
        }
    }
}

async function getNFTs(res: NextApiResponse, MDB: Db) {
    try {
        let nfts = await MDB?.collection('NFT').find({}).toArray()
        return res.json({
            message: JSON.parse(JSON.stringify(nfts)),
            success: true,
        })
    } catch (error) {
        return res.json({
            message: new Error(error as string).message,
            success: false,
        })
    }
}

async function addNFT(req: NextApiRequest, res: NextApiResponse, MDB: Db) {
    try {
        const parsedJSON: NFTTypes = JSON.parse(req.body)
        await MDB?.collection('NFT').insertOne({ ...parsedJSON })
        const listing: TableNFTSalesProps['data'][0] = {
            owner: parsedJSON.owner as string,
            address: parsedJSON.item.address as string,
            tokenId: parsedJSON.item.tokenId as string,
            price: (parsedJSON.item && parsedJSON.item.value) ?? '0',
            timestamp: new Date().getTime().toString(),
            type: 'CREATION',
        }
        await MDB?.collection('LISTINGS').insertOne(listing)
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
