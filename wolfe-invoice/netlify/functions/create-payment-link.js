const Stripe = require("stripe");

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { amount, currency = "aud", invoiceNumber, description } = body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid amount" }),
    };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    // Create a one-time price
    const price = await stripe.prices.create({
      currency,
      unit_amount: Math.round(amount * 100), // cents
      product_data: {
        name: description || `Invoice ${invoiceNumber || ""}`.trim(),
      },
    });

    // Create the payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      metadata: {
        invoice_number: invoiceNumber || "",
      },
      after_completion: {
        type: "hosted_confirmation",
        hosted_confirmation: {
          custom_message: "Thank you for your payment. Wolfe Productions",
        },
      },
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: paymentLink.url }),
    };
  } catch (err) {
    console.error("Stripe error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
