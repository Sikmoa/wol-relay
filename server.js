const express = require('express');
const wol = require('wake_on_lan');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cors());

// Set your target PC's MAC address
const TARGET_MAC = '00:11:22:33:44:55'; 

// Pre-computed SHA-256 hash of your chosen password 
// (Default hash below corresponds to the password: "mySecurePassword123")
const PASSWORD_HASH = 'f192582ef5a0555594b79f8d702290961148bc554374584e33e21808bbbc2aa7';

app.post('/wake', (req, res) => {
    const { passwordHash } = req.body;

    if (!passwordHash || passwordHash !== PASSWORD_HASH) {
        return res.status(401).json({ error: 'Unauthorized: Invalid password' });
    }

    wol.wake(TARGET_MAC, { address: '255.255.255.255', port: 9 }, (error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to send magic packet' });
        }
        console.log(`Wake packet sent to ${TARGET_MAC}`);
        res.json({ success: true, message: 'Wake packet dispatched!' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Relay running on port ${PORT}`));
