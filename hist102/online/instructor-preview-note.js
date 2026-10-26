/**
 * HIST C1002 — Instructor preview note for gate pages
 * Add to a week's gate page, after the gate's own script:
 *   <script src="../instructor-preview-note.js" data-week="w2"></script>
 *
 * When this browser holds an instructor preview pass (set by the
 * Instructor Course Map, W number 'INSTRUCTOR'), the gate does not skip
 * ahead. It shows the normal student form, and this script adds a small
 * banner with a link to skip straight to the week. Students never have
 * this pass, so they never see the banner.
 */

(function () {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var thisScript = scripts[scripts.length - 1];
  var weekId = thisScript.getAttribute('data-week') || 'w1';
  var target = thisScript.getAttribute('data-next') || 'index.html';

  var pass;
  try { pass = JSON.parse(localStorage.getItem('hist102_access_' + weekId) || '{}'); } catch (e) { return; }
  if (!pass || pass.wnum !== 'INSTRUCTOR') return;

  var bar = document.createElement('div');
  bar.setAttribute('role', 'note');
  bar.style.cssText = [
    'position:fixed', 'left:0', 'right:0', 'bottom:0', 'z-index:9999',
    'background:#3d6053', 'color:#f7f2e8',
    'font-family:"DM Mono",monospace', 'font-size:12px', 'letter-spacing:0.04em',
    'padding:10px 16px', 'text-align:center', 'line-height:1.5'
  ].join(';');
  bar.innerHTML = 'Instructor preview is on — this is the form students see. ' +
    '<a href="' + target + '" style="color:#f7f2e8;font-weight:600;text-decoration:underline;">' +
    'Skip to Week ' + weekId.replace('w', '') + ' &rarr;</a>';

  function add() { document.body.appendChild(bar); }
  if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);
})();
