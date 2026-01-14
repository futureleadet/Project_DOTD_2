# Use Case Diagram (Flowchart Style)

This diagram outlines the primary interactions users and admins have with the DOTD system, represented using a flowchart for maximum compatibility.

```mermaid
graph TD
    %% Actors
    User((User))
    Admin((Admin))
    AI((AI System))

    %% System Boundary
    subgraph DOTD_System [DOTD Service Functionality]
        direction TB
        Login[Sign Up / Login]
        Profile[Manage Profile]
        Gen[Generate OOTD]
        Feed[Browse Feed]
        Like[Like Creation]
        Shop[Shopping Info]
        
        MngUser[Manage Users]
        Pick[Staff Choice]
        Del[Delete Content]
        
        Analysis[Style Analysis]
        Product[Product Matching]
    end

    %% User Relationships
    User --> Login
    User --> Profile
    User --> Gen
    User --> Feed
    User --> Like
    User --> Shop

    %% Admin Relationships
    Admin --> Login
    Admin --> MngUser
    Admin --> Pick
    Admin --> Del

    %% AI Relationships
    Gen -.-> AI
    Analysis -.-> AI
    Product -.-> AI

    %% Internal Dependencies
    Gen --> Analysis
    Shop --> Product
    
    %% Styles
    classDef actor fill:#f9f,stroke:#333,stroke-width:2px;
    classDef usecase fill:#fff,stroke:#333,stroke-width:1px,rx:10,ry:10;
    class User,Admin,AI actor;
    class Login,Profile,Gen,Feed,Like,Shop,MngUser,Pick,Del,Analysis,Product usecase;
```

## Description

*   **User**: Can perform core actions like generating outfits, managing their profile, and interacting with the community feed.
*   **Admin**: Responsible for system maintenance, user management, and content moderation.
*   **AI System**: Represents the automated processes for image generation, style insights, and shopping product matching.
