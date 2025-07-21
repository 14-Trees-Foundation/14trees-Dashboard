# CSR System Flow Diagrams

## Overview

This document provides visual representations of the CSR system flows, data interactions, and user journeys to help the technical review team understand the system architecture and behavior.

## 1. System Architecture Flow

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React App] --> B[CSR Router]
        B --> C[CSR Dashboard]
        C --> D[Component Layer]
    end
    
    subgraph "Component Layer"
        D --> E[CSRPage Container]
        E --> F[CSRHeader]
        E --> G[CSRGiftTrees]
        E --> H[CSRGiftRequests]
        E --> I[CSRDonations]
        E --> J[CSRSettings]
    end
    
    subgraph "State Management"
        K[Redux Store]
        L[Groups State]
        M[GiftCards State]
        N[Donations State]
        O[Trees State]
        K --> L
        K --> M
        K --> N
        K --> O
    end
    
    subgraph "Service Layer"
        P[API Client]
        Q[Auth Service]
        R[Payment Service]
        S[File Upload Service]
    end
    
    subgraph "External Services"
        T[Backend API]
        U[Razorpay Gateway]
        V[AWS S3]
        W[Authentication Server]
    end
    
    D --> K
    D --> P
    P --> Q
    P --> R
    P --> S
    Q --> W
    R --> U
    S --> V
    P --> T
    
    style A fill:#e1f5fe
    style K fill:#f3e5f5
    style P fill:#e8f5e8
    style T fill:#fff3e0
```

## 2. User Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth Service
    participant B as Backend API
    participant R as Redux Store
    
    U->>F: Access CSR Dashboard
    F->>F: Check localStorage for token
    
    alt Token exists
        F->>A: Validate token
        A->>B: Verify token with backend
        B-->>A: Token valid/invalid
        
        alt Token valid
            A-->>F: Authentication success
            F->>R: Set user state
            F->>U: Show dashboard
        else Token invalid
            A-->>F: Authentication failed
            F->>F: Clear localStorage
            F->>U: Redirect to login
        end
    else No token
        F->>U: Redirect to login
    end
    
    Note over U,R: For CSR access, additional role check is performed
    F->>B: Check user roles
    B-->>F: Return user roles
    F->>F: Verify CSR access permissions
    
    alt Has CSR access
        F->>U: Show CSR dashboard
    else No CSR access
        F->>U: Show access denied
    end
```

## 3. Data Loading Flow

```mermaid
sequenceDiagram
    participant C as Component
    participant R as Redux Store
    participant A as API Client
    participant B as Backend
    
    C->>R: Dispatch action (e.g., getGroups)
    R->>R: Set loading state
    R->>A: Call API method
    A->>B: HTTP Request
    
    alt Success Response
        B-->>A: Data response
        A->>A: Transform data
        A-->>R: Return processed data
        R->>R: Update state with data
        R->>R: Set loading false
        R-->>C: State change notification
        C->>C: Re-render with new data
    else Error Response
        B-->>A: Error response
        A->>A: Process error
        A-->>R: Return error
        R->>R: Set error state
        R->>R: Set loading false
        R-->>C: State change notification
        C->>C: Show error UI
    end
```

## 4. Gift Tree Workflow

```mermaid
flowchart TD
    A[User accesses Green Tribute Wall] --> B[Load available trees]
    B --> C{Filter selection}
    
    C -->|All Trees| D[Display all trees]
    C -->|Gifted Trees| E[Display gifted trees only]
    C -->|Available Trees| F[Display available trees only]
    
    D --> G[User selects tree]
    E --> G
    F --> G
    
    G --> H{Gift type selection}
    
    H -->|Individual Gift| I[Open gift dialog]
    H -->|Bulk Gift| J[Open bulk gift dialog]
    
    I --> K[Enter recipient details]
    K --> L[Validate form data]
    L --> M{Validation passed?}
    
    M -->|Yes| N[Submit gift request]
    M -->|No| K
    
    J --> O[Choose bulk method]
    O --> P{Method selection}
    
    P -->|CSV Upload| Q[Upload CSV file]
    P -->|Manual Entry| R[Add recipients manually]
    
    Q --> S[Validate CSV data]
    R --> S
    S --> T{Data valid?}
    
    T -->|Yes| U[Process bulk gifts]
    T -->|No| V[Show validation errors]
    V --> O
    
    N --> W[API call to backend]
    U --> W
    W --> X{API success?}
    
    X -->|Yes| Y[Update tree status]
    X -->|No| Z[Show error message]
    
    Y --> AA[Refresh tree display]
    Z --> AB[Allow retry]
    AB --> G
    
    style A fill:#e3f2fd
    style Y fill:#e8f5e8
    style Z fill:#ffebee
```

## 5. Purchase Request Flow

```mermaid
flowchart TD
    A[User clicks 'Purchase Trees'] --> B[Open purchase form]
    B --> C[Step 1: Select tree count]
    C --> D[Validate tree count]
    D --> E{Count valid?}
    
    E -->|No| F[Show validation error]
    F --> C
    E -->|Yes| G[Step 2: Review summary]
    
    G --> H[Display order details]
    H --> I[User confirms order]
    I --> J[Step 3: Payment]
    
    J --> K{Payment method}
    
    K -->|Online Payment| L[Initialize Razorpay]
    K -->|Manual Payment| M[Show upload form]
    
    L --> N[User completes payment]
    N --> O{Payment successful?}
    
    O -->|Yes| P[Verify payment with backend]
    O -->|No| Q[Show payment error]
    Q --> J
    
    M --> R[Upload payment proof]
    R --> S[Validate file]
    S --> T{File valid?}
    
    T -->|No| U[Show file error]
    U --> R
    T -->|Yes| V[Upload to S3]
    
    P --> W[Create purchase request]
    V --> W
    W --> X{Request created?}
    
    X -->|Yes| Y[Show success message]
    X -->|No| Z[Show error message]
    
    Y --> AA[Close form]
    Y --> BB[Refresh requests table]
    Z --> CC[Allow retry]
    CC --> J
    
    style A fill:#e3f2fd
    style Y fill:#e8f5e8
    style Z fill:#ffebee
    style Q fill:#fff3e0
```

## 6. Donation Management Flow

```mermaid
flowchart TD
    A[User accesses Donations tab] --> B[Load donation analytics]
    B --> C[Display donation metrics]
    C --> D[Load donations table]
    
    D --> E{User action}
    
    E -->|Create Donation| F[Open donation form]
    E -->|Bulk Assignment| G[Open bulk assignment dialog]
    E -->|Process Payment| H[Open payment dialog]
    
    F --> I[Enter donation details]
    I --> J[Calculate tree count]
    J --> K[Submit donation]
    K --> L{Donation created?}
    
    L -->|Yes| M[Process payment]
    L -->|No| N[Show error]
    N --> I
    
    G --> O[Choose assignment method]
    O --> P{Method selection}
    
    P -->|CSV Upload| Q[Upload recipient CSV]
    P -->|Manual Entry| R[Add recipients manually]
    
    Q --> S[Validate recipient data]
    R --> S
    S --> T{Data valid?}
    
    T -->|No| U[Show validation errors]
    U --> O
    T -->|Yes| V[Process assignments]
    
    V --> W[Generate recipient emails]
    W --> X[Assign trees to recipients]
    X --> Y{Assignment successful?}
    
    Y -->|Yes| Z[Send notifications]
    Y -->|No| AA[Show assignment errors]
    
    H --> BB[Initialize payment gateway]
    BB --> CC[Process payment]
    CC --> DD{Payment successful?}
    
    DD -->|Yes| EE[Update donation status]
    DD -->|No| FF[Show payment error]
    
    M --> BB
    Z --> GG[Refresh donations data]
    EE --> GG
    AA --> HH[Allow retry]
    FF --> HH
    HH --> E
    
    style A fill:#e3f2fd
    style Z fill:#e8f5e8
    style EE fill:#e8f5e8
    style AA fill:#ffebee
    style FF fill:#ffebee
```

## 7. Settings Management Flow

```mermaid
flowchart TD
    A[User accesses Settings] --> B[Load organization data]
    B --> C[Display organization profile]
    C --> D[Load onboarded users]
    D --> E[Display users table]
    
    E --> F{User action}
    
    F -->|Edit Organization| G[Open edit dialog]
    F -->|Add User| H[Open share dialog]
    F -->|Remove User| I[Show confirmation dialog]
    
    G --> J[Edit organization details]
    J --> K{Logo upload?}
    
    K -->|Yes| L[Upload logo to S3]
    K -->|No| M[Skip logo upload]
    
    L --> N[Get S3 URL]
    N --> M
    M --> O[Update organization]
    O --> P{Update successful?}
    
    P -->|Yes| Q[Refresh organization data]
    P -->|No| R[Show error message]
    R --> J
    
    H --> S[Enter user details]
    S --> T[Generate access link]
    T --> U[Add user to view]
    U --> V{User added?}
    
    V -->|Yes| W[Send invitation]
    V -->|No| X[Show error]
    X --> S
    
    I --> Y[Confirm user removal]
    Y --> Z{Confirmed?}
    
    Z -->|Yes| AA[Remove user from view]
    Z -->|No| BB[Cancel removal]
    
    AA --> CC{Removal successful?}
    CC -->|Yes| DD[Refresh users list]
    CC -->|No| EE[Show error]
    
    Q --> FF[Close dialog]
    W --> GG[Refresh users list]
    DD --> GG
    BB --> E
    EE --> E
    
    style A fill:#e3f2fd
    style Q fill:#e8f5e8
    style W fill:#e8f5e8
    style DD fill:#e8f5e8
    style R fill:#ffebee
    style X fill:#ffebee
    style EE fill:#ffebee
```

## 8. Error Handling Flow

```mermaid
flowchart TD
    A[User Action] --> B[Component Method]
    B --> C[API Call]
    C --> D{Network Available?}
    
    D -->|No| E[Network Error]
    D -->|Yes| F[Send Request]
    
    F --> G{Response Status}
    
    G -->|200-299| H[Success Response]
    G -->|400-499| I[Client Error]
    G -->|500-599| J[Server Error]
    G -->|Timeout| K[Timeout Error]
    
    E --> L[Show Network Error Toast]
    I --> M{Error Type}
    J --> N[Show Server Error Toast]
    K --> O[Show Timeout Error Toast]
    
    M -->|401| P[Authentication Error]
    M -->|403| Q[Authorization Error]
    M -->|404| R[Not Found Error]
    M -->|422| S[Validation Error]
    M -->|Other| T[Generic Client Error]
    
    P --> U[Clear Auth Token]
    U --> V[Redirect to Login]
    
    Q --> W[Show Access Denied]
    R --> X[Show Not Found Message]
    S --> Y[Show Validation Errors]
    T --> Z[Show Generic Error]
    
    H --> AA[Update UI State]
    L --> BB[Enable Retry Option]
    N --> BB
    O --> BB
    W --> BB
    X --> BB
    Y --> BB
    Z --> BB
    
    BB --> CC{User Retries?}
    CC -->|Yes| B
    CC -->|No| DD[End Flow]
    
    AA --> DD
    V --> DD
    
    style H fill:#e8f5e8
    style E fill:#ffebee
    style I fill:#fff3e0
    style J fill:#ffebee
    style K fill:#fff3e0
    style P fill:#ffcdd2
```

## 9. State Management Flow

