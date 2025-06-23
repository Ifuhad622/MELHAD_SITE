const axios = require('axios');

const initiatePayment = async (req, res) => {
  try {
    const response = await axios.post('https://api.monime.com/v1/payment', {
      amount: 10000,  // in your smallest currency unit (e.g., cents or leones)
      currency: 'SLL',
      customer_email: 'customer@example.com',
      customer_name: 'Customer Name',
      reference: 'unique-order-id-123',
      callback_url: 'https://yourwebsite.com/payment-callback'
    }, {
      headers: {
        Authorization: `Bearer YOUR_SECRET_KEY`
      }
    });

    res.json(response.data); // or redirect the user to the payment page
  } catch (error) {
    console.error(error.response.data);
    res.status(500).send('Payment failed');
  }
};
