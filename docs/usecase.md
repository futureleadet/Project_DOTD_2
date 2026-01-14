# Use Case Diagram

This diagram outlines the primary interactions users and admins have with the DOTD system.

```mermaid
usecaseDiagram
    actor User
    actor Admin
    actor AI as "AI System"

    rectangle "DOTD System" {
        usecase "Sign Up / Login" as UC1
        usecase "Manage Profile" as UC2
        usecase "Generate OOTD" as UC3
        usecase "View Insight" as UC4
        usecase "Get Shopping Info" as UC5
        usecase "Browse Feed" as UC6
        usecase "Search Styles" as UC7
        usecase "Like Creation" as UC8
        usecase "Manage Users" as UC10
        usecase "Pick Staff Choice" as UC11
        usecase "Delete Content" as UC12
    }

    %% User Interactions
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC5

    %% Admin Interactions
    Admin --> UC1
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12

    %% AI Interactions (Dependency)
    UC3 ..> AI
    UC5 ..> AI
    UC4 ..> AI
```

## Description

*   **User**: Can generate outfits, manage profile, browse feed, and shop.
*   **Admin**: Has full access, including user management and content moderation.
*   **AI System**: Background actor that performs image generation and text analysis.
