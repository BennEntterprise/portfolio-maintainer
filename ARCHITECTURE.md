# Architecture Overview
This document serves as a critical, living template designed to equip agents with a rapid and comprehensive understanding of the codebase's architecture, enabling efficient navigation and effective contribution from day one. Update this document as the codebase evolves.

## 1. Project Structure
This section provides a high-level overview of the project's directory and file structure, categorised by architectural layer or major functional area. It is essential for quickly navigating the codebase, locating relevant files, and understanding the overall organization and separation of concerns.

```
[Project Root]/
├── electron-app/         # Electron-based desktop application (current WIP)
│   ├── src/              # Main source code for Electron app
│   │   ├── main/         # Electron main process
│   │   │   └── main.ts   # Main Electron application entry point
│   │   ├── renderer/     # React renderer process (UI)
│   │   │   ├── App.tsx   # Main React application component
│   │   │   ├── index.html # HTML template
│   │   │   └── index.tsx # React renderer entry point
│   │   ├── server/       # Express API server
│   │   │   └── api.ts    # API endpoints for the Electron app
│   │   ├── preload/      # Preload scripts for secure IPC
│   │   ├── components/   # Reusable React UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── layout/       # Layout components
│   │   ├── services/     # Service layer for GitHub API interaction
│   │   └── types/        # TypeScript type definitions
│   ├── public/           # Static assets for renderer process
│   ├── backlog/          # Task management using backlog.md
│   ├── package.json      # Electron app dependencies and scripts
│   ├── tsconfig.json     # TypeScript configuration
│   ├── vite.config.ts    # Vite bundler configuration
│   └── tailwind.config.js # Tailwind CSS configuration
├── monolith-app/         # Full-stack web application (legacy/alternative)
│   ├── backend/          # Express.js backend server
│   │   ├── src/          # Backend source code
│   │   │   └── config/   # Configuration files (environment, etc.)
│   │   ├── built-frontend/ # Built React frontend files
│   │   ├── index.ts      # Backend server entry point
│   │   ├── package.json  # Backend dependencies
│   │   └── tsconfig.json # Backend TypeScript configuration
│   └── frontend/         # React frontend application
│       ├── src/          # Frontend source code
│       │   ├── components/ # Reusable UI components
│       │   │   ├── card/ # Repository card components
│       │   │   ├── layout/ # Layout components (Header, Footer)
│       │   │   └── settings/ # Settings and configuration UI
│       │   ├── hooks/    # Custom React hooks (useGitHub)
│       │   ├── redux/    # Redux Toolkit state management
│       │   │   ├── store.ts # Redux store configuration
│       │   │   ├── repoSlice.ts # Repository state management
│       │   │   ├── searchSlice.ts # Search functionality state
│       │   │   ├── settingsSlice.ts # Settings state
│       │   │   ├── sortingSlice.ts # Sorting functionality state
│       │   │   ├── themeSlice.ts # Theme management state
│       │   │   └── middleware/ # Redux middleware
│       │   ├── utils/    # Utility functions (localStorage, etc.)
│       │   ├── types.ts  # TypeScript type definitions
│       │   └── App.tsx   # Main React application
│       ├── public/       # Static assets
│       ├── package.json  # Frontend dependencies
│       ├── vite.config.ts # Vite configuration
│       ├── tailwind.config.js # Tailwind CSS configuration
│       ├── docker-compose.yml # Docker Compose for development
│       └── Dockerfile    # Docker container definition
├── backlog/              # Global project task management
│   ├── config.yml        # Backlog configuration
│   ├── tasks/            # Active tasks
│   ├── completed/        # Completed tasks
│   ├── drafts/           # Draft tasks
│   ├── decisions/        # Architecture decisions
│   ├── docs/             # Documentation
│   └── archive/          # Archived items
├── scripts/              # Build and deployment automation scripts
│   ├── full-build.sh     # Complete build process for monolith app
│   └── setup-secrets.sh  # Environment setup script
├── docs/                 # Project documentation
│   ├── TODO.md          # Project todo list
│   └── images/          # Documentation images
├── README.md            # Project overview and quick start guide
└── ARCHITECTURE.md      # This document
```

## 2. High-Level System Diagram
The Portfolio Maintainer consists of two main applications that serve the same core functionality through different deployment models:

```
[User] <--> [Electron Desktop App] <--> [GitHub API v4]
                     |
                     v
            [Express Server :3001]
            
[User] <--> [Monolith Web App] <--> [GitHub API v4] 
                     |
            [React Frontend :5173] <--> [Express Backend :3000]
                     |                           |
            [Redux State Management]    [Static File Serving]
```

