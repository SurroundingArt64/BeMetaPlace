import { Db } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { withDatabase } from '../../../../lib/mongo'

async function handler(req: NextApiRequest, res: NextApiResponse, MDB: Db) {
    switch (req.method) {
        case 'GET': {
            return getListings(req, res, MDB)
        }
    }
}

async function getListings(req: NextApiRequest, res: NextApiResponse, MDB: Db) {
    try {
        const { params } = req.query
        const address = params[0]
        let tokenId = params[1]
        const query = { address: address, tokenId: tokenId }
        let listings = await MDB?.collection('LISTINGS').find(query).toArray()
        return res.json({
            message: JSON.parse(JSON.stringify(listings)),
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
