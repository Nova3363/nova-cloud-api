import express from 'express';
import { supabaseAdmin } from '../supabaseClient.js';
import { v4 as uuid } from 'uuid';

export const authRouter = express.Router();

/**
 * Very simple auth:
 * - User يكتب الايميل بس
 * - إذا موجود يرجع بياناته
 * - إذا غير موجود ينشأ حساب جديد
 */
authRouter.post('/login', async (req, res) => {
  try {
    const { email, name } = req.body || {};

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (fetchError) {
      console.error('[auth/login] fetchError', fetchError);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }

    if (existingUser) {
      return res.json({
        user: existingUser
      });
    }

    const newUser = {
      id: uuid(),
      email,
      name: name || null
    };

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (insertError) {
      console.error('[auth/login] insertError', insertError);
      return res.status(500).json({ error: 'Failed to create user' });
    }

    return res.status(201).json({ user: inserted });
  } catch (err) {
    console.error('[auth/login] error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
