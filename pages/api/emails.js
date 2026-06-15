export default async function handler(req, res) {
  const response = await fetch(
    'https://eu2.make.com/api/v2/data-store-records?dataStoreId=167132&pg[limit]=50',
    {
      headers: {
        'Authorization': 'Token d8d3aac6-6667-4767-81bd-1075d858772b',
        'Content-Type': 'application/json'
      }
    }
  );
  const data = await response.json();
  res.status(200).json(data);
}
