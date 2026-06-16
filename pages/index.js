eimport { useState, useEffect } from 'react';

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
