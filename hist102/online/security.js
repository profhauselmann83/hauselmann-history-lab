/**

- HIST 102 — Course Security
- Shared across all weeks via <script src="../security.js"></script>
- 
- Protections:
- 1. Disable right-click context menu
- 1. Disable copy / cut / paste events
- 1. Block keyboard shortcuts (Ctrl+P, Ctrl+S, Ctrl+U, Ctrl+Shift+I, F12, etc.)
- 1. Devtools detection — blur page content when devtools open
- ```
   NOTE: Devtools detection is desktop-only (skipped on screens < 768px).
  ```
- ```
   Mobile browsers trigger false positives via address bar hide/show,
  ```
- ```
   keyboard appearance, and orientation changes.
  ```

*/

(function () {
‘use strict’;

// ── MOBILE DETECTION ────────────────────────────────────────────────────
// Devtools detection is meaningless on phones and causes false positives.
// All other protections (right-click, copy, keyboard shortcuts) still apply.
var isDesktop = window.screen.width >= 768;

// ── 1. DISABLE RIGHT-CLICK ──────────────────────────────────────────────
document.addEventListener(‘contextmenu’, function (e) {
e.preventDefault();
return false;
});

// ── 2. DISABLE COPY / CUT ───────────────────────────────────────────────
// Paste remains allowed so students can paste into answer textareas.
document.addEventListener(‘copy’, function (e) {
// Allow copy inside textareas (student’s own answers)
if (e.target && e.target.tagName === ‘TEXTAREA’) return;
e.preventDefault();
return false;
});

document.addEventListener(‘cut’, function (e) {
if (e.target && e.target.tagName === ‘TEXTAREA’) return;
e.preventDefault();
return false;
});

// ── 3. BLOCK KEYBOARD SHORTCUTS ────────────────────────────────────────
document.addEventListener(‘keydown’, function (e) {
const ctrl = e.ctrlKey || e.metaKey; // metaKey = Cmd on Mac

```
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
```

});

// ── 4. DEVTOOLS DETECTION (DESKTOP ONLY) ───────────────────────────────
// Skipped entirely on mobile screens to prevent false positives from:
//   - Address bar hiding/showing on scroll
//   - Soft keyboard pushing innerHeight
//   - Orientation changes
//   - Chrome/Safari on iOS/Android reporting dimensions differently

if (!isDesktop) return; // ← exits the entire IIFE for mobile visitors

var devtoolsOpen = false;
var warningEl    = null;
var checkInterval;

// Capture the initial inner dimensions once on desktop load.
// Used as baseline so normal browser chrome doesn’t trigger detection.
var baselineHeight = window.innerHeight;
var baselineWidth  = window.innerWidth;

function getWarningEl() {
if (!warningEl) {
warningEl = document.getElementById(‘devtools-warning’);
if (!warningEl) {
warningEl = document.createElement(‘div’);
warningEl.id = ‘devtools-warning’;
warningEl.className = ‘devtools-warning’;
warningEl.innerHTML =
‘<h2>Access Restricted</h2>’ +
‘<p>Browser developer tools are not permitted on this page.<br>’ +
‘Please close DevTools to continue.</p>’;
document.body.appendChild(warningEl);
}
}
return warningEl;
}

function showWarning() {
if (devtoolsOpen) return;
devtoolsOpen = true;
document.body.classList.add(‘devtools-open’);
getWarningEl().classList.add(‘active’);
}

function hideWarning() {
if (!devtoolsOpen) return;
devtoolsOpen = false;
document.body.classList.remove(‘devtools-open’);
getWarningEl().classList.remove(‘active’);
}

function checkDevtools() {
// Compare outer vs inner dimensions.
// Threshold raised to 200px to reduce false positives from browser UI.
var widthThreshold  = window.outerWidth  - window.innerWidth  > 200;
var heightThreshold = window.outerHeight - window.innerHeight > 200;

```
if (widthThreshold || heightThreshold) {
  showWarning();
} else {
  hideWarning();
}
```

}

// Start checking once DOM is ready
document.addEventListener(‘DOMContentLoaded’, function () {
// Re-capture baseline after full DOM load in case browser chrome settled
baselineHeight = window.innerHeight;
baselineWidth  = window.innerWidth;
checkInterval = setInterval(checkDevtools, 1500); // FIX: 1500ms not 1000ms — less jittery
checkDevtools();
});

// Re-check on resize, but only on desktop where this is meaningful.
// Debounced so rapid resize events (window snapping, etc.) don’t flicker.
var resizeTimer;
window.addEventListener(‘resize’, function () {
clearTimeout(resizeTimer);
resizeTimer = setTimeout(checkDevtools, 300); // wait for resize to settle
});

})();
