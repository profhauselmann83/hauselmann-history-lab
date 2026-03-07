/**
 * HIST 102 — Course Security
 * Shared across all weeks via <script src="../security.js"></script>
 *
 * Protections:
 *   1. Disable right-click context menu
 *   2. Disable copy / cut / paste events
 *   3. Block keyboard shortcuts (Ctrl+P, Ctrl+S, Ctrl+U, Ctrl+Shift+I, F12, etc.)
 *   4. Devtools detection — blur page content when devtools open
 */

(function () {
  'use strict';

  // ── 1. DISABLE RIGHT-CLICK ──────────────────────────────────────────────
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
  });

  // ── 2. DISABLE COPY / CUT ───────────────────────────────────────────────
  // Paste remains allowed so students can paste into answer textareas.
  document.addEventListener('copy', function (e) {
    // Allow copy inside textareas (student's own answers)
    if (e.target && e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
    return false;
  });

  document.addEventListener('cut', function (e) {
    if (e.target && e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
    return false;
  });

  // ── 3. BLOCK KEYBOARD SHORTCUTS ────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    const ctrl = e.ctrlKey || e.metaKey; // metaKey = Cmd on Mac

    // Ctrl/Cmd + P  →  Print
    if (ctrl && e.key === 'p') {
      e.preventDefault(); return false;
    }

    // Ctrl/Cmd + S  →  Save page
    if (ctrl && e.key === 's') {
      e.preventDefault(); return false;
    }

    // Ctrl/Cmd + U  →  View source
    if (ctrl && e.key === 'u') {
      e.preventDefault(); return false;
    }

    // Ctrl/Cmd + Shift + I  →  DevTools (Elements / Console)
    if (ctrl && e.shiftKey && (e.key === 'i' || e.key === 'I')) {
      e.preventDefault(); return false;
    }

    // Ctrl/Cmd + Shift + J  →  DevTools (Console, Chrome)
    if (ctrl && e.shiftKey && (e.key === 'j' || e.key === 'J')) {
      e.preventDefault(); return false;
    }

    // Ctrl/Cmd + Shift + C  →  DevTools (Inspector)
    if (ctrl && e.shiftKey && (e.key === 'c' || e.key === 'C')) {
      // Only block if NOT inside a textarea (students need Ctrl+C to copy their own work)
      if (!e.target || e.target.tagName !== 'TEXTAREA') {
        e.preventDefault(); return false;
      }
    }

    // F12  →  DevTools
    if (e.key === 'F12') {
      e.preventDefault(); return false;
    }

    // Ctrl/Cmd + A  →  Select all (outside textareas)
    if (ctrl && e.key === 'a') {
      if (!e.target || e.target.tagName !== 'TEXTAREA') {
        e.preventDefault(); return false;
      }
    }
  });

  // ── 4. DEVTOOLS DETECTION ───────────────────────────────────────────────
  // Method: measure window dimensions vs. a threshold.
  // When devtools open docked to the side or bottom, the outer/inner
  // window dimensions diverge by more than ~160px.

  var devtoolsOpen = false;
  var warningEl    = null;
  var contentEl    = null;
  var checkInterval;

  function getWarningEl() {
    if (!warningEl) {
      warningEl = document.getElementById('devtools-warning');
      if (!warningEl) {
        warningEl = document.createElement('div');
        warningEl.id = 'devtools-warning';
        warningEl.className = 'devtools-warning';
        warningEl.innerHTML =
          '<h2>Access Restricted</h2>' +
          '<p>Browser developer tools are not permitted on this page.<br>' +
          'Please close DevTools to continue.</p>';
        document.body.appendChild(warningEl);
      }
    }
    return warningEl;
  }

  function getContentEl() {
    if (!contentEl) {
      contentEl = document.getElementById('page-content');
    }
    return contentEl;
  }

  function showWarning() {
    if (devtoolsOpen) return;
    devtoolsOpen = true;
    document.body.classList.add('devtools-open');
    getWarningEl().classList.add('active');
  }

  function hideWarning() {
    if (!devtoolsOpen) return;
    devtoolsOpen = false;
    document.body.classList.remove('devtools-open');
    getWarningEl().classList.remove('active');
  }

  function checkDevtools() {
    var widthThreshold  = window.outerWidth  - window.innerWidth  > 160;
    var heightThreshold = window.outerHeight - window.innerHeight > 160;

    // Also check via console timing trick (detects undocked devtools)
    var start = performance.now();
    // A debugger statement will pause ONLY if devtools is open
    // We use a no-op that takes longer when devtools is inspecting
    (function () {}).constructor('debugger')(); // linter-safe invocation
    var elapsed = performance.now() - start;
    var timingDetect = elapsed > 100;

    if (widthThreshold || heightThreshold || timingDetect) {
      showWarning();
    } else {
      hideWarning();
    }
  }

  // Start checking once DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    checkInterval = setInterval(checkDevtools, 1000);
    checkDevtools(); // immediate check on load
  });

  // Also re-check on resize (catching docked devtools)
  window.addEventListener('resize', checkDevtools);

})();
