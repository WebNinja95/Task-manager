import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();

const db = process.env.db_url;
const connectToDatabase = () => { 
    mongoose.connect(db)
    .then(()=>console.log('connected to mongodb..'))
    .catch(err => console.error('could not connectd erorrr mongodb!'))

}

export default connectToDatabase;