import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../../lib/mongo'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      return getListings(req, res)
    }
  }
}

async function getListings(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { params } = req.query
    const address = params[0]
    let tokenId = params[1]
    let { db } = await connectToDatabase()
    const query = { address: address, tokenId: tokenId }
    let listings = await db.collection('LISTINGS').find(query).toArray()
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