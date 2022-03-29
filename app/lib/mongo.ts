import { Db, MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MDB_URI
const MONGODB_DB = process.env.MDB_DB

if (!MONGODB_URI) {
    throw new Error('Define the MONGODB_URI environmental variable')
}

let cachedClient: MongoClient
let cachedDb: Db

export const connectToDatabase = async () => {
    if (cachedClient && cachedDb) {
        return
    }

    // Connect to cluster
    let client = new MongoClient(MONGODB_URI as string)
    await client.connect()
    let db = client.db(MONGODB_DB)
    // set cache
    cachedClient = client
    cachedDb = db
}

export { cachedClient as MDClient, cachedDb as MDB }
