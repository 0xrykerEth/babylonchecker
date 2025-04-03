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
            if (address) {
                const response = await fetch(`https://airdrop-api.babylon.foundation/checker/data?babyAddress=${address}`);
                const data = await response.json();
                results.push({ address, total: data.total });
            }
        }

        let tableHTML = `
        <html>
        <head>
            <title>Babylon Airdrop Results</title>
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
                <h2>Babylon Airdrop Results</h2>
                <table>
                    <tr>
                        <th>Address</th>
                        <th>Total</th>
                    </tr>
                    ${results.map(row => `
                    <tr>
                        <td>${row.address}</td>
                        <td>${row.total}</td>
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
