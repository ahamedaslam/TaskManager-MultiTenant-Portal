# 🖥️ Task Manager Multi-Tenant Portal

A modern and responsive frontend application built with **Angular** for the Task Manager Microservices Platform.

The portal provides an intuitive user experience for task management, tenant administration, dashboard analytics, and AI-powered assistance while communicating securely with backend microservices through the Ocelot API Gateway.

---

## 📖 Overview

The Multi-Tenant Portal serves as the frontend application of the Task Manager ecosystem.

It provides a centralized interface for:

- Task Management
- Dashboard Analytics
- Tenant Administration
- AI Chat Assistant
- Secure Authentication Integration
- Multi-Tenant User Experience

The application follows a modular Angular architecture for maintainability, scalability, and reusability.

---

## 🖼️ Application Screenshots

### 📊 Dashboard Overview

<img width="1365" height="632" alt="Image" src="https://github.com/user-attachments/assets/639cb733-10c3-4bd5-8694-e7a14f8a1c2b" />

The dashboard provides users with a quick overview of:

- Total Tasks
- Completed Tasks
- Pending Tasks
- Productivity Metrics
- Task Analytics

---

### ✅ Task Management

<img width="643" height="389" alt="Image" src="https://github.com/user-attachments/assets/36c07a5f-e61d-48db-bf9b-9ec835111bd4" />

Features include:

- Create Tasks
- Update Tasks
- Delete Tasks
- Assign Tasks
- Task Status Tracking
- Filtering & Pagination

---

### 🏢 Tenant Management

<img width="643" height="389" alt="Image" src="https://github.com/user-attachments/assets/36c07a5f-e61d-48db-bf9b-9ec835111bd4" />

Administrators can:

- Create Tenants
- Update Tenant Information
- Manage Tenant Settings
- View Tenant Details

---

### 🤖 AI Assistant


The integrated AI assistant helps users:

- Summarize Tasks
- Generate Insights
- Answer Task-Related Queries
- Improve Productivity

---

## 🏗 Frontend Architecture

```text
Angular Portal
      │
      ├── Authentication Module
      │
      ├── Dashboard Module
      │
      ├── Task Management Module
      │
      ├── Tenant Management Module
      │
      ├── AI Chat Module
      │
      ├── Shared Components
      │
      └── Core Services
```

---

## 🛠 Technology Stack

| Technology | Description |
|------------|-------------|
| Angular 19 | Frontend Framework |
| TypeScript | Programming Language |
| Angular Material | UI Components |
| Bootstrap | Responsive Design |
| RxJS | Reactive Programming |
| HTML5 | Markup |
| CSS3 / SCSS | Styling |
| JWT Authentication | Secure Authentication |
| Ocelot API Gateway | Backend Communication |

---

## ✨ Key Features

### Dashboard Analytics

- Task Statistics
- Completion Metrics
- Pending Task Tracking
- Productivity Insights

### Task Management

- Create Tasks
- Edit Tasks
- Delete Tasks
- Task Assignment
- Status Updates
- Search & Filtering
- Pagination

### Tenant Management

- Create Tenant
- Update Tenant
- View Tenant Details
- Tenant Administration

### AI Assistant

- Task Summarization
- Context-Aware Responses
- Productivity Recommendations

### Security

- JWT Authentication
- Route Guards
- HTTP Interceptors
- Secure API Communication

---

## 🔄 Application Flow

```text
User Login
     │
     ▼
Dashboard
     │
     ▼
Task Management
     │
     ▼
Tenant Management
     │
     ▼
AI Assistant
```

---

## 🌐 API Integration

The portal communicates with backend services through the API Gateway.

### Example Requests

```http
POST /gateway/auth/login
```

```http
POST /gateway/taskmanager/getTasks
```

```http
GET /gateway/taskmanager/dashboard/taskAnalytics
```

Benefits:

- Centralized API Access
- Improved Security
- Simplified Frontend Configuration
- Microservice Abstraction

---

## 🛡 Angular Security Features

### Route Guards

Protects secured routes from unauthorized access.

### HTTP Interceptors

Handles:

- JWT Token Injection
- Request Processing
- Error Handling
- Response Processing

### Session Management

- Token Storage
- Automatic Logout
- Secure Authentication Flow

---

## 📂 Project Structure

```text
TaskManager-MultiTenant-Portal
│
├── src
│
├── app
│   ├── authentication
│   ├── dashboard
│   ├── task-management
│   ├── tenant-management
│   ├── ai-chat
│   ├── shared
│   └── core
│
├── assets
│
├── environments
│
├── styles
│
└── angular.json
```

---

## 🚀 Running Locally

### Clone Repository

```bash
git clone https://github.com/ahamedaslam/TaskManager-MultiTenant-Portal.git
```

### Install Dependencies

```bash
npm install
```

### Run Application

```bash
ng serve
```

### Application URL

```text
http://localhost:4200
```

---

## 🔮 Upcoming Enhancements

- Dark Mode
- Real-Time Notifications
- SignalR Integration
- Advanced Analytics
- Progressive Web App (PWA)
- Mobile Optimization
- AI-Powered Recommendations

---

## 👨‍💻 Author

### Ahamed Aslam

Full-Stack Software Engineer

Technologies:

- Angular
- TypeScript
- Angular Material
- Bootstrap
- ASP.NET Core
- JWT Authentication
- Ocelot API Gateway
- Microservices
