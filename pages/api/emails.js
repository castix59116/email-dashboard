export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://eu2.make.com/api/v2/data-stores/167132/data?pg[limit]=50',
      {
        method: 'GET',
        headers: {
          'Authorization': 'Token d8d3aac6-6667-4767-81bd-1075d858772b',
          'Accept': 'application/json'
        }
      }
    );
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
