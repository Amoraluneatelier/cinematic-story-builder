import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { return res.status(200).end(); }
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jobId } = req.query;
  if (!jobId) {
    return res.status(400).json({ error: 'Missing jobId' });
  }

  try {
    const job = await kv.get(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    // A job still pending after about 75 seconds means the background run was cut off
    // (e.g. the function time limit). Report it as failed so the page unlocks.
    if (job.status === 'pending' && job.createdAt && Date.now() - job.createdAt > 75000) {
      return res.status(200).json({ status: 'error', error: 'Generation timed out. Please try again.' });
    }
    return res.status(200).json(job);
  } catch (err) {
    return res.status(500).json({ error: 'Storage error', detail: String(err) });
  }
}
