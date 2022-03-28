import type { NextApiRequest, NextApiResponse } from 'next'

import { connectToDatabase } from '../../../lib/mongo'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      return getNFTs(req, res)
    }
  }
}

async function getNFTs(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { params } = req.query
    const address = params[0]
    let tokenId
    if (params.length > 1) tokenId = params[1]
    let { db } = await connectToDatabase()
    const query = tokenId
      ? { 'item.address': address, 'item.tokenId': tokenId }
      : { 'item.address': address }
    let nft = await db.collection('NFT').find(query).toArray()
    return res.json({
      message: JSON.parse(JSON.stringify(tokenId ? nft[0] : nft)),
      success: true,
    })
  } catch (error) {
    return res.json({
      message: new Error(error as string).message,
      success: false,
    })
  }
}