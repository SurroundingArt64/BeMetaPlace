import { Db, MongoClient } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

const MONGODB_URI = process.env.MDB_URI
const MONGODB_DB = process.env.MDB_DB

if (!MONGODB_URI) {
    throw new Error('Define the MONGODB_URI environmental variable')
}

export const withDatabase = (handler: any) => {
    return async (req: NextRequest, res: NextResponse) => {
        let client = new MongoClient(MONGODB_URI as string)
        await client.connect()
        const MDB: Db = client.db(MONGODB_DB)
        return handler(req, res, MDB)
    }
}
