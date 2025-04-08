const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/checker', (req, res) => {
    res.sendFile(path.join(__dirname, './', 'index.html'));
});

router.post('/checker', async (req, res) => {
    try {
        let addresses = req.body.addresses || '';
        let results = [];

        let addressList = addresses.split(',').map(addr => addr.trim());

        for (let address of addressList) {
            if (!address) continue;

            try {
                const response = await fetch(`https://claim.hyperlane.foundation/api/check-eligibility?address=${address}`);

                if (!response.ok) {
                    console.error(`Failed to fetch for ${address}: HTTP ${response.status}`);
                    results.push({ address, amount: 'Error fetching' });
                    continue;
                }

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text(); // optional: to log unexpected HTML
                    console.error(`Unexpected content type for ${address}: ${contentType}`);
                    console.error(`Response text: ${text.slice(0, 200)}...`);
                    results.push({ address, amount: 'Invalid content' });
                    continue;
                }

                const data = await response.json();
                let amount = data.response?.eligibilities?.[0]?.amount || "0";
                results.push({ address, amount });
            } catch (err) {
                console.error(`Error fetching or parsing for ${address}:`, err.message);
                results.push({ address, amount: 'Error occurred' });
            }
        }

        let tableHTML = `
        <html>
        <head>
            <title>Hyperlane Airdrop Results</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #f4f4f4;
                }
                .container {
                    width: 50%;
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }
                h2 {
                    text-align: center;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    padding: 10px;
                    border: 1px solid #ddd;
                    text-align: center;
                }
                th {
                    background-color: #007bff;
                    color: white;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Hyperlane Airdrop Results</h2>
                <table>
                    <tr>
                        <th>Address</th>
                        <th>Tokens</th>
                    </tr>
                    ${results.map(row => `
                    <tr>
                        <td>${row.address}</td>
                        <td>${row.amount}</td>
                    </tr>`).join('')}
                </table>
            </div>
        </body>
        </html>
        `;

        res.send(tableHTML);

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred.");
    }
});

module.exports = router;
