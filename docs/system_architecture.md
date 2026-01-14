# System Architecture

The following diagram illustrates the high-level architecture of the DOTD (Outfit of the Day) application.

```mermaid
graph TD
    User[User Browser/Mobile]

    subgraph Frontend [React Frontend]
        UI[User Interface]
    end

    subgraph Backend [Backend System]
        API[FastAPI Server]
        Services[Business Logic & Services]
        Auth[Auth & Security]
    end

    subgraph DataStorage [Data Storage]
        DB[(PostgreSQL)]
    end

    subgraph ExternalServices [External Services]
        N8N[n8n Automation]
        AI[AI Model APIs]
    end

    %% Connections
    User --> UI
    UI --> API
    API --> Services
    API --> Auth
    Services --> DB
    Services --> N8N
    Services --> AI
    N8N --> DB
```

## Key Components

1.  **Frontend (React + Vite)**: SPA handling UI and user interactions.
2.  **Backend (FastAPI)**: REST API server managing logic, auth, and integrations.
3.  **Database (PostgreSQL)**: Stores user data and creations.
4.  **n8n**: Workflow automation service.
5.  **AI Services**: External APIs for generation and analysis.