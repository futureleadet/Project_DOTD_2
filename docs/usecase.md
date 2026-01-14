# Use Case Diagram

This diagram outlines the primary interactions users and admins have with the DOTD system.

```mermaid
usecaseDiagram
    actor "User" as U
    actor "Admin" as A
    actor "AI System" as AI

    package "User Account" {
        usecase "Sign Up / Login" as UC1
        usecase "Manage Profile\n(Face, Body, Color)" as UC2
    }

    package "Creation & Styling" {
        usecase "Generate OOTD" as UC3
        usecase "View Analysis & Insight" as UC4
        usecase "Get Shopping Recommendations" as UC5
    }

    package "Feed & Community" {
        usecase "Browse Feed" as UC6
        usecase "Search Styles" as UC7
        usecase "Like Creation" as UC8
        usecase "View Ranking/Popular" as UC9
    }

    package "Administration" {
        usecase "Manage Users" as UC10
        usecase "Pick Staff's Choice" as UC11
        usecase "Delete Creation" as UC12
    }

    %% User Interactions
    U --> UC1
    U --> UC2
    U --> UC3
    U --> UC6
    U --> UC7
    U --> UC8
    U --> UC5

    %% Admin Interactions
    A --> UC1
    A --> UC10
    A --> UC11
    A --> UC12

    %% AI System Interactions
    UC3 .> AI : "Request Image Generation"
    UC5 .> AI : "Request Product Matching"
    UC4 .> AI : "Request Style Analysis"
    
    %% Relationships
    UC3 --> UC4 : "Includes"
    UC4 --> UC5 : "Leads to"
```

## Description of Key Use Cases

*   **Generate OOTD**: Users input their style preferences or prompts. The system uses AI to generate a personalized outfit image.
*   **Manage Profile**: Users update their physical attributes (height, body type) and preferences (face shape, personal color) to improve generation accuracy.
*   **Get Shopping Recommendations**: Based on the generated look, the system suggests real-world products to buy.
*   **Browse Feed**: Users can view creations shared by others, filter by latest or popular, and search by tags.
*   **Pick Staff's Choice**: Admins can highlight specific high-quality creations to appear on the main page or top of the feed.

```