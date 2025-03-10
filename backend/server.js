const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors package
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors({
  origin: 'https://ipcheck-g8jy.onrender.com', // Allow requests from your frontend domain
  methods: ['GET'], // Allow only GET requests
  credentials: true // Allow cookies and credentials (if needed)
}));

// Shodan Proxy Endpoint
app.get('/shodan/:ip', async (req, res) => {
  const { ip } = req.params;
  const shodanApiKey = process.env.SHODAN_API_KEY; // Use environment variable
  try {
    const response = await axios.get(`https://api.shodan.io/shodan/host/${ip}?key=${shodanApiKey}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Shodan data' });
  }
});

// AbuseIPDB Proxy Endpoint
app.get('/abuseipdb/:ip', async (req, res) => {
  const { ip } = req.params;
  const abuseIpDbApiKey = process.env.ABUSEIPDB_API_KEY; // Use environment variable
  try {
    const response = await axios.get(`https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}`, {
      headers: {
        'Key': abuseIpDbApiKey,
        'Accept': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching AbuseIPDB data' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});