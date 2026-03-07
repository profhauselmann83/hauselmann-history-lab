/**
 * HIST 102 — Supabase Configuration
 * ─────────────────────────────────────────────────────────────
 * Replace the two placeholder values below with your actual
 * Supabase project credentials.
 *
 * Find them at: supabase.com → your project → Settings → API
 *
 * SUPABASE_URL  : looks like https://xxxxxxxxxxxx.supabase.co
 * SUPABASE_KEY  : the "anon / public" key (safe for client-side)
 *
 * This file is loaded by:
 *   - week1/gate.html          (gate entry logging)
 *   - week1/reading-2.html     (answer submission + PDF download)
 *   - admin/dashboard.html     (instructor view)
 * ─────────────────────────────────────────────────────────────
 */

var SUPABASE_URL = 'https://bqrluqymscucvbiaaeai.supabase.co';   // ← REPLACE
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcmx1cXltc2N1Y3ZiaWFhZWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2Njg4MTMsImV4cCI6MjA4NDI0NDgxM30.AVOjnQe_TDoWydE2wDP1_YftU1lBkYxcPuyQeZb8Nfs';                   // ← REPLACE

/**
 * Lightweight fetch wrapper for Supabase REST API.
 * Avoids loading the full Supabase JS SDK.
 *
 * Usage:
 *   sbInsert('table_name', { col: val, ... })
 *   sbSelect('table_name', 'col=eq.value')
 */

function sbInsert(table, payload) {
  return fetch(SUPABASE_URL + '/rest/v1/' + table, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'apikey':         SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Prefer':        'return=minimal'
    },
    body: JSON.stringify(payload)
  });
}

function sbSelect(table, filter, order) {
  var url = SUPABASE_URL + '/rest/v1/' + table + '?';
  if (filter) url += filter + '&';
  if (order)  url += 'order=' + order + '&';
  url += 'limit=1000';
  return fetch(url, {
    headers: {
      'apikey':         SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY
    }
  }).then(function(r){ return r.json(); });
}

function sbSignIn(email, password) {
  return fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY
    },
    body: JSON.stringify({ email: email, password: password })
  }).then(function(r){ return r.json(); });
}

function sbGetUser(token) {
  return fetch(SUPABASE_URL + '/auth/v1/user', {
    headers: {
      'apikey':         SUPABASE_KEY,
      'Authorization': 'Bearer ' + token
    }
  }).then(function(r){ return r.json(); });
}
