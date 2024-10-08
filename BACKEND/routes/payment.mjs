import express from 'express';
import rateLimit from 'express-rate-limit';
import checkAuth from './middleware/checkAuth.mjs';  // Import authentication middleware
import Payment from '../models/Payment.mjs';  // Import the Payment model (create this in your models directory)

const router = express.Router();

// Apply rate limiting to prevent abuse of the payment API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,  // Limit each IP to 10 payment requests per window
  message: "Too many payment requests from this IP, please try again after 15 minutes",
});

// Route: POST "/payments"
// Description: Create a new payment request (Protected Route)
router.post('/', checkAuth, limiter, async (req, res) => {
  const { customerName, amount, paymentMethod, orderId } = req.body;

  // Validate required fields
  if (!customerName || !amount || !paymentMethod || !orderId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Check for valid amount
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid payment amount' });
  }

  try {
    // Create a new Payment object
    const newPayment = new Payment({
      customerName,
      amount,
      paymentMethod,
      orderId,
      status: 'Pending',  // Default status is 'Pending'
      createdAt: new Date(),
    });

    // Save the new payment request to the database
    await newPayment.save();
    res.status(201).json({ message: 'Payment request created successfully', payment: newPayment });
  } catch (error) {
    console.error('Error creating payment request:', error);
    res.status(500).json({ message: 'Error creating payment request', error });
  }
});

// Route: GET "/payments/:id"
// Description: Get a payment request by ID (Protected Route)
router.get('/:id', checkAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: `Payment request with ID ${id} not found` });
    }
    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment request:', error);
    res.status(500).json({ message: 'Error fetching payment request', error });
  }
});

// Route: PATCH "/payments/:id"
// Description: Update a payment request status by ID (Protected Route)
router.patch('/:id', checkAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Check for valid status
  const validStatuses = ['Pending', 'Completed', 'Failed'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: `Payment request with ID ${id} not found` });
    }

    // Update the payment status
    payment.status = status;
    await payment.save();
    res.json({ message: `Payment status updated successfully to ${status}`, payment });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Error updating payment status', error });
  }
});

// Route: DELETE "/payments/:id"
// Description: Delete a payment request by ID (Protected Route)
router.delete('/:id', checkAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findByIdAndDelete(id);
    if (!payment) {
      return res.status(404).json({ message: `Payment request with ID ${id} not found` });
    }
    res.json({ message: `Payment request with ID ${id} deleted successfully`, payment });
  } catch (error) {
    console.error('Error deleting payment request:', error);
    res.status(500).json({ message: 'Error deleting payment request', error });
  }
});

export default router;
