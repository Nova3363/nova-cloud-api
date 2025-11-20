import express from 'express';
import { supabaseAdmin } from '../supabaseClient.js';
import { v4 as uuid } from 'uuid';
import { config } from '../config.js';
import fetch from 'node-fetch';

export const jobsRouter = express.Router();

/**
 * Get all jobs for a user
 * query: user_id
 */
jobsRouter.get('/', async (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  const { data, error } = await supabaseAdmin
    .from('jobs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[jobs/list] error', error);
    return res.status(500).json({ error: 'Failed to fetch jobs' });
  }

  return res.json({ jobs: data || [] });
});

/**
 * Get one job
 */
jobsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from('jobs')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[jobs/get] error', error);
    return res.status(500).json({ error: 'Failed to fetch job' });
  }

  if (!data) {
    return res.status(404).json({ error: 'Job not found' });
  }

  return res.json({ job: data });
});

/**
 * Create job:
 * body: { user_id, command }
 */
jobsRouter.post('/create', async (req, res) => {
  const { user_id, command } = req.body || {};

  if (!user_id || !command) {
    return res.status(400).json({ error: 'user_id and command are required' });
  }

  const job = {
    id: uuid(),
    user_id,
    command,
    status: 'pending',
    result: null
  };

  const { data, error } = await supabaseAdmin
    .from('jobs')
    .insert(job)
    .select()
    .single();

  if (error) {
    console.error('[jobs/create] insert error', error);
    return res.status(500).json({ error: 'Failed to create job' });
  }

  // Optionally notify queue worker
  if (config.queueWebhookUrl) {
    try {
      await fetch(config.queueWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: job.id })
      });
    } catch (err) {
      console.warn('[jobs/create] Failed to notify queue worker', err.message);
    }
  }

  return res.status(201).json({ job: data });
});
