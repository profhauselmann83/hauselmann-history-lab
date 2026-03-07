/**
 * HIST 102 — Week Access Guard
 * Add to every content page in a week:
 *   <script src="../access-guard.js" data-week="w1" data-gate="gate.html"></script>
 *
 * Reads data-week and data-gate attributes from its own script tag so the
 * same file works for all weeks — just change the attributes per page.
 *
 * If the student has not passed the gate for this week (or the token has
 * expired), they are immediately redirected to the gate page.
 */

(function () {
  'use strict';

  var ACCESS_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

  // Find this script's own tag to read data attributes
  var scripts  = document.getElementsByTagName('script');
  var thisScript = scripts[scripts.length - 1];
  var weekId   = thisScript.getAttribute('data-week') || 'w1';
  var gatePage = thisScript.getAttribute('data-gate') || 'gate.html';

  function checkAccess() {
    try {
      var stored = localStorage.getItem('hist102_access_' + weekId);
      if (!stored) return false;
      var data = JSON.parse(stored);
      if (!data.granted) return false;
      if ((Date.now() - data.timestamp) >= ACCESS_EXPIRY) {
        // Expired — clear it
        localStorage.removeItem('hist102_access_' + weekId);
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  if (!checkAccess()) {
    // Hide content immediately to prevent flash before redirect
    document.documentElement.style.visibility = 'hidden';
    window.location.replace(gatePage);
  }

})();
