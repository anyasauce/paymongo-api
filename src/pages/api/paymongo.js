export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST allowed' });
    }

    const { amount, name, email, secretKey: userKey, returnUrl } = req.body;

    const secretKey = userKey || process.env.PAYMONGO_SECRET_KEY;

    if (!secretKey) {
        return res.status(400).json({ error: 'No PayMongo secret key provided' });
    }

    if (!amount || !name || !email || isNaN(amount)) {
        return res.status(400).json({ error: 'Missing or invalid input fields' });
    }

    const headers = {
        Authorization: `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
    };

    try {
        // 1. Create Payment Intent
        const intentRes = await fetch('https://api.paymongo.com/v1/payment_intents', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                data: {
                    attributes: {
                        amount,
                        payment_method_allowed: ['gcash'],
                        payment_method_types: ['gcash'],
                        currency: 'PHP',
                        capture_type: 'automatic',
                    },
                },
            }),
        });

        const intentData = await intentRes.json();
        const intentId = intentData?.data?.id;
        const clientKey = intentData?.data?.attributes?.client_key;

        if (!intentId || !clientKey) {
            return res.status(400).json({ error: 'Failed to create payment intent', details: intentData });
        }

        // 2. Create Payment Method
        const methodRes = await fetch('https://api.paymongo.com/v1/payment_methods', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                data: {
                    attributes: {
                        type: 'gcash',
                        billing: {
                            name,
                            email,
                        },
                    },
                },
            }),
        });

        const methodData = await methodRes.json();
        const paymentMethodId = methodData?.data?.id;

        if (!paymentMethodId) {
            return res.status(400).json({ error: 'Failed to create payment method', details: methodData });
        }

        // 3. Attach
        const attachRes = await fetch(`https://api.paymongo.com/v1/payment_intents/${intentId}/attach`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                data: {
                    attributes: {
                        payment_method: paymentMethodId,
                        client_key: clientKey,
                        return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment-status`,
                    },
                },
            }),
        });

        const attachData = await attachRes.json();
        const redirectUrl = attachData?.data?.attributes?.next_action?.redirect?.url;

        if (!redirectUrl) {
            return res.status(400).json({ error: 'Failed to get redirect URL', details: attachData });
        }

        return res.status(200).json({
            redirect_url: redirectUrl,
            payment_method: 'GCash',
        });
    } catch (err) {
        console.error('Server Error:', err);
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
}