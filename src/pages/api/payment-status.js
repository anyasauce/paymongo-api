export default async function handler(req, res) {
    const { id } = req.query;

    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    // console.log('Secret Key (first 5 chars):', secretKey ? secretKey.substring(0, 5) : 'NOT SET'); // Careful with logging full secret key!
    console.log('Received ID:', id);

    if (!id) {
        console.error('Error: Missing ID in API call.');
        return res.status(400).json({ error: 'Missing payment intent ID' });
    }
    if (!secretKey) {
        console.error('Error: PAYMONGO_SECRET_KEY is not set in environment variables.');
        return res.status(400).json({ error: 'Missing PayMongo secret key in server environment' });
    }

    try {
        const paymongoRes = await fetch(`https://api.paymongo.com/v1/payment_intents/${id}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
                'Content-Type': 'application/json',
            },
        });

        const json = await paymongoRes.json();

        // --- Crucial Debugging Logs ---
        console.log('PayMongo API HTTP Status:', paymongoRes.status);
        console.log('Raw PayMongo API Response JSON:', JSON.stringify(json, null, 2));
        // --- End Debugging Logs ---

        if (!paymongoRes.ok) {
            // PayMongo returned an error status (e.g., 401, 404, 500)
            console.error('PayMongo API returned an error:', json?.errors || json);
            return res.status(paymongoRes.status).json({
                status: 'Failed (PayMongo API Error)',
                error: json?.errors || 'PayMongo API error, no specific details provided',
                paymongoHttpStatus: paymongoRes.status,
                details: null
            });
        }

        const status = json?.data?.attributes?.status;
        const details = json?.data?.attributes;

        if (!status) {
            // PayMongo returned 200 OK, but the expected data structure is missing
            console.error('Unexpected PayMongo response structure. Missing status:', json);
            return res.status(400).json({
                status: 'Unknown',
                error: 'Unexpected PayMongo response structure. Status field missing.',
                paymongoResponseData: json, // Send the full JSON for inspection
                details: null
            });
        }

        return res.status(200).json({ status, details });

    } catch (error) {
        console.error('Server-side fetch error to PayMongo API:', error.message);
        return res.status(500).json({
            error: 'Failed to fetch status due to internal server error',
            errorMessage: error.message,
            details: null
        });
    }
}