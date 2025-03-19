#!/bin/bash

# First build the backend
(cd monolith-app/backend && npm run build)

# Then build the frontend
(cd monolith-app/frontend && npm run build)

# Then Inject the frontend into the backend
(mv monolith-app/frontend/dist monolith-app/backend/built-frontend)