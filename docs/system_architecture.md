# System Architecture

The following diagram illustrates the high-level architecture of the DOTD (Outfit of the Day) application.

```mermaid
graph TD
    %% Clients
    User[User (Browser/Mobile)]

    %% Frontend
    subgraph Frontend [React Frontend]
        UI[User Interface]
    end

    %% Backend System
    subgraph Backend [Backend System]
        API[FastAPI Server]
        Services[Business Logic & Services]
        Auth[Auth & Security]
    end

    %% Data Storage
    subgraph DataStorage [Data Storage]
        DB[(PostgreSQL\npgvector)]
    end

    %% External/Sidecar Services
    subgraph External [External/Support Services]
        N8N[n8n Automation]
        AI[AI Model APIs]
    end

    %% Connections
    User -->|HTTPS| UI
    UI -->|REST API| API
    API -->|Validation/Routing| Services
    API -->|Auth Check| Auth
    Services -->|Query/Transaction| DB
    Services -->|Trigger Workflow| N8N
    Services -->|Generate Image/Text| AI
    N8N -->|Process Data| DB

    %% Descriptions
    classDef client fill:#f9f,stroke:#333,stroke-width:2px;
    classDef frontend fill:#d4f1f4,stroke:#333,stroke-width:2px;
    classDef backend fill:#e0e0e0,stroke:#333,stroke-width:2px;
    classDef db fill:#ffebbb,stroke:#333,stroke-width:2px;
    classDef external fill:#d1ffbd,stroke:#333,stroke-width:2px;

    class User client;
    class UI frontend;
    class API,Services,Auth backend;
    class DB db;
    class N8N,AI external;
```

## Key Components

1.  **Frontend (React + Vite)**
    *   Single Page Application (SPA) serving the user interface.
    *   Handles user interactions, profile management, and creation requests.

2.  **Backend (FastAPI)**
    *   RESTful API server.
    *   Manages user authentication (JWT/OAuth).
    *   Orchestrates image generation and shopping recommendations.
    *   Serves static files (if applicable).

3.  **Database (PostgreSQL)**
    *   Stores user data, profile information, and creations.
    *   Utilizes `pgvector` for potential vector similarity search (recommendations).

4.  **n8n (Workflow Automation)**
    *   Handles background workflows, potentially for complex data processing or integrations.

5.  **AI Services**
    *   External APIs for Image Generation and Text Analysis (LLM).
