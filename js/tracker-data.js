/* =============================================================
   GreenLink Trash Tracker Data
   =============================================================
   This file is the ONLY place you need to edit to update the
   homepage "Live Trash Tracker" numbers. No HTML, CSS, or
   JavaScript changes are needed elsewhere.

   How to update:
   1. Edit the values below to match your latest cleanup numbers.
   2. Save this file.
   3. Commit and push to GitHub Pages.
   4. The homepage will update automatically.

   totalPounds    = total pounds of trash collected so far
   goalPounds     = your annual / campaign goal in pounds
   cleanupsHeld   = total number of cleanups held
   volunteerHours = total volunteer hours logged
   lastUpdated    = human-readable date for "Last updated"
   lastCleanupLocation = name of the most recent cleanup location
   ============================================================= */

const trackerData = {
  totalPounds: 0,
  goalPounds: 1,000,
  cleanupsHeld: 0,
  volunteerHours: 0,
  lastUpdated: "July 22, 2026",
  lastCleanupLocation: "N/A"
};

// Expose to the global window object so the rest of the site can read it.
window.trackerData = trackerData;
