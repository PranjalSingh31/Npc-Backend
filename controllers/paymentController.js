const Razorpay = require('razorpay');
const crypto = require('crypto');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const getRazorpayClient = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

exports.createRazorpayOrder = async (req, res) => {
  try {
    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return res.status(500).json({ error: 'Razorpay is not configured on server' });
    }

    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount) return res.status(400).json({ error: 'Amount required' });

    const options = {
      amount: amount * 100, // INR → paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Razorpay order creation failed' });
  }
};

exports.razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = req.rawBody ? req.rawBody.toString("utf8") : JSON.stringify(req.body);

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
      .update(body)
      .digest('hex');

    if (expected !== signature) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    console.log('Webhook Event:', req.body.event);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Webhook error' });
  }
};
