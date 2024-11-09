# Portfolio Maintainer

This repo will help me constantly keep my Github portfolio up-to-date. It is intended to be a locally-run react app, which helps identify things like

- What is the "least touched" project?
- Are there any projects missing a README? 

It is meant to be a tool for a user (in this case me) to bring their own Github Keys, spin up a Docker project and answer the question "what should I work on today?"


A React application to browse and analyze your GitHub repositories with advanced sorting and searching capabilities.

## Features

- Sort repositories by:
  - Number of open Pull Requests
  - Last updated timestamp
  - Star count
- Search repositories by:
  - Repository name
  - Repository description
  - README content
- Containerized with Docker for easy deployment

## Setup

1. Create a GitHub Personal Access Token with repo scope
2. Copy `.env.example` to `.env` and add your token:
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   ```

3. Build and run with Docker Compose:
   ```bash
   docker compose up --build
   ```

4. Open http://localhost:5173 in your browser

## Development

To run locally without Docker:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Security Note

This application is intended for local use only. The GitHub token is stored in an `.env` file and used within the Docker container.