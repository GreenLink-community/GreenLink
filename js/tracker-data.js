/* =============================================================
   GreenLink Trash Tracker Data
   =============================================================
   This file is the ONLY place you need to edit to update the
   homepage "Live Trash Tracker" numbers. No HTML, CSS, or
   JavaScript changes are needed elsewhere.

   How to update:
   1. Edit the values below to match your latest cleanup numbers.
   2. Save this file.
   3. Commit and push to GitHub Pages (or your host).
   4. The homepage will update automatically.

   totalPounds    = total pounds of trash collected so far
   goalPounds     = your annual / campaign goal in pounds
   cleanupsHeld   = total number of cleanups held
   volunteerHours = total volunteer hours logged
   lastUpdated    = human-readable date for "Last updated"
   lastCleanupLocation = name of the most recent cleanup location
   ============================================================= */

const trackerData = {
  totalPounds: 1240,
  goalPounds: 5000,
  cleanupsHeld: 14,
  volunteerHours: 860,
  lastUpdated: "July 18, 2026",
  lastCleanupLocation: "Willow Creek Park"
};

// Expose to the global window object so the rest of the site can read it.
window.trackerData = trackerData;
