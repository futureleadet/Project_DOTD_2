# Entity Relationship Diagram (ERD)

This diagram represents the data model for the DOTD application based on the PostgreSQL schema.

```mermaid
erDiagram
    users {
        int id PK
        string email UK
        string name
        string picture
        string role "DEFAULT 'MEMBER'"
        timestamp created_at
        string hashed_password
        string face_shape
        string personal_color
        int height
        string gender "DEFAULT 'female'"
        string body_type
        text[] profile_images
        string profile_image
    }

    creations {
        int id PK
        int user_id FK
        text media_url
        text media_type
        text prompt
        timestamp created_at
        boolean is_public "DEFAULT true"
        boolean is_picked_by_admin "DEFAULT false"
        int likes_count "DEFAULT 0"
        text analysis_text
        text recommendation_text
        text[] tags_array
        int height
        string body_type
        string style
        string colors
        jsonb shopping_results
        string gender
        string age_group
    }

    likes {
        int id PK
        int user_id FK
        int creation_id FK
        timestamp created_at
    }

    analysis_results {
        int id PK
        int user_id FK
        string filename
        string filelink
        jsonb result
        timestamp created_at
    }

    n8n_chat_histories {
        int id PK
        string session_id
        jsonb message
    }

    n8n_amore {
        uuid id PK
        text text
        jsonb metadata
        vector embedding
    }

    n8n_dotd {
        uuid id PK
        text text
        jsonb metadata
        vector embedding
    }

    %% Relationships
    users ||--o{ creations : "creates"
    users ||--o{ likes : "performs"
    creations ||--o{ likes : "receives"
    users ||--o{ analysis_results : "owns"
```

## Table Descriptions

*   **users**: Stores user account information, including profile details like body type, face shape, and personal color used for styling.
*   **creations**: Stores the generated OOTD images, prompts, AI analysis results, and shopping recommendations.
*   **likes**: Junction table for storing user likes on creations to support the community feed features.
*   **analysis_results**: Logs history of file analyses performed by users.
*   **n8n_chat_histories**: Stores chat session data for the chatbot feature powered by n8n.
*   **n8n_amore / n8n_dotd**: Vector stores for RAG (Retrieval-Augmented Generation) or similarity search features.
