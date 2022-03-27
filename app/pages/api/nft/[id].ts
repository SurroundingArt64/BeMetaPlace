import type { NextApiRequest, NextApiResponse } from 'next'

import { connectToDatabase } from '../../../lib/mongo'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      return getNFTs(res)
    }
  }
}

async function getNFTs(res: NextApiResponse) {
  try {
    let { db } = await connectToDatabase()
    let posts = await db
      .collection('NFT')
      .find({})
      .sort({ published: -1 })
      .toArray()
    return res.json({
      message: JSON.parse(JSON.stringify(posts)),
      success: true,
    })
  } catch (error) {
    return res.json({
      message: new Error(error as string).message,
      success: false,
    })
  }
}
