/**
 * This script sets up a MongoDB replica set for development purposes.
 * It's required for Prisma to perform transactions.
 * 
 * Run this script with: node scripts/setup-mongo-replica.js
 */

import { MongoClient } from 'mongodb';

async function setupReplicaSet() {
  try {
    console.log('Setting up MongoDB replica set for development...');
    
    // Connect to MongoDB
    const uri = 'mongodb://localhost:27017/admin';
    const client = new MongoClient(uri);
    await client.connect();
    
    // Check if replica set is already initialized
    try {
      const status = await client.db('admin').command({ replSetGetStatus: 1 });
      console.log('Replica set is already initialized:', status.set);
      await client.close();
      return;
    } catch (error) {
      // If replSetGetStatus fails, it means the replica set is not initialized
      console.log('Replica set not initialized. Initializing now...');
    }
    
    // Initialize replica set
    const config = {
      _id: 'rs0',
      members: [
        { _id: 0, host: 'localhost:27017' }
      ]
    };
    
    const result = await client.db('admin').command({ replSetInitiate: config });
    console.log('Replica set initialization result:', result);
    
    // Wait for replica set to initialize
    console.log('Waiting for replica set to initialize...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check replica set status
    const status = await client.db('admin').command({ replSetGetStatus: 1 });
    console.log('Replica set status:', status.set);
    console.log('Replica set members:', status.members.map(m => ({ _id: m._id, name: m.name, state: m.stateStr })));
    
    console.log('MongoDB replica set setup complete!');
    await client.close();
  } catch (error) {
    console.error('Error setting up MongoDB replica set:', error);
    process.exit(1);
  }
}

setupReplicaSet();
