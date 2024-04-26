import { connect } from 'http2';
import mongoose from 'mongoose';
require('dotenv').config();
 

const dbUrl: string = process.env.DB_URL || "mongodb://127.0.0.1:27017/LMS";


const connectDB = async () => {
  try {
    const data = await mongoose.connect(dbUrl);
    console.log(`Database connected with ${data.connection.host}`);
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
