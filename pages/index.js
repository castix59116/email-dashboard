import { useState, useEffect } from 'react';

export default function Home() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState({});
  const [drafts, setDrafts] = useState({});

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/emails');
    const data = await res.json();
    const records = (data.records || []).filter(r => r.data?.status === 'en attente');
    setEmails(records);
    const d = {};
    records.forEach(r => { d[r.key] = r.data?.body_draft || ''; });
    setDrafts(d);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const send = async (key, to, subject) => {
    setSending(s => ({ ...s, [key]: true }));
    await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, to, subject: 'Re: ' + subject, body: drafts[key] })
    });
    setEmails(e => e.filter(r => r.key !== key));
    setSending(s => ({ ...s, [key]: false }));
  };

  const ignore = (key) => setEmails(e => e.filter(r => r.key !== key));

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>📬 Dashboard email</h1>
        <button onClick={load} style={{ padding: '6px 14px', cursor: 'pointer', borderRadius: 8, border: '1px solid #ddd' }}>↻ Actualiser</button>
      </div>

      {loading && <p style={{ color: '#888' }}>Chargement...</p>}

      {!loading && emails.length === 0 && (
        <p style={{ color: '#888', textAlign: 'center', padding: '3rem' }}>✅ Aucun mail en attente</p>
      )}

      {emails.map(r => {
        const d = r.data || {};
        return (
          <div key={r.key} style={{ border: '1px solid #e5e5e5', borderRadius: 12, marginBottom: '1rem', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>De : {d.from}</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{d.subject}</div>
            </div>
            <div style={{ padding: '1rem 1.25rem' }}>
              {d.body_original && (
                <div style={{ fontSize: 13, color: '#888', background: '#f5f5f5', borderRadius: 8, padding: '8px 12px', marginBottom: '1rem', maxHeight: 80, overflow: 'auto' }}>
                  {d.body_original}
                </div>
              )}
              <div style={{ fontSize: 12, color: '#aaa', marginBottom: 6 }}>Réponse Claude</div>
              <textarea
                value={drafts[r.key] || ''}
                onChange={e => setDrafts(dr => ({ ...dr, [r.key]: e.target.value }))}
                style={{ width: '100%', minHeight: 140, padding: '10px 14px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 14, fontFamily: 'system-ui', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, padding: '0.75rem 1.25rem', background: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
              <button
                onClick={() => send(r.key, d.from, d.subject)}
                disabled={sending[r.key]}
                style={{ padding: '7px 18px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}
              >
                {sending[r.key] ? 'Envoi...' : '✉ Envoyer'}
              </button>
              <button
                onClick={() => ignore(r.key)}
                style={{ padding: '7px 14px', background: 'transparent', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', color: '#888' }}
              >
                Ignorer
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