```mermaid
flowchart TD
    A[Component Mount] --> B[useEffect Hook]
    B --> C[Dispatch Action]
    C --> D[Action Creator]
    D --> E{Async Action?}
    
    E -->|Yes| F[Thunk Middleware]
    E -->|No| G[Reducer]
    
    F --> H[API Call]
    H --> I{API Success?}
    
    I -->|Yes| J[Dispatch Success Action]
    I -->|No| K[Dispatch Error Action]
    
    J --> G
    K --> G
    
    G --> L[Update State]
    L --> M[State Change]
    M --> N[Component Re-render]
    
    N --> O{State Dependencies Changed?}
    O -->|Yes| P[useEffect Triggered]
    O -->|No| Q[Render Complete]
    
    P --> R{Cleanup Needed?}
    R -->|Yes| S[Cleanup Function]
    R -->|No| T[Effect Function]
    
    S --> T
    T --> Q
    
    Q --> U[User Interaction]
    U --> V{New Action?}
    V -->|Yes| C
    V -->|No| W[End Flow]
    
    style A fill:#e3f2fd
    style L fill:#f3e5f5
    style N fill:#e8f5e8
    style Q fill:#e8f5e8
```

## 10. Performance Optimization Flow

```mermaid
flowchart TD
    A[Component Render] --> B{Memoization Check}
    
    B -->|Props Changed| C[Re-render Component]
    B -->|Props Same| D[Skip Render]
    
    C --> E{Large Dataset?}
    
    E -->|Yes| F[Virtual Scrolling]
    E -->|No| G[Normal Rendering]
    
    F --> H[Render Visible Items]
    G --> I[Render All Items]
    
    H --> J[Update Scroll Position]
    I --> K[Complete Render]
    J --> K
    
    K --> L{User Interaction}
    
    L -->|Search/Filter| M[Debounce Input]
    L -->|Navigation| N[Code Splitting]
    L -->|API Call| O[Request Deduplication]
    
    M --> P[Wait 300ms]
    P --> Q[Execute Search]
    Q --> R[Update Results]
    
    N --> S[Load Component Chunk]
    S --> T[Render New Component]
    
    O --> U{Same Request Pending?}
    U -->|Yes| V[Return Existing Promise]
    U -->|No| W[Make New Request]
    
    V --> X[Await Result]
    W --> X
    X --> Y[Update Cache]
    Y --> Z[Update UI]
    
    R --> AA[Performance Metrics]
    T --> AA
    Z --> AA
    D --> AA
    
    AA --> BB[Monitor Core Web Vitals]
    BB --> CC{Performance Good?}
    
    CC -->|Yes| DD[Continue Normal Flow]
    CC -->|No| EE[Trigger Optimization]
    
    EE --> FF[Identify Bottleneck]
    FF --> GG[Apply Optimization]
    GG --> A
    
    DD --> HH[End Flow]
    
    style D fill:#e8f5e8
    style H fill:#e8f5e8
    style V fill:#e8f5e8
    style CC fill:#fff3e0
    style EE fill:#ffebee
```

## Technical Flow Summary

### Key Flow Characteristics

1. **Authentication Flow**: Robust JWT-based authentication with role verification
2. **Data Loading**: Efficient Redux-based state management with error handling
3. **User Interactions**: Comprehensive form validation and user feedback
4. **Error Handling**: Multi-layered error handling with user-friendly messages
5. **Performance**: Optimized rendering with memoization and code splitting

### Flow Optimization Points

1. **Caching Strategy**: API responses cached in Redux store
2. **Debouncing**: Search and filter operations debounced for performance
3. **Code Splitting**: Lazy loading of components for faster initial load
4. **Error Recovery**: Automatic retry mechanisms for failed operations
5. **State Normalization**: Efficient data structure for large datasets

These diagrams provide a comprehensive view of the CSR system's behavior and can help the technical review team understand the complexity and sophistication of the implementation.