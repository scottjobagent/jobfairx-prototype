# JobFairX Employer Dashboard — Change Log

**Started: Tuesday, April 22, 2026 at 6:42 PM**

1. Fixed post-event report "View resume" — moved resume modal to page root so it works from dashboard/report view
2. Updated lobby prepare section: disabled states for Review candidates (0 candidates) and Add interviewers (seats full), replaced welcome message with custom messaging modal
3. Renamed button to "Edit custom message", updated subtext to explain auto-send behavior, added "Prepare section: Has items / Empty" dev toggle
4. Renamed three-dot menu "Interview settings" → "Add interviewers"
5. Added "Schedule follow-up interview" + "Send a message" buttons to event-ended Interviewed tab resume modal
6. Moved Prepare section dev toggle to top header bar with other toggles
7. Fixed Start Interview buttons in live Waiting to Interview tab (restored missing onclick + function)
8. Added hover tooltips to resume modal buttons (Download, Accept, Decline, Reschedule)
9. Removed unnecessary tooltip from Start Interview button
10. Standardized all button tooltips for consistency across lobby-v3 (Accept, Decline, Reschedule, Cancel, Rejoin, End, Download)
11. Standardized primary button hover color (#003399) and font-weight (700) across all primary buttons
12. Fixed all 8 Cancel buttons in the active state — they now call `declineInterview(this)` like their live-state counterparts
13. Sign Out now navigates to `login.html`
14. New `login.html` page with email field, Continue button, and SSO link
15. Removed orphaned Welcome modal (CSS, HTML, and JS) — replaced by Custom Messaging modal
16. Standardized all modal overlay opacity to 0.5 (was a mix of 0.45/0.55)
17. Standardized modal border-radius to 14px (except resume modal, intentionally different)
18. Standardized close button shape to 32x32px, border-radius 6px (was 50% circles)
19. Standardized modal title font-weight to 700 (was 800)
20. Reduced feedback modal from 5 options to 3 (Amazing, Good, Poor) — removed Okay and Terrible
21. Updated feedback modal to 3 options across all v3 files (lobby, visual, edit-post, setup-flow)
22. Built interview-screen-v3.html — full interview video call experience (dark UI, toolbar, Notes/Chat/Resume panels, End call flow)
23. Redesigned interview-screen-v3.html to match Indeed's light design (no logo, no dark theme, floating UI, white toolbar)
24. Removed add-participant icon from interview screen
25. Fixed side panel exclusivity — moved panels to iv-video-area
26. Removed orange progress bar from interview screen
27. Removed More, Record, Share screen from toolbar
28. Restyled toolbar buttons to match Indeed (rounded rect with icon | divider | up-caret)
29. Fixed panel logic — switched from transform to display none/flex
30. Added "Scott (You)" floating name tag bottom-left with muted mic icon
31. Added thumbs-down feedback form (6 checkboxes, comments textarea, Skip/Submit)
32. Fixed redirect to live view after interview ends (mode=live&tab=waiting)
33. Added "recommend moving forward" modal to end-call flow (Yes/Maybe/No toggle + notes)
34. Wired Rejoin buttons in Interviewing tab to open interview-screen-v3.html
35. Added "End event for all interviewers" to three-dot menu (live states only)
36. Fixed menu width and text wrapping for end-event menu item
37. Set end-event menu item font-weight to 500
38. Built end-event confirmation modal (CSS + HTML — warning banner, message textarea, red buttons)
39. Wired end-event modal JS — open, close, confirm, overlay dismiss, Escape key
40. Redesigned toast notifications to Indeed-style top-right pattern (green success, red error)
41. Fixed toast background colors to match Indeed design
42. Wired Accept/Decline buttons in Not Yet Interviewed tab
43. Built context-aware decline/cancel modal for upcoming vs pending interviews
44. Changed decline/cancel toast to green Success style
45. Moved Event Credits from sidebar to top-right user dropdown across all v3 pages
46. Simplified Event Credits dropdown item — removed inline count
47. Removed Event Credits from sidebar nav on all v3 pages
48. Fixed v3 navigation — Event Credits href="#", account-billing links to visual-v3
49. Built Event Credits modal with Use Credit → Register flow on all v3 pages
50. Redesigned Event Credits modal — only show tiers with credits, added Buy Credits + empty state
51. Added Register Confirmation modal — shows event details + credit usage before registering
52. Added Escape key support for Register Confirmation modal
53. Built "You're registered!" success modal — green checkmark, event name/date, Go to dashboard + Post a job buttons
54. Post a job button navigates to setup-flow-v3.html (same as Complete Setup flow)
55. Updated end call flow — selecting "No" (not finished interviewing) skips candidate rating/notes, goes straight to call quality feedback, then back to lobby
56. Fixed Interviewed live empty tab — removed extra min-height causing inconsistent gray background vs other tabs
57. Hide disabled Prepare buttons (View candidates, Add interviewers) instead of showing grayed out — buttons appear when actionable
58. Fixed Not yet interviewed tab count to show (0) in live empty state instead of (26)
59. Fixed Not yet interviewed active state counts — section headers from (18) to (8) matching actual rows, tab label shows (16) in active mode
60. Built Purchase Credits modal — three-card tier selector (Starter $495, Growth $895, Pro $1,495) with quantity controls, dynamic totals, and Purchase button across all v3 pages
61. Added Starter tier volume/bundle pricing — qty steps (1–4 individual, then 5/10/15/25/40/50/75/100 bundles) with per-event discounts, green savings banner at 5+ events, per-event price display (lobby-v3 only)
62. Redesigned pricing hierarchy — dynamic hero price updates live with qty, de-bolded total (16px/500) and qty value (500), removed redundant per-event line
63. Added Growth tier volume/bundle pricing — same step pattern as Starter, dynamic hero price, green savings banner at 5+ events (lobby-v3 only)
64. Added Pro tier volume/bundle pricing — all three tiers now use bundle steps, refactored JS to shared lookup pattern (lobby-v3 only)
65. Removed "Need more than 4? See bundles" footer from Purchase Credits modal (lobby-v3)
66. Synced volume/bundle pricing to all v3 pages — visual-v3, edit-post-v3, setup-flow-v3 now match lobby-v3 (dynamic hero prices, bundle steps, savings banners, de-bolded total/qty, no footer)
67. Added strikethrough original price on all v3 pages — gray crossed-out base price appears above hero price at 5+ events, hidden at 1–4
68. Added Credits dev toggle to lobby-v3 header — switches Event Credits modal between "Has credits" and "Empty" states
69. Fixed dropdown staying open behind Event Credits modal — added event.stopPropagation() on all v3 pages
70. Fixed dead +/- qty buttons in Purchase Credits modal on edit-post-v3 and setup-flow-v3 — added missing event.stopPropagation()
71. Fixed modal jump when savings banner appears — switched from display:none to visibility:hidden so space is always reserved (all v3 pages)
72. Added "Your credits never expire" with shield icon to Purchase Credits modal footer (all v3 pages)
73. Fixed end-event toast color from red (error) to green (success) in lobby-v3
74. Standardized toast notifications across all v3 pages — replaced old dark gray bottom-center pill toasts with Indeed-style top-right green/red toast system (visual-v3, edit-post-v3, setup-flow-v3 now match lobby-v3)
75. Redesigned end-event modal — updated title to "leave the event early", softened warning copy, removed message-to-candidates textarea, added follow-up interviews nudge, updated button labels
76. Added Message button (primary) to resume modal in Waiting to Interview live tab — was download-only
77. Removed italic from "No, stay in the event" button to match standard button styling; updated follow-up text to reference "past events report" instead of "dashboard"
78. Fixed Waiting to Interview resume modal — removed spacer so Message and Download buttons sit together instead of spread apart
79. Added "Schedule follow-up interview" + "Send a message" buttons to Interviewed live tab resume modal — was download-only
80. Added "Actions" column header to Interviewed live tab table (above three-dot menu)
81. Added "Action" column header to Waiting to Interview live tab Interview rooms table (above Start interview buttons)
82. Standardized all table column headers to "Action" (singular) across all tabs — was a mix of "Action" and "Actions"
83. Fixed registration confirmation modal pluralization — "credit" when count is 1, "credits" when more than 1 (visual-v3)
84. Redesigned Interviews Upcoming tab (visual-v3) — replaced flat table with lobby-style collapsible section "Candidates with upcoming interviews", updated columns to Name/Desired job/Desired location/Interview time/Action, added time ranges with timezone, matched lobby candidate data and Reschedule/Cancel buttons for both Active and Live states
85. Redesigned Interviews Pending tab (visual-v3) — replaced "18 pending interview requests / Needs review" with lobby-style collapsible section "Candidates awaiting your response (8)" with red alert icon, updated columns to match lobby (Name/Desired job/Desired location/Requested time/Action), blue filled Accept button, time ranges with timezone, matched lobby candidate data
86. Redesigned Interviews Past tab (visual-v3) — replaced "5 past interviews" with lobby-style collapsible section "Interviewed candidates (5)" with clipboard icon, updated columns to Name/Desired job/Desired location/Interviews/Feedback/Interviewer/Notes/Action, added interview time groups with labels for multi-interview candidates, Notes modal with save, three-dot menu with Schedule follow-up and Send a Message, matched lobby candidate data
87. Removed expand/collapse from all Interviews tab sections (visual-v3) — removed chevron icons, onclick handlers, and pointer cursor from Upcoming (Active + Live), Pending, and Past section headers so they display as static, non-collapsible panels
88. Moved Interviews tab state toggle to top header bar (visual-v3) — replaced per-section inline toggles with single "State:" toggle in header that adapts to active sub-tab (shows Live button for Upcoming, hides it for Pending/Past), auto-shows when Interviews nav is active, syncs state when switching sub-tabs
89. Fixed live banner visibility on Interviews tab (visual-v3) — banner now shows in live mode regardless of event filter selection, displays generic "Your event is happening now" when All hiring events is selected
90. Replaced Reschedule/Cancel with "Go to Lobby" buttons in Interviews Upcoming live state (visual-v3) — all 6 candidate rows now show primary blue "Go to Lobby" button linking to lobby-v3.html
91. Keep Live button visible in Interviews header toggle for all sub-tabs (visual-v3) — Live option no longer hides when switching to Pending or Past
