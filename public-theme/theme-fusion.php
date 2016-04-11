<?php

// Theme Fusion is the new Ludum Dare Theme Voting round. It takes place immediately
// after the Slaughter, a few days before the slaughter would have ended.

// In the round, a user is presented with high rated theme suggestions (from the slaughter).
// They pick which one they prefer of the two.

// In addition, a 3rd button is available, to flag a pairing as too similar.

// [x] Too Similar!

// Unlike the Theme Slaughter, Too Similar is a flag, not a value (i.e. -1).
// You still pick your favourite of the two.

// For clarity, after "Too Similar" is selected, do something to help them know
// they still need to pick a preference.

// Keyboard shortcuts should be Left (A), Right (B), Down (Flag). Space to confirm.
// Alternatively, Up and Down (given the layout).

// **** TIMELINE THOUGHTS (36'ish Days, was 35'ish) **** //
// Thursday* (-1) 5 Weeks Before - Theme Suggestions Open (20 days, was 21 days)
// Wednesday (-2) 2 Weeks Before - Theme Slaughter Starts (5 days, was 7 days)
// Monday    (-4) 1 Weeks Before - Theme Fusion Starts (5 days, new)
// Saturday  (+1) 1 Weeks Before - Theme Voting Starts (5 days, corrected)
// Wednesday (-2) 0 Weeks Before - Final Round Theme Voting (2 days)

// TODO: Figure out how scoring will work amongst themes given new A/B data
// Technically speaking, we're starting over. The Slaughter gives us a top 300?
// From that we're refining what remains to 80, while giving the flexibility for 
// some lower-high themes to rise up, knowing what they're up against.

// Theme Slaughter is an essential stage. It tells us what themes are above average 
// (and not awful).
