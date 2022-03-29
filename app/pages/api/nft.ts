import type { NextApiRequest, NextApiResponse } from 'next'
import { TableNFTSalesProps } from '../../components/TableNFTSales'
import { pinJSONToIPFS } from '../../lib/ipfs'

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
    let nfts = await db.collection('NFT').find({}).toArray()
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

async function addNFT(req: NextApiRequest, res: NextApiResponse) {
  try {
    const uri = await pinJSONToIPFS(req.body)
    if (!uri) throw new Error('Failed to pin JSON to IPFS')
    let { db } = await connectToDatabase()
    const parsedJSON = JSON.parse(req.body)
    await db.collection('NFT').insertOne({ ...parsedJSON, uri })
    const listing: TableNFTSalesProps['data'][0] = {
      owner: parsedJSON.owner as string,
      address: parsedJSON.item.address as string,
      tokenId: parsedJSON.item.tokenId as string,
      price: '0',
      timestamp: new Date().getTime().toString(),
      type: 'CREATION',
    }
    await db.collection('LISTINGS').insertOne(listing)
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
