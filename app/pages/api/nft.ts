import type { NextApiRequest, NextApiResponse } from 'next'

import { connectToDatabase } from '../../lib/mongo'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      return getNFTs(res)
    }
    case 'POST': {
      return addNFT(req, res)
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