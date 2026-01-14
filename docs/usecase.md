# Use Case Diagram

This diagram outlines the primary interactions users and admins have with the DOTD system.

```mermaid
usecaseDiagram
    actor User
    actor Admin
    actor AI_System

    User --> (Login)
    User --> (Manage Profile)
    User --> (Generate OOTD)
    User --> (Browse Feed)
    User --> (Like Creation)
    User --> (Shopping)

    Admin --> (Login)
    Admin --> (Manage Users)
    Admin --> (Pick Staff Choice)
    Admin --> (Delete Content)

    AI_System --> (Generate OOTD)
    AI_System --> (Style Analysis)
    AI_System --> (Product Matching)
```

## Description

*   **User**: Can perform core actions like generating outfits, managing their profile, and interacting with the community feed.
*   **Admin**: Responsible for system maintenance, user management, and content moderation.
*   **AI System**: Represents the automated processes for image generation, style insights, and shopping product matching.