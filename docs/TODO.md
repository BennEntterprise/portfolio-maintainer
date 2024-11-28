# Todo

## High Priority Todos

[] feat: show icon for README
[] feat: show icon for License
[] feat: show icon for Size
[] feat: show icon for TODO.md
[] feat: show icon for Public/Private
[] feat: show icon for Active/Archive
[] feat: show icon for Dockerfile
[] Devops: Containerize, release to Dockerhub and mark a release as V1.

## Medium Priority Todos

[] Devops: Add husky pre-commit hooks (lint and build)
[] Feat: Save filter state in local storage (ensure it can reconcile)
[] Perf: [typed hooks for dispatch and redux state](https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks)

## Low Priority Todos

[] Show some sort of intermediate counter while the repos are loading so the user can understand that stuff is, in fact, happening in the background.
[] Refactor: The Dropdown that handles ordering should be converted to chips/radio buttons so that it is easier to see all options.
[] Feat: Use AGGrid to show all of the above items as a grid list, not just as cards.

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