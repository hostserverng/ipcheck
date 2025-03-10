const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors({
  origin: ['https://ipcheck-g8jy.onrender.com', 'https://ip.nevamo.de'], // Allow requests from your frontend domain
  methods: ['GET'], // Allow only GET requests
  credentials: true // Allow cookies and credentials (if needed)
}));

// Shodan Proxy Endpoint
app.get('/shodan/:ip', async (req, res) => {
  const { ip } = req.params;
  const shodanApiKey = process.env.SHODAN_API_KEY; // Use environment variable
  try {
    const response = await axios.get(`https://api.shodan.io/shodan/host/${ip}?key=${shodanApiKey}`);
    console.log('Shodan API Response:', response.data); // Log the Shodan response
    res.json(response.data);
  } catch (error) {
    console.error('Shodan API Error:', error.response ? error.response.data : error.message);
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
    console.error('AbuseIPDB API Error:', error.message);
    res.status(500).json({ error: 'Error fetching AbuseIPDB data' });
  }
});

// IPinfo Proxy Endpoint
app.get('/ipinfo/:ip', async (req, res) => {
  const { ip } = req.params;
  const ipinfoApiKey = process.env.IPINFO_API_KEY; // Use environment variable
  try {
    const response = await axios.get(`https://ipinfo.io/${ip}?token=${ipinfoApiKey}`);
    res.json(response.data);
  } catch (error) {
    console.error('IPinfo API Error:', error.message);
    res.status(500).json({ error: 'Error fetching IPinfo data' });
  }
});

// Combined Endpoint
app.get('/ip/:ip', async (req, res) => {
  const { ip } = req.params;
  const results = {};

  try {
    // Fetch Shodan data
    const shodanApiKey = process.env.SHODAN_API_KEY;
    const shodanResponse = await axios.get(`https://api.shodan.io/shodan/host/${ip}?key=${shodanApiKey}`);
    results.shodan = shodanResponse.data;
  } catch (error) {
    console.error('Shodan API Error:', error.message);
    results.shodan = { error: 'Shodan data unavailable' };
  }

  try {
    // Fetch AbuseIPDB data
    const abuseIpDbApiKey = process.env.ABUSEIPDB_API_KEY;
    const abuseIpDbResponse = await axios.get(`https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}`, {
      headers: {
        'Key': abuseIpDbApiKey,
        'Accept': 'application/json'
      }
    });
    results.abuseipdb = abuseIpDbResponse.data;
  } catch (error) {
    console.error('AbuseIPDB API Error:', error.message);
    results.abuseipdb = { error: 'AbuseIPDB data unavailable' };
  }

  try {
    // Fetch IPinfo data
    const ipinfoApiKey = process.env.IPINFO_API_KEY;
    const ipinfoResponse = await axios.get(`https://ipinfo.io/${ip}?token=${ipinfoApiKey}`);
    results.ipinfo = ipinfoResponse.data;
  } catch (error) {
    console.error('IPinfo API Error:', error.message);
    results.ipinfo = { error: 'IPinfo data unavailable' };
  }

  // Send combined results
  res.json(results);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});