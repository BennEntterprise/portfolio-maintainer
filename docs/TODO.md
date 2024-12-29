# Todo

# Uncategorized


## High Priority Todos

[] Look into the count of checks,x and ?s. Seems to be off...., Test with a smaller repo set so that there is a tighter iteration loop in my dev cycle
[] feat: MVP A settings tab where you can make different adjustments
[] feat: light/dark mode in settings. (Toggle Switch Sun/Moon)
[] Clean up the header. The settings icon should be over near the right, where a user avatar will eventually live.


## Medium Priority Todos

[] Perf: [typed hooks for dispatch and redux state](https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks)
[] Devops: Add husky pre-commit hooks (lint and build)
[] Perf: Speed up the re-render on sorting/filter change. (Right now its several seconds because we RE-FEtch the repo tree multiple times.)
[] Devops: Containerize, release to Dockerhub and mark a release as V1
[] Show Branch number in the card, sort by branch count (requires hitting a separate URL and caching to be mindful of rate limits returning 429)

## Low Priority Todos

[] Show some sort of intermediate counter while the repos are loading so the user can understand that stuff is, in fact, happening in the background.
[] Refactor: The Dropdown that handles ordering should be converted to chips/radio buttons so that it is easier to see all options.
[] Feat: Use AGGrid to show all of the above items as a grid list, not just as cards.
[] Use the Repo.language value to display on the card info.
[] Implement [stack-analyser](https://github.com/specfy/stack-analyser?tab=readme-ov-file)

# Done

[x] 2024-11-10 T 18:00:58 Set a minimum height for the card
[x] 2024-11-10 T 19:55:30 Fix: Each card should be the same size.
[x] 2024-11-10 T 19:55:52 Fix: The "last updated" should stick to the bottom of the card.
[x] 2024-11-10 T 20:11:35 Feat: Add an icon to show if a card has a README.md
[x] 2024-11-10 T 20:15:20 Feat: Add License Value
[x] 2024-11-10 T 20:18:50 Feat: A "size" as a repo property and include it in the card.
[x] 2024-11-10 T 20:21:19 Feat: Add an icon to indicate if there is a /docs/Todo.md file (case insensitive)
[x] 2024-11-10 T 20:23:15 Feat: Add icon to the card for private vs not private, (might need the designation "private" or   "visibility": "private")
[x] Feat: Add an icon for Dockerfile
[x] Feat: Add an icon for devcontainers
[x] Feat: Redux so that there is only one call. Trigger the fetch repos call on button press.
[x] 2024-11-26 T 20:50:13 Feat:Checkboxes to handle filtering. (archive/non-archive, organization)
[x] 2024-11-27 Feat: Ensure pagination works and I can get all repos. (right now tops out at 100.)
[x] 2024-11-28 T 11:51:08 feat: show icon for README
[x] 2024-11-28 T 11:51:08 feat: show icon for License
[x] 2024-11-28 T 11:51:08 feat: show icon for Size
[x] 2024-11-28 T 11:51:08 feat: show icon for TODO.md
[x] 2024-11-28 T 11:51:08 feat: show icon for Dockerfile
[x] 2024-11-29 T 19:14:57 feat: show icon for Public/Private
[x] 2024-11-29 T 19:24:42 feat: show icon for Active/Archive
[x] 2024-11-29 T 19:25:56 feat: pagination
[x] 2024-12-02 Feat: Save filter state in local storage (ensure it can reconcile)****
[x] 2024-12-04 T 17:13:07 Perf: Reduce calls to check for files (do it on one call to the repo instead of 3) {I was able to shave off a few seconds, but the biggest culprit was the call to get pull requests. And I don't have that on the repo object so it needs to stay. 🥲.}