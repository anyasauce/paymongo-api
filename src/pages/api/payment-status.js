// pages/api/payment-status.js

export default async function handler(req, res) {
    const { payment_intent_id } = req.query;

    if (!payment_intent_id) {
        return res.status(400).json({ error: 'Missing payment_intent_id' });
    }

    try {
        const response = await fetch(`https://api.paymongo.com/v1/payment_intents/${payment_intent_id}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!data.data) {
            return res.status(404).json({ status: 'Unknown' });
        }

        return res.status(200).json({
            status: data.data.attributes.status,
            details: data.data.attributes,
        });
    } catch (error) {
        return res.status(500).json({ status: 'Error', error: error.message });
    }
}
