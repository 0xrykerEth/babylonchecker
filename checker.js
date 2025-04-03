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

        res.json(results);

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred.");
    }
});

module.exports = router;
