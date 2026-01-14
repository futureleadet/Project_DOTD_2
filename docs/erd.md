# Entity Relationship Diagram (ERD)

This diagram represents the data model for the DOTD application based on the PostgreSQL schema.

```mermaid
erDiagram
    users {
        int id PK
        string email UK
        string name
        string picture
        string role
        timestamp created_at
        string hashed_password
        string face_shape
        string personal_color
        int height
        string gender
        string body_type
        string profile_images_array
        string profile_image
    }

    creations {
        int id PK
        int user_id FK
        text media_url
        text media_type
        text prompt
        timestamp created_at
        boolean is_public
        boolean is_picked_by_admin
        int likes_count
        text analysis_text
        text recommendation_text
        string tags_array
        int height
        string body_type
        string style
        string colors
        string shopping_results_json
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
        string result_json
        timestamp created_at
    }

    n8n_chat_histories {
        int id PK
        string session_id
        string message_json
    }

    n8n_amore {
        uuid id PK
        text text
        string metadata_json
        string embedding_vector
    }

    n8n_dotd {
        uuid id PK
        text text
        string metadata_json
        string embedding_vector
    }

    %% Relationships
    users ||--o{ creations : creates
    users ||--o{ likes : performs
    creations ||--o{ likes : receives
    users ||--o{ analysis_results : owns
```

## Table Descriptions

*   **users**: Stores user account information.
*   **creations**: Stores the generated OOTD images and metadata.
*   **likes**: Stores user likes on creations.
*   **analysis_results**: Logs analysis history.
*   **n8n_chat_histories**: Stores chat session data.
*   **n8n_amore / n8n_dotd**: Vector stores.