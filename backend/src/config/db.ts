import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Tries to read MONGO_URI from the .env file
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error('Error: MONGO_URI is not defined in the .env file');
      process.exit(1); // Stops the application
    }

    // Connects to the MongoDB database
    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
    } else {
      console.error('An unknown error occurred while connecting to MongoDB');
    }
    process.exit(1); // Stops the application if any error occurs
  }
};

export default connectDB;
