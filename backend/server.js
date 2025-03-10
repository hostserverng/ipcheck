const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

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
