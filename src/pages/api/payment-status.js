export default async function handler(req, res) {
    const { id } = req.query; // Already extracts 'id'

    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    if (!id || !secretKey) {
        return res.status(400).json({ error: 'Missing ID or secret key' });
    }

    try {
        const paymongoRes = await fetch(`https://api.paymongo.com/v1/payment_intents/${id}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
                'Content-Type': 'application/json',
            },
        });

        const json = await paymongoRes.json();

        const status = json?.data?.attributes?.status;
        const details = json?.data?.attributes;

        if (!status) {
            // Include more detailed error for debugging if this happens
            console.error("PayMongo response missing status:", json);
            return res.status(400).json({ status: 'Unknown', details: null, rawResponse: json });
        }

        return res.status(200).json({ status, details });
    } catch (error) {
        console.error('API Error fetching payment status:', error);
        return res.status(500).json({ error: 'Failed to fetch status' });
    }
}