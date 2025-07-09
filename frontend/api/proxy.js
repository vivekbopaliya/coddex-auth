export default async function handler(req, res) {

  const backendUrl = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}${req.url}`;

  try {
    const response = await fetch(backendUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined, // remove host header to avoid CORS issues
      },
      body: req.method === 'GET' ? undefined : JSON.stringify(req.body),
    });

    const data = await response.text(); // use .text() to handle both JSON and raw
    res.status(response.status).send(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy request failed' });
  }
}
