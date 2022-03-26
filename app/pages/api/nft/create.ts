import type { NextApiRequest, NextApiResponse } from 'next'

import { connectToDatabase } from '../../../lib/mongo'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
      return addNFT(req, res)
    }
  }
}

async function addNFT(req: NextApiRequest, res: NextApiResponse) {
  try {
    let { db } = await connectToDatabase()
    await db.collection('NFT').insertOne(JSON.parse(req.body))
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
