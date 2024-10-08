// app.mjs
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Create an Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://st10027205:Pn1WLIpBVMGAEotC@cluster0.5ujzz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.log(err));

// Define the root route
app.get('/', (req, res) => {
  res.send('I am finally figuring this out, no more crying');
});

// Define a test route
app.get('/test', (req, res) => {
  res.json({ message: 'This is a secure test endpoint!' });
});

// Export the Express app
export default app;
