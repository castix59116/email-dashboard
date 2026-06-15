export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { id, to, subject, body } = req.body;
  const response = await fetch('https://hook.eu2.make.com/7ypau4pq1fjozbxb8bxicdnkfhquoftj', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, to, subject, body })
  });
  if (response.ok) {
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ error: 'Webhook failed' });
  }
}
