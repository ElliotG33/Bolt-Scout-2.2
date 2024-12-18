// import { error } from 'console';
import mongoose from 'mongoose';

export async function connect() {
  try {
    console.log(process.env.MONGO_URL);
    mongoose.connect(process.env.MONGO_URL!);
    const connection = mongoose.connection;
    connection.on('connected', () => {
      console.log('DB connected Successfully');
    });

    connection.on('error', (error) => {
      console.log('DB connection error. Make sure DB is running ' + error);
      process.exit();
    });
  } catch (error) {
    console.log('Something went wrong');
    console.log(error);
  }
}