## 3. Core Components

### 3.1. Electron Desktop Application (Primary)

**Name:** Electron App (current Work In Progress)

**Description:** A cross-platform desktop application that provides a native experience for GitHub repository analysis and maintenance. Combines Electron's main process with a React-based renderer and an embedded Express API server.

**Technologies:** Electron, React 19, TypeScript, Vite, Tailwind CSS, Express.js, Octokit

**Deployment:** Local desktop application, packaged as native executables

### 3.2. Monolith Web Application (Alternative)

**Name:** Full-Stack Web Application

**Description:** A containerized web application providing the same GitHub repository analysis functionality through a browser interface. Features a React frontend with Redux state management and an Express backend that serves both API endpoints and static files.

**Technologies:** React 18, Redux Toolkit, TypeScript, Express.js, Vite, Tailwind CSS, Docker

**Deployment:** Docker containers, can be deployed locally or to cloud platforms

### 3.3. Backend Services

#### 3.3.1. Electron Express Server

**Name:** Embedded API Server

**Description:** Lightweight Express server running within the Electron main process, providing API endpoints for the renderer process to communicate with external services securely.

**Technologies:** Express.js, TypeScript

**Deployment:** Embedded within Electron application

#### 3.3.2. Monolith Backend Server

**Name:** Standalone Express Server

**Description:** Full Express.js backend that serves both API endpoints and the built React frontend as static files. Handles GitHub API integration and data processing.

**Technologies:** Express.js, TypeScript, Zod (validation)

**Deployment:** Docker container or direct Node.js deployment

## 4. Data Stores

### 4.1. Local Storage

**Name:** Browser Local Storage / Electron Store

**Type:** Client-side persistence (localStorage for web, electron-store for desktop)

**Purpose:** Stores user preferences, GitHub tokens, application settings, and cached repository data

**Key Schemas/Collections:** GitHub tokens, theme preferences, sort settings, search history

### 4.2. GitHub API Data

**Name:** GitHub REST API v4

**Type:** External API (read-only access)

**Purpose:** Source of all repository data, pull requests, commits, and file information

## 5. External Integrations / APIs

**GitHub API:** Primary data source for repository information, pull requests, and file contents

**Purpose:** Repository analysis, metadata extraction, and portfolio maintenance insights

**Integration Method:** REST API via Octokit library

**Authentication:** Personal Access Tokens stored locally

## 6. Deployment & Infrastructure

**Cloud Provider:** Local deployment only (desktop app and containerized web app)

**Key Services Used:** Docker (for monolith app), Electron packaging (for desktop app)

**CI/CD Pipeline:** Manual builds and packaging

**Monitoring & Logging:** Console logging, no external monitoring services

**Build Tools:** Vite (bundling), TypeScript (compilation), npm scripts

## 7. Security Considerations

**Authentication:** GitHub Personal Access Tokens

**Authorization:** Scope-limited GitHub tokens (repo access)

**Data Encryption:** HTTPS for GitHub API communication, local token storage

**Key Security Tools/Practices:** TypeScript for type safety, Zod for runtime validation, secure token storage

## 8. Development & Testing Environment

**Local Setup Instructions:** 
- Electron App: `cd electron-app && npm i && npm run dev`
- Monolith App: Use Docker Compose or manual setup with separate backend/frontend

**Testing Frameworks:** No formal testing framework currently implemented

**Code Quality Tools:** ESLint, TypeScript strict mode, Prettier (via lint-staged), Husky (git hooks)

## 9. Future Considerations / Roadmap

**Focus on Electron App:** The Electron application is the current work-in-progress and primary focus

**Monolith App Maintenance:** The monolith application serves as a fallback and proof-of-concept

**Potential Enhancements:**
- Automated testing implementation
- GitHub App integration for enhanced API access
- Database persistence for offline functionality
- Advanced analytics and reporting features

## 10. Project Identification

**Project Name:** Portfolio Maintainer

**Repository URL:** https://github.com/BennEntterprise/portfolio-maintainer

**Primary Contact/Team:** Kyle (BennEntterprise)

**Date of Last Update:** 2025-09-07

## 11. Glossary / Acronyms

**PAT:** Personal Access Token (GitHub authentication)

**WIP:** Work In Progress (referring to the Electron app)

**Octokit:** Official GitHub API client library

**Backlog.md:** Task management system used for project organization

**Portfolio Maintenance:** Process of keeping GitHub repositories up-to-date, documented, and well-organized
