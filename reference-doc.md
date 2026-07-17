Information Technology Institute (ITI)

Full Stack Development Track

**BidFast**

*AI-Powered B2B Bidding & RFP Platform*

Graduation Project

Submitted as a requirement for the Graduation Project Track

**Presented By:**

Amr Khaled

Eslam Mohamed

Mohamed Osama

Mohamed Siam

Sara Ghareeb

Tuka Ayman

Zeyad Rabeea

**Supervised by:**

Mohamed Tharwat

Ismailia, Egypt

2026

# Table of Contents

[Table of Contents [2](#table-of-contents)](#table-of-contents)

[Acknowledgement [5](#acknowledgement)](#acknowledgement)

[Project Overview [6](#project-overview)](#project-overview)

[Project Scope [7](#project-scope)](#project-scope)

[Chapter 1 [8](#chapter-1)](#chapter-1)

[Introduction [8](#introduction)](#introduction)

[Background --- B2B Procurement & Bidding Landscape [8](#background-b2b-procurement-bidding-landscape)](#background-b2b-procurement-bidding-landscape)

[Problem Statement [8](#problem-statement)](#problem-statement)

[Objectives [8](#objectives)](#objectives)

[Chapter 2 [9](#chapter-2)](#chapter-2)

[Requirements Analysis and System Development [9](#requirements-analysis-and-system-development)](#requirements-analysis-and-system-development)

[2.1 Functional Requirements [9](#functional-requirements)](#functional-requirements)

[2.1.1 User & Tenant Management [9](#user-tenant-management)](#user-tenant-management)

[2.1.2 Authentication & Authorization [9](#authentication-authorization)](#authentication-authorization)

[2.1.3 RFP / Bid Management [9](#rfp-bid-management)](#rfp-bid-management)

[2.1.4 AI Proposal Generation Pipeline [10](#ai-proposal-generation-pipeline)](#ai-proposal-generation-pipeline)

[2.1.5 Notifications & Real-Time Updates [10](#notifications-real-time-updates)](#notifications-real-time-updates)

[2.1.6 Administrator Functionality [10](#administrator-functionality)](#administrator-functionality)

[2.2 Non-Functional Requirements [10](#non-functional-requirements)](#non-functional-requirements)

[2.2.1 User Interface [10](#user-interface)](#user-interface)

[2.2.2 Security [10](#security)](#security)

[2.2.3 Scalability [11](#scalability)](#scalability)

[2.2.4 Multi-Tenancy [11](#multi-tenancy)](#multi-tenancy)

[2.2.5 Performance [11](#performance)](#performance)

[System Development [12](#system-development)](#system-development)

[2.3 Introduction [12](#introduction-1)](#introduction-1)

[2.3.1 Tools & Technologies [12](#tools-technologies)](#tools-technologies)

[2.4 Integration of Technologies [12](#integration-of-technologies)](#integration-of-technologies)

[Chapter 3 [14](#chapter-3)](#chapter-3)

[System Design [14](#system-design)](#system-design)

[3.1 Layered / Clean Architecture (APIs, BLL, DAL, Common) [14](#layered-clean-architecture-apis-bll-dal-common)](#layered-clean-architecture-apis-bll-dal-common)

[3.2 Advantages of the Architecture [15](#advantages-of-the-architecture)](#advantages-of-the-architecture)

[3.2.1 Modularity [15](#modularity)](#modularity)

[3.2.2 Maintainability [15](#maintainability)](#maintainability)

[3.2.3 Testability [15](#testability)](#testability)

[3.2.4 Security [15](#security-1)](#security-1)

[3.3 Considerations for Future Enhancements [15](#considerations-for-future-enhancements)](#considerations-for-future-enhancements)

[3.4 AI Multi-Agent Pipeline Design [15](#ai-multi-agent-pipeline-design)](#ai-multi-agent-pipeline-design)

[3.4.1 Introduction [15](#introduction-2)](#introduction-2)

[3.4.2 Agent Roles (Orchestrator, Researcher, Writer, Critic, Gap Analyst) [16](#agent-roles-orchestrator-researcher-writer-critic-gap-analyst)](#agent-roles-orchestrator-researcher-writer-critic-gap-analyst)

[3.4.3 Agent Interaction Flow [16](#agent-interaction-flow)](#agent-interaction-flow)

[3.5 Database Design [17](#database-design)](#database-design)

[3.5.1 Introduction [17](#introduction-3)](#introduction-3)

[3.5.2 Entity Descriptions [17](#entity-descriptions)](#entity-descriptions)

[3.5.3 Relationship Diagrams (ERD) [17](#relationship-diagrams-erd)](#relationship-diagrams-erd)

[Chapter 4 [19](#chapter-4)](#chapter-4)

[Testing and Deployment [19](#testing-and-deployment)](#testing-and-deployment)

[4.1 Testing [20](#testing)](#testing)

[4.2 Unit Testing [20](#unit-testing)](#unit-testing)

[4.3 Integration Testing [20](#integration-testing)](#integration-testing)

[4.4 System Testing [20](#system-testing)](#system-testing)

[4.5 User Acceptance Testing (UAT) [21](#user-acceptance-testing-uat)](#user-acceptance-testing-uat)

[4.6 Testing Strategy & Rationale [21](#testing-strategy-rationale)](#testing-strategy-rationale)

[4.7 Deployment [21](#deployment)](#deployment)

[4.8 Server & Environment Setup [21](#server-environment-setup)](#server-environment-setup)

[4.9 Security Hardening [21](#security-hardening)](#security-hardening)

[4.10 Database Migration [21](#database-migration)](#database-migration)

[4.11 Application Deployment [21](#application-deployment)](#application-deployment)

[4.12 Additional Considerations [22](#additional-considerations)](#additional-considerations)

[4.13 Post-Deployment Tasks [22](#post-deployment-tasks)](#post-deployment-tasks)

[4.14 Application Screenshots [22](#application-screenshots)](#application-screenshots)

[Login Page [22](#login-page)](#login-page)

[Dashboard [22](#section)](#section)

[RFP Creation Page [22](#section-6)](#section-6)

[Bid Submission Page [22](#section-9)](#section-9)

[AI Proposal Workspace [22](#section-19)](#section-19)

[Admin Panel [22](#section-22)](#section-22)

[Chapter 5 [23](#chapter-5)](#chapter-5)

[AI-Powered Proposal Workspace [23](#ai-powered-proposal-workspace)](#ai-powered-proposal-workspace)

[Purpose of the AI Proposal Workspace [23](#purpose-of-the-ai-proposal-workspace)](#purpose-of-the-ai-proposal-workspace)

[Key Elements of the Multi-Agent Pipeline [23](#key-elements-of-the-multi-agent-pipeline)](#key-elements-of-the-multi-agent-pipeline)

[Model & Prompt Design [23](#model-prompt-design)](#model-prompt-design)

[Backend Integration (.NET 10, Orchestration Layer) [23](#backend-integration-.net-10-orchestration-layer)](#backend-integration-.net-10-orchestration-layer)

[Frontend Integration (Angular, SignalR Streaming) [23](#frontend-integration-angular-signalr-streaming)](#frontend-integration-angular-signalr-streaming)

[Security [24](#security-2)](#security-2)

[Testing [24](#testing-1)](#testing-1)

[Deployment [24](#deployment-1)](#deployment-1)

[Maintenance and Updates [24](#maintenance-and-updates)](#maintenance-and-updates)

[Conclusion [24](#conclusion)](#conclusion)

[Workspace Screenshots [24](#section-28)](#section-28)

[Proposal Workspace --- Overview [24](#_Toc234043753)](#_Toc234043753)

[Agent Progress / Streaming View [24](#_Toc234043754)](#_Toc234043754)

[Generated Proposal Output [25](#section-33)](#section-33)

[Chapter 6 [26](#chapter-6)](#chapter-6)

[Maintenance, Support and Conclusion [26](#maintenance-support-and-conclusion)](#maintenance-support-and-conclusion)

[Conclusion [26](#conclusion-1)](#conclusion-1)

[Key Takeaways [26](#key-takeaways)](#key-takeaways)

[Future Work [27](#future-work)](#future-work)

[Planned Feature Enhancements [27](#planned-feature-enhancements)](#planned-feature-enhancements)

[Scalability & Infrastructure Improvements [27](#scalability-infrastructure-improvements)](#scalability-infrastructure-improvements)

[Additional AI Agent Capabilities [27](#additional-ai-agent-capabilities)](#additional-ai-agent-capabilities)

[Mobile Application Extension [28](#mobile-application-extension)](#mobile-application-extension)

[Table of References [29](#table-of-references)](#table-of-references)

# Acknowledgement

We would like to express our sincere gratitude to the Information Technology Institute (ITI) and our supervisor, \[Supervisor Name\], for their continuous guidance and support throughout the development of BidFast. We also thank our families and colleagues for their encouragement during this graduation project cycle.

***Note:** This is a standard acknowledgement template. Replace the bracketed names and personalize the wording before final submission.*

# Project Overview

BidFast is a multi-tenant, AI-powered B2B bidding and Request-for-Proposal (RFP) platform built as an ITI graduation project. It automates the traditionally manual, time-consuming proposal-response workflow --- from ingesting an RFP document, through extracting its requirements, drafting compliant proposal sections with AI assistance, reviewing them for quality, to exporting a submission-ready document --- for organizations that respond to tenders in IT, construction, consulting, and government-contracting sectors.

The system is implemented as a decoupled two-tier application: a .NET 10 backend organized as an N-Tier Clean Architecture solution (BidFast.APIs, BidFast.BLL, BidFast.DAL, BidFast.Common) backed by SQL Server via EF Core 10, and an Angular 21 single-page application using standalone components, Signals, and Tailwind CSS. The platform\'s core differentiator --- a five-agent AI pipeline (Orchestrator, Researcher, Writer, Critic, Gap Analyst) --- is implemented in-process using Microsoft Semantic Kernel, calling an OpenAI-compatible chat model (deepseek.v3.2, reached through the ITI API / OpenRouter gateway) and a Qdrant vector database for retrieval-augmented generation (RAG) over each tenant\'s uploaded knowledge base.

As of this documentation revision, BidFast is at MVP maturity: the core authentication, tenant/user management, knowledge vault, RFP extraction, five-agent drafting pipeline, and multi-format export engine are implemented and wired end-to-end. Several capabilities described in the team\'s original strategic proposal --- real-time SignalR streaming, Arabic NLP tooling, SSO, e-signature, CRM/ERP integrations, and portal auto-connectors --- were scoped out of the graduation-project timeline and are documented as Future Work in Chapter 6. No automated test suite or containerized deployment pipeline exists yet in the repository at the time of writing; both are called out explicitly in Chapter 4 rather than assumed.

# Project Scope

The table below defines what is in scope for the delivered graduation project versus what remains out of scope (deferred to Future Work, Chapter 6). This reflects the actual codebase, not the original strategic proposal.

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Area**               **In Scope (Implemented)**                                                                     **Out of Scope (Not Implemented)**
  ---------------------- ---------------------------------------------------------------------------------------------- ----------------------------------------------------------------------
  Identity & Tenancy     Registration, JWT + refresh-cookie login, OTP password reset, 6 RBAC roles, tenant CRUD        SSO/SAML/OIDC/SCIM, tenant impersonation

  Knowledge Management   Document upload, text extraction, chunking, embeddings, Qdrant search, Golden Answer library   Arabic-specific NLP pipeline, document marketplace/templates

  RFP Handling           RFP upload, requirement extraction (\"Shredder\"), requirement CRUD, bid lifecycle status      Etimad/Munaqasat portal auto-connector

  AI Drafting Pipeline   Orchestrator, Researcher, Writer, Critic (2 retry cycles), Gap Analyst, Go/No-Go scoring       Entailment-based hallucination gate, dynamic re-planning

  Real-Time Updates      Sequential HTTP-driven pipeline status via Angular Signals                                     SignalR/WebSocket push streaming, Redis backplane

  Export                 DOCX, PDF, Arabic RTL DOCX, Excel export with tenant template fallback chain                   BOQ Auto-Fill / Financial Agent, e-signature (DocuSign/Adobe Sign)

  Integrations           SMTP email (MailKit)                                                                           CRM/ERP connectors (Salesforce, HubSpot, SAP, NetSuite, Jira, Asana)

  Testing & Deployment   Manual testing via .http file / Swagger-Scalar UI                                              Automated test suite, Docker/containerized deployment
  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Chapter 1

# Introduction

This chapter introduces the business context that motivates BidFast, states the problem the platform is designed to solve, and lists the graduation project\'s objectives.

## Background --- B2B Procurement & Bidding Landscape

Organizations that respond to Requests for Proposals (RFPs) --- in IT, construction, consulting, and government contracting --- face a proposal process that is manual, slow, and knowledge-intensive. Drafting a single technical proposal can take anywhere from 30 hours to 3 weeks, requiring coordination across subject-matter experts, legal reviewers, and pricing analysts, and depends heavily on locating and reusing content from past winning bids. Because proposal capacity is limited, companies routinely decline a significant share of viable opportunities simply because they cannot produce a compliant response before the deadline.

## Problem Statement

Traditional RFP response work suffers from five compounding problems: (1) time attrition --- senior staff spend disproportionate time hunting for and reformatting past content instead of billable work; (2) knowledge silos --- a company\'s best answers exist somewhere in old files, emails, or a single bid manager\'s memory, effectively inaccessible when a new bid arrives; (3) opportunity cost --- limited team bandwidth forces companies to skip winnable bids; (4) compliance risk --- manual copy-paste between proposals is the leading cause of missed mandatory requirements, which can trigger automatic disqualification; and (5) a regional gap --- bidding teams in the MENA market are underserved by English-first global RFP tools. BidFast is designed to address problems (1) through (4) directly, using an AI-assisted, knowledge-grounded drafting pipeline; regional Arabic/MENA tooling (problem 5) is addressed only partially (RTL document export) and the remainder is tracked as Future Work.

## Objectives

-   Provide a multi-tenant platform where each organization manages its own users, knowledge base, and bid projects in isolation.

-   Automate extraction of structured requirements from an uploaded RFP document (the \"Shredder\").

-   Ground every AI-generated proposal section in the tenant\'s own historical knowledge via retrieval-augmented generation (RAG) against a vector database.

-   Implement a five-agent AI workflow (Orchestrator, Researcher, Writer, Critic, Gap Analyst) that plans, drafts, reviews, and scores proposal coverage with minimal manual intervention.

-   Give bid managers a Go/No-Go coverage recommendation before committing writing effort to a bid.

-   Export a submission-ready proposal in DOCX, PDF, Arabic RTL DOCX, or Excel format, using the tenant\'s own branded templates where supplied.

-   Enforce role-based access control and audit logging appropriate to a regulated, multi-tenant SaaS product.

# Chapter 2

# Requirements Analysis and System Development

## 2.1 Functional Requirements

### 2.1.1 User & Tenant Management

Multi-tenancy is modeled with a root Tenant entity (Name, Industry, Slug, Status) and an AppUser entity extending ASP.NET Core Identity with FirstName, LastName, TenantId, IsActive, RequiresPasswordChange, and AvatarUrl. TenantsController exposes create/list/get/update endpoints and a status-change endpoint (Active / Suspended / Offboarded), all restricted to SuperAdmin. UsersController exposes create, get, list (paginated, filterable by role), update, role-change, activate, and deactivate endpoints, scoped to the caller\'s tenant.

Roles are defined as constants in BidFast.Common.Roles.AppRoles: SuperAdmin, TenantAdmin, BillingManager, SeniorManager, LineReader, and FinanceAuditor.

***Note:** The original strategic proposal specified a different set of six roles (SuperAdmin, TenantAdmin, BidManager, TechnicalWriter, LegalReviewer, FinanceAnalyst). The team implemented a different, subscription/billing-oriented role set instead --- this is a deliberate divergence, not an omission, and is reflected accurately here rather than in the proposal\'s original naming.*

### 2.1.2 Authentication & Authorization

Authentication uses JWT Bearer tokens combined with an HttpOnly refresh-token cookie. AuthManager.LoginAsync validates credentials, checks the IsActive flag, and issues a signed JWT (claims: NameIdentifier, Email, FirstName, LastName, TenantId, IsActive, RequiresPasswordChange, and one or more role claims) plus a random 64-byte Base64 refresh token stored server-side. RefreshTokenAsync rotates the refresh token atomically (old token marked IsRevoked=true before the new pair is issued).

First-login password change is enforced by a custom PasswordChangeAuthorizationHandler / PasswordChangeRequirement pair: every policy below also requires RequiresPasswordChange=false in the current JWT before the request is allowed through.

  -------------------------------------------------------------------------------------------
  **Policy**           **Roles Allowed**                         **Additional Requirement**
  -------------------- ----------------------------------------- ----------------------------
  SuperAdminOnly       SuperAdmin                                PasswordChangeRequirement

  TenantAdminOrAbove   SuperAdmin, TenantAdmin                   PasswordChangeRequirement

  BillingAccess        SuperAdmin, TenantAdmin, BillingManager   PasswordChangeRequirement

  ActiveUserOnly       Any authenticated user                    PasswordChangeRequirement
  -------------------------------------------------------------------------------------------

Password recovery uses a one-time-password (OTP) flow: POST /api/auth/forgot-password issues an OTP via email, POST /api/auth/confirm-otp validates it and returns a reset token, and POST /api/auth/reset-password completes the change. On the frontend, AuthGuard checks AuthService.isLoggedIn() (falling back to a session check against GET /api/Profile), and a functional HTTP interceptor (authInterceptor) attaches credentials to every request and transparently calls /api/auth/refresh on a 401 before retrying the original request once.

### 2.1.3 RFP / Bid Management

A BidProject is the parent record for a tender response: Name, ClientName, SubmissionDeadline, ContractValue, Sector, Status, ExtractionStatus, ExtractionError, and GoNoGoScore. Status follows the lifecycle: New → Analyzing → Drafting → Review → Finalized → Submitted → Won / Lost / Declined.

BidProjectsController accepts an RFP file upload (PDF/DOCX/XLSX), which RfpExtractionService (\"the Shredder\") processes: extracting raw text via ITextExtractorService, chunking it, and prompting the chat model to structure it into typed RfpRequirement records (Title, Description, Type, PageNumber, SectionReference). Requirements start with IsReviewed=false and are edited/approved through RfpRequirementsController before being fed into the Orchestrator agent.

### 2.1.4 AI Proposal Generation Pipeline

A five-agent pipeline drafts each bid section using retrieval-augmented generation. Each agent is a distinct BLL service; the full design, thresholds, and prompts are detailed in Chapter 3.4 and Chapter 5.

  -----------------------------------------------------------------------------------------------------------------------------------------------------------
  **Agent**       **Core Role**
  --------------- -------------------------------------------------------------------------------------------------------------------------------------------
  Orchestrator    Groups reviewed requirements into a structured proposal outline (ProposalSection records with type and priority).

  Researcher      Retrieves supporting content per section from Qdrant + the Golden Answer library; flags knowledge gaps below a 0.60 confidence threshold.

  Writer          Drafts 150--400 word section content grounded in retrieved chunks, in English (with an Arabic field for RTL export).

  Critic          Reviews each drafted section against its requirements; can request up to 2 revision cycles before escalating to a human.

  Gap Analyst     Aggregates knowledge gaps and Critic escalations into a coverage score and a Go / Conditional / No-Go recommendation.
  -----------------------------------------------------------------------------------------------------------------------------------------------------------

### 2.1.5 Notifications & Real-Time Updates

In-app notifications are modeled as signals in PlatformStateService (notifications array with read/unread state and mark-as-read methods), rendered in the topbar. Pipeline progress inside the AI Workspace is surfaced through PipelineOrchestratorService, which calls each agent endpoint sequentially over plain HTTP and updates Angular Signals (currentPhase, agentFeed, streamContent) as each response arrives.

***Note:** The original proposal specified SignalR/WebSocket-based token-by-token streaming and a live agent status ticker. No \@microsoft/signalr dependency, HubConnection, or SignalR Hub exists anywhere in the current codebase (confirmed by dependency and source search across both the .NET backend and the Angular frontend). What is implemented instead is a sequence of ordinary HTTP request/response calls whose results are pushed into Signals, giving a similar-looking but non-push, non-token-level UI experience. This is documented as a divergence and listed in Future Work (Chapter 6).*

### 2.1.6 Administrator Functionality

TenantAdmin and SuperAdmin users manage users and roles through UsersController and the Angular UserManagementComponent (guarded by roleGuard(\'SuperAdmin\',\'TenantAdmin\')), which includes an invite form, a searchable/filterable user table, a permission matrix across roles and modules, and basic analytics charts (7-day growth, role distribution) built with ng-apexcharts.

***Note:** Tenant impersonation (a Super Admin logging in as a tenant user for support), platform-wide feature flags, and an emergency kill-switch were specified in the original proposal\'s Admin Control Panel but are not present anywhere in the current backend (no matches for \"Impersonat\" or \"FeatureFlag\" across the .NET solution). These are listed under Future Work.*

## 2.2 Non-Functional Requirements

### 2.2.1 User Interface

The frontend is an Angular 21 application built entirely from standalone components using Signals and the inject() function rather than constructor injection or NgModules. Global design tokens (\--surface-base, \--ink, \--glass-bg, \--brand-primary, and related variables) are defined in styles.css for both light and dark themes; Tailwind CSS (v4) supplies utility classes and a custom theme (glassmorphism surfaces, brand gradient, custom keyframes such as agent-pulse and flow-pulse). Icons are provided by lucide-angular with a curated set of \~45 icons registered at bootstrap. Angular animations (staggerFadeIn, fadeSlideIn, expandCollapse) drive list and modal transitions. Server-side rendering (Angular SSR / Universal) is configured with client hydration and event replay.

### 2.2.2 Security

Security controls actually implemented: HttpOnly-cookie refresh tokens with atomic rotation on refresh and on password change (all outstanding refresh tokens for a user are revoked on password change); policy-based authorization on every protected controller action; FluentValidation on all write DTOs; TLS is expected to be terminated by the hosting environment (not configured in source).

A dedicated internal audit (Some_Mistakes_Could_Happen.md, maintained by the team) identified issues that had not all been resolved at the time of this documentation. They are reproduced here for transparency rather than omitted:

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Severity**   **Issue**                                                                                                                             **Status**
  -------------- ------------------------------------------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------
  Critical       Placeholder JWT signing key (\"YourSuperSecretKeyThatIsAtLeast32Chars!!\") committed to appsettings.json                              Flagged; requires moving to an environment variable/secret store before any real deployment

  Critical       No startup validation previously existed for an empty/weak JWT key (now validated: must be ≥32 chars)                                 Fix applied --- Program.cs validates SecretKey length at startup

  High           Temporary passwords are emailed in plaintext on tenant/user creation                                                                  Flagged; recommended fix is a one-time magic link instead

  High           EmailService.SendEmailAsync returns true even when SMTP is unconfigured                                                               Flagged; silent failure risk for transactional email

  High           /api/auth/refresh, /revoke, /logout previously expected a raw JSON string body instead of an object, breaking standard JSON clients   Flagged as a binding mismatch to fix with a proper request DTO

  Medium         Refresh tokens are stored as plaintext Base64 rather than hashed                                                                      Flagged; recommended fix is server-side hashing before storage

  Medium         No transaction wraps tenant + first-admin-user creation, risking an orphaned tenant on partial failure                                Flagged
  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

***Note:** The Critical and High severity items above are still open as of this documentation revision. Only the JWT-key-length startup validation is marked \"Fix applied\"; the placeholder signing key, plaintext temporary passwords, the SMTP silent-failure behavior, and the /api/auth binding mismatch have not yet been remediated in the codebase. This table reflects the internal audit\'s findings as-is, not a resolved state.*

### 2.2.3 Scalability

The current deployment target is a single application instance backed by one SQL Server database and one Qdrant instance. There is no Redis-backed SignalR backplane (SignalR itself is not implemented --- see 2.1.5), no background job runner (no Hangfire/Quartz.NET package reference found), and no containerized deployment. Horizontal scaling of the API layer is architecturally possible (the BLL/DAL layers are stateless per-request), but has not been configured or tested.

### 2.2.4 Multi-Tenancy

Every domain entity carries a TenantId. Tenant isolation is enforced manually rather than automatically: specialized repository methods take an explicit tenantId parameter (for example IRfpRequirementRepository.GetByProjectAsync(Guid projectId, string tenantId)), and each BLL manager/service passes the caller\'s tenant ID down to the repository layer. No EF Core global query filter (HasQueryFilter) exists anywhere in BidFast.DAL --- confirmed by a direct source search --- so isolation depends on every query path remembering to filter by tenant, rather than being enforced once at the DbContext level.

Vector isolation in Qdrant uses a single shared collection (\"knowledge_chunks\", 1024-dimensional, cosine distance) where every point\'s payload carries a tenantId field, and every search request adds a tenantId filter condition. This differs from the proposal\'s literal \"namespace-per-tenant\" / \"collection-per-tenant\" design --- the isolation is a payload filter within one collection, not a separate physical namespace.

### 2.2.5 Performance

Frontend: OnPush-equivalent reactivity via Signals and computed(), route-level lazy loading (loadComponent()) for every page, SSR with hydration to reduce time-to-interactive. Backend: asynchronous EF Core throughout (async/await on all repository and manager methods), a Result-pattern response envelope (GeneralResult\<T\>) to avoid exception-driven control flow on the hot path, and a Unit-of-Work pattern that batches multiple repository writes into a single SaveChangesAsync call per request.

## System Development

## 2.3 Introduction

The system was developed as two independently deployable applications --- a .NET 10 Web API and an Angular 21 SPA --- communicating over a versioned REST API secured by cookie-carried JWTs. The following subsections list the concrete technology choices and how they integrate.

### 2.3.1 Tools & Technologies

  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Layer**                **Technology**                             **Version**                                **Purpose**
  ------------------------ ------------------------------------------ ------------------------------------------ --------------------------------------------------------------------------
  Frontend framework       Angular                                    21                                         Standalone-component SPA, Signals-based reactivity, SSR

  Frontend styling         Tailwind CSS                               4.x                                        Utility-first styling, custom design tokens, dark mode

  Frontend icons           lucide-angular                             1.0.0                                      SVG icon set, tree-shaken via manual pick()

  Frontend charts          ng-apexcharts / apexcharts                 1.11 / 3.54                                Analytics charts (growth, role distribution)

  Frontend doc preview     docx-preview                               0.3.7                                      In-browser preview of uploaded/exported DOCX files

  Frontend runtime (SSR)   Express                                    5.1.0                                      Node server hosting the Angular SSR bundle

  Backend framework        ASP.NET Core Web API (.NET)                .NET 10                                    REST API, controllers, middleware pipeline

  ORM                      Entity Framework Core                      EF Core 10                                 SQL Server access, migrations

  Relational database      SQL Server                                 2022-class (via connection string)         Primary transactional store

  Vector database          Qdrant                                     n/a (Docker-hosted, 1024-dim collection)   Embedding storage & similarity search for RAG

  AI orchestration         Microsoft Semantic Kernel                  current NuGet release                      In-process LLM orchestration for the 5 agents

  LLM gateway              ITI API / OpenRouter (OpenAI-compatible)   n/a                                        Chat completions (deepseek.v3.2) and embeddings (text-embedding-3-small)

  Auth                     JWT Bearer + HttpOnly refresh cookie       ASP.NET Core Identity                      Stateless API auth with rotated refresh tokens

  Validation               FluentValidation                           current                                    Request DTO validation

  Document export          iText7, ClosedXML, Open XML SDK            current                                    PDF, Excel, and RTL/BiDi DOCX generation

  Email                    MailKit / MimeKit                          4.17.0                                     SMTP transactional email (OTP, welcome, invites)
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

***Note:** The original proposal specified PostgreSQL and BGE-M3 multilingual embeddings. The delivered implementation uses SQL Server (not PostgreSQL) and OpenAI-compatible text-embedding-3-small (not BGE-M3), reached through OpenRouter/the ITI API rather than a locally hosted embedding model. Qdrant as the vector store, and the general Docker-hosted deployment assumption for it, matches the proposal.*

## 2.4 Integration of Technologies

The Angular SPA communicates with the API exclusively over HTTPS/HTTP using Angular\'s HttpClient with the fetch backend (provideHttpClient(withFetch())), routed through a single functional interceptor that attaches cookies and performs silent refresh-and-retry on 401 responses. The API layer (BidFast.APIs) depends only on BidFast.BLL; BidFast.BLL depends on BidFast.DAL and BidFast.Common; BidFast.DAL owns the EF Core DbContext, entities, and repositories. Inside BidFast.BLL, the five agent services and the Researcher\'s Qdrant/embedding clients are registered as scoped/singleton services via a DI extension method and are consumed by their respective controllers (OrchestratorController, ResearcherController, WriterController, CriticController, GapAnalystController) purely through interfaces, keeping the AI orchestration logic testable independently of ASP.NET Core.

# Chapter 3

# System Design

## 3.1 Layered / Clean Architecture (APIs, BLL, DAL, Common)

BidFast\'s backend solution (ITI_Graduation_project_BidFast.slnx) is split into four projects with a strict, one-directional dependency chain: BidFast.APIs → BidFast.BLL → BidFast.DAL / BidFast.Common.

-   BidFast.APIs --- controllers (18 total), Program.cs startup/DI wiring, JWT authentication configuration, authorization policies, PasswordChangeAuthorizationHandler, and a GlobalExceptionMiddleware.

-   BidFast.BLL --- Managers (Auth, Tenant, User, Knowledge, Chunking, Embedding, VectorStore, Profile, RagChat, TextExtractor) and Services (Orchestrator, Researcher, Writer, Critic, GapAnalyst, Export, RfpExtraction, GoldenAnswer), plus DTOs and FluentValidation validators.

-   BidFast.DAL --- AppDbContext, entity classes (Data/Entities and Data/Models, including the full RFP and Export sub-domains), EF Core Fluent configurations, 37 migrations, the generic and specialized repositories, and the UnitOfWork.

-   BidFast.Common --- GeneralResult\<T\> response envelope, AppRoles, JwtSettings/EmailSettings/OpenAiSettings/QdrantSettings/SemanticKernelSettings, AuditAction constants, and shared enums (BidStatus, ExtractionStatus, RequirementType, ExportType, ExportJobStatus).

Data access follows the Repository Pattern with a Unit of Work coordinator. Generic repositories (IGenericRepository\<T\> for int-keyed entities, IGenericGuidRepository\<T\> for Guid-keyed entities) provide CRUD primitives; specialized repositories add tenant-aware, domain-specific queries:

public interface IRfpRequirementRepository : IGenericGuidRepository\<RfpRequirement\>

{

Task\<IEnumerable\<RfpRequirement\>\> GetByProjectAsync(Guid projectId, string tenantId);

Task\<RfpRequirement?\> GetByIdAsync(Guid requirementId, string tenantId);

Task DeleteByProjectAsync(Guid projectId);

}

All repositories are exposed through a single IUnitOfWork, which lazily instantiates each repository and centralizes SaveChangesAsync into one SaveAsync() call, so a request that touches several entities (e.g., writing a section and its citations) commits atomically:

public interface IUnitOfWork

{

IBidProjectRepository BidProjectRepository { get; }

IProposalSectionRepository ProposalSections { get; }

IResearchResultRepository ResearchResultRepository { get; }

IWrittenSectionRepository WrittenSectionRepository { get; }

ICriticReviewRepository CriticReviewRepository { get; }

IGapReportRepository GapReportRepository { get; }

IExportJobRepository ExportJobRepository { get; }

// \... plus Tenants / RefreshTokens / AuditLogEntries DbSets

Task SaveAsync();

}

Every controller returns a consistent response envelope, GeneralResult\<T\> (BidFast.Common), instead of raw exceptions or ad-hoc shapes:

public class GeneralResult

{

public bool Success { get; set; }

public string Message { get; set; } = string.Empty;

public Dictionary\<string, List\<Errors\>\>? Errors { get; set; }

public static GeneralResult SuccessResult(string message = \"\...\") =\> new() { Success = true, Message = message };

public static GeneralResult NotFound(string message = \"Resource not found\") =\> new() { Success = false, Message = message };

public static GeneralResult Fail(Dictionary\<string, List\<Errors\>\> errors, \...) =\> new() { Success = false, Errors = errors };

}

public class GeneralResult\<T\> : GeneralResult

{

public T? Data { get; set; }

public static GeneralResult\<T\> SuccessResult(T data, string message = \"\...\") =\> new() { Success = true, Data = data, Message = message };

}

## 3.2 Advantages of the Architecture

### 3.2.1 Modularity

Each of the four projects has a single, clearly bounded responsibility, and the AI agent services are each isolated behind their own interface (IOrchestratorService, IResearcherService, IWriterService, ICriticService, IGapAnalystService), so any one agent\'s internal logic (prompting, thresholds) can change without touching the others or the controllers that call them.

### 3.2.2 Maintainability

The consistent GeneralResult\<T\> envelope, FluentValidation validators per DTO, and the Repository/UnitOfWork pattern reduce the amount of ad-hoc error handling and duplicated data-access code across 18 controllers and 30+ BLL managers/services.

### 3.2.3 Testability

Because every manager and service is expressed as an interface and injected via constructor/DI, each one is mockable in isolation. In practice, however, no automated test project exists in the solution yet (see Chapter 4) --- testability is an architectural property that has not yet been exercised by an actual test suite.

### 3.2.4 Security

Authorization is centralized in ASP.NET Core policies (SuperAdminOnly, TenantAdminOrAbove, BillingAccess, ActiveUserOnly) rather than scattered role checks, and the custom PasswordChangeRequirement is layered onto every policy so a user who hasn\'t completed a forced password change cannot use any protected endpoint.

## 3.3 Considerations for Future Enhancements

-   Replace manual per-repository tenant filtering with EF Core global query filters (HasQueryFilter) scoped to an ambient TenantId, closing the risk of a forgotten filter on a new query path.

-   Move the JWT signing key and SMTP credentials out of appsettings.json into environment variables or a secret store (Azure Key Vault / AWS Secrets Manager), and hash refresh tokens before persisting them.

-   Wrap tenant + first-admin-user creation in a single transaction to avoid an orphaned tenant if user creation fails.

-   Introduce an automated test project (xUnit/NUnit for the backend, Karma/Jasmine or Jest for the frontend) --- none exists today beyond the Angular CLI\'s default boilerplate app.spec.ts.

## 3.4 AI Multi-Agent Pipeline Design

### 3.4.1 Introduction

The original strategic proposal called for a Python/FastAPI microservice built on CrewAI (agent orchestration) and LlamaIndex (RAG ingestion, chunking, and hybrid retrieval), communicating with the .NET backend over an internal HTTP contract. The team replaced this with Microsoft Semantic Kernel running directly inside the .NET backend.

What was gained: a single deployable stack (no second runtime/process to build, containerize, and version alongside the API), no network hop or serialization contract between the business layer and the AI layer, and direct access to the same EF Core DbContext and DI container used by the rest of the application (the agent services can call the same repositories and UnitOfWork as any other BLL service).

What was traded off: CrewAI\'s built-in role/task/crew abstractions and retry orchestration were not available, so the Orchestrator → Researcher → Writer → Critic → Gap Analyst hand-off is coded explicitly as sequential service calls rather than a declarative crew definition; and LlamaIndex\'s mature chunking, hybrid (dense + BM25) retrieval, and reranking pipeline was not available, so chunking (ChunkingManager), embedding (SKEmbeddingManager / OpenAiEmbeddingGenerationService), and Qdrant querying (QdrantVectorStoreManager) were hand-rolled using dense vector similarity search only --- no BM25 keyword layer or cross-encoder reranker is implemented.

### 3.4.2 Agent Roles (Orchestrator, Researcher, Writer, Critic, Gap Analyst)

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Agent**      **Input**                                                           **Output**                                                                                            **Core Logic**
  -------------- ------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Orchestrator   Reviewed RfpRequirements for a project                              List\<ProposalSectionDto\> (Name, Type, Priority, Status)                                             Single chat-model call groups requirements into sections by type (Narrative/Technical/Financial/Legal/Methodology/Management); JSON response parsed (markdown-fence stripped); prior sections deleted and replaced on re-run. No retry/re-planning logic.

  Researcher     One ProposalSection (Name, Type)                                    ResearchResult rows (Text, Score, FileName, PageNumber, IsGoldenAnswer, IsKnowledgeGap) per section   Checks Golden Answer library first (exact match, Score=1.0); otherwise embeds a query string and searches Qdrant (top-K=5, doubled candidate pool, +0.15 score boost on keyword match); marks a section as a knowledge gap when the best score is below the constant GapThreshold = 0.60.

  Writer         ProposalSection + its ResearchResults + matching RfpRequirements    WrittenSection (Content, ContentArabic, RevisionCount, Status)                                        Builds a context block from Golden Answers (marked \"USE THIS EXACTLY\") and cited chunks, then prompts for 150--400 words of professional bid copy with no section headings. Sections with no research results are skipped for the Gap Analyst to flag.

  Critic         WrittenSection + matching RfpRequirements + ResearchResults         CriticReview (Decision: Approved / NeedsRevision / Escalated, Feedback, Issues, ReviewCycle)          Checks five criteria (addresses requirements, no contradictions, no ungrounded claims vs. source material, professional tone, numeric constraints met). On NeedsRevision, recursively triggers the Writer to rewrite and re-reviews, up to MaxRevisionCycles = 2, after which it escalates to a human reviewer.

  Gap Analyst    Knowledge-gap flags from the Researcher + escalated CriticReviews   GapReport (CoverageScore, GoNoGoRecommendation, GoNoGoRationale, ExecutiveSummary, gap items)         Computes coverage = (sections − gapped sections) / sections × 100; for each gap, asks the chat model for severity, a suggested search query, and a remediation suggestion; maps coverage to Go (≥80%), Conditional (50--79%), or NoGo (\<50%).
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

***Note:** The proposal specified a Researcher confidence threshold of 0.72 and a Critic hallucination gate based on an entailment score below 0.65 blocking ungrounded claims outright. The implemented Researcher uses 0.60 as its gap threshold, and no numeric entailment-score gate exists in CriticService --- the Critic\'s grounding check is a qualitative instruction inside the review prompt, not a computed/enforced score. Both are documented here as-built, and the entailment gate is listed under Future Work.*

### 3.4.3 Agent Interaction Flow

The pipeline runs as a linear, human-checkpointed sequence rather than a fully autonomous loop:

-   1\. Orchestrate --- POST /api/projects/{id}/orchestrate builds the ProposalSection outline from reviewed requirements.

-   2\. Research --- POST /api/projects/{id}/research retrieves supporting content per section and flags knowledge gaps inline.

-   3\. Gap check (pre-writing) --- the frontend calls the Gap Analyst after research to show a coverage score and a Go/Conditional/No-Go recommendation before any drafting effort is spent; the Bid Manager decides whether to proceed.

-   4\. Write --- POST /api/projects/{id}/write drafts each section\'s content from its research results.

-   5\. Critic --- POST /api/projects/{id}/review reviews every written section, looping the Writer up to twice per section on NeedsRevision before escalating.

-   6\. Gap Analyst (final) --- POST /api/projects/{id}/gap-report re-aggregates coverage and escalations into the final report used before export.

This matches the Angular PipelineOrchestratorService\'s phase machine: idle → research → gap1 → awaiting_decision → writing → critic → gap2 → done (or declined / error).

## 3.5 Database Design

### 3.5.1 Introduction

The relational schema is managed by EF Core 10 against SQL Server, evolved across 37 migrations from initial creation (2026-06-15) through the export module and a final foreign-key cleanup (2026-07-01). Identity tables (AspNetUsers, AspNetRoles, etc.) come from ASP.NET Core Identity; the remaining schema is split into an identity/tenancy group and an RFP/export domain group.

### 3.5.2 Entity Descriptions

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Entity**                           **Key Fields**                                                                         **Notes**
  ------------------------------------ -------------------------------------------------------------------------------------- ----------------------------------------------------------------------
  Tenant                               TenantId, Name, Slug, Industry, Status                                                 Root of multi-tenancy; Slug is unique

  AppUser                              Id, Email, TenantId, Role(s), IsActive, RequiresPasswordChange, AvatarUrl              Extends IdentityUser

  RefreshToken                         Token, UserId, IsRevoked, ExpiresAt                                                    Unique index on Token; stored as plaintext Base64 (flagged in 2.2.2)

  PasswordResetToken                   Email, Otp, ExpiresAt, FailedAttempts                                                  Backs the forgot-password OTP flow

  AuditLogEntry                        Action, TenantId, ActorUserId, TargetUserId, Details, CreatedAt                        No unique constraint on Action; indexed by Action/TenantId/CreatedAt

  KnowledgeDocument                    FileName, FilePath, Category, ExpiryDate, IsDeleted                                    Soft-delete via IsDeleted

  GoldenAnswer / GoldenAnswerVersion   Question, Answer, Category, UsageCount, IsActive                                       1:N version history, cascade delete

  BidProject                           Name, ClientName, SubmissionDeadline, Status, ExtractionStatus, GoNoGoScore            Root of the RFP domain

  RfpDocument                          BidProjectId, FilePath                                                                 The uploaded RFP source file

  RfpRequirement                       Title, Description, Type, PageNumber, SectionReference, IsReviewed, IsDeleted          Output of the Shredder

  ProposalSection                      Name, Type, Priority, Status                                                           Output of the Orchestrator

  ResearchResult                       Text, Score, FileName, PageNumber, IsGoldenAnswer, IsKnowledgeGap                      Output of the Researcher

  WrittenSection                       Content, ContentArabic, RevisionCount, Status                                          Output of the Writer

  CriticReview                         Decision, Feedback, Issues, ReviewCycle                                                Output of the Critic

  GapReport                            CoverageScore, GoNoGoRecommendation, GoNoGoRationale, ExecutiveSummary, GapItemsJson   Output of the Gap Analyst

  ExportJob                            ExportType, Status, OutputFilePath, OutputFileName, ErrorMessage                       Tracks Docx/Pdf/Rtl/Excel export runs

  ExportTemplate                       DisplayName, FilePath, IsDefault                                                       Tenant-uploaded DOCX templates
  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### 3.5.3 Relationship Diagrams (ERD)

***Note:** A graphical ERD image could not be generated in this documentation pipeline (no diagramming tool available). The relationships below are provided as a structured table instead; producing a visual ERD (e.g., via dbdiagram.io or draw.io, reverse-engineered from the EF Core model) is recommended as a follow-up documentation asset.*

  ------------------------------------------------------------------------------
  **From Entity**       **Relationship**         **To Entity**
  --------------------- ------------------------ -------------------------------
  Tenant                1 : N                    AppUser

  AppUser               1 : N                    RefreshToken (cascade delete)

  Tenant                1 : N                    BidProject

  BidProject            1 : N                    RfpDocument

  BidProject            1 : N                    RfpRequirement

  BidProject            1 : N                    ProposalSection

  ProposalSection       1 : N                    ResearchResult

  ProposalSection       1 : N                    WrittenSection

  WrittenSection        1 : N                    CriticReview

  BidProject            1 : 1 (latest)           GapReport

  BidProject            1 : N                    ExportJob

  Tenant                1 : N                    ExportTemplate

  GoldenAnswer          1 : N (cascade delete)   GoldenAnswerVersion
  ------------------------------------------------------------------------------

# Chapter 4

# Testing and Deployment

This chapter documents both the API surface exercised during development and the current state of testing and deployment. Consistent with the instruction to state facts plainly rather than assume proposal content, several sub-sections below report that a capability described in the template does not yet exist in the repository.

For reference, the complete set of implemented API endpoints (18 controllers) is listed below, since it is the surface that testing and deployment activity revolves around.

  --------------------------------------------------------------------------------------------------------------------------
  **Method**   **Route**                                   **Auth Policy**      **Purpose**
  ------------ ------------------------------------------- -------------------- --------------------------------------------
  POST         /api/auth/register                          Anonymous            Create tenant + first TenantAdmin user

  POST         /api/auth/login                             Anonymous            Authenticate, issue JWT + refresh cookie

  POST         /api/auth/refresh                           Anonymous (cookie)   Rotate refresh token, issue new JWT

  POST         /api/auth/revoke                            ActiveUserOnly       Revoke current refresh token

  POST         /api/auth/logout                            ActiveUserOnly       Session cleanup

  POST         /api/auth/change-password                   ActiveUserOnly       Change password (forced on first login)

  POST         /api/auth/forgot-password                   Anonymous            Send OTP for password reset

  POST         /api/auth/confirm-otp                       Anonymous            Validate OTP, return reset token

  POST         /api/auth/reset-password                    Anonymous            Complete password reset

  GET          /api/auth/me                                ActiveUserOnly       Current user profile + roles

  POST         /api/tenants                                SuperAdminOnly       Create tenant + TenantAdmin

  GET          /api/tenants                                SuperAdminOnly       List all tenants

  GET          /api/tenants/{id}                           TenantAdminOrAbove   Tenant details

  PUT          /api/tenants/{id}                           TenantAdminOrAbove   Update tenant profile

  PUT          /api/tenants/{id}/status                    SuperAdminOnly       Suspend / reactivate / offboard tenant

  POST         /api/users                                  TenantAdminOrAbove   Create user

  GET          /api/users/{id}                             TenantAdminOrAbove   User details

  GET          /api/users                                  TenantAdminOrAbove   List users (paginated, filterable by role)

  PUT          /api/users/{id}                             TenantAdminOrAbove   Update user profile

  PUT          /api/users/{id}/role                        TenantAdminOrAbove   Change user role

  PUT          /api/users/{id}/deactivate                  TenantAdminOrAbove   Deactivate user

  PUT          /api/users/{id}/activate                    TenantAdminOrAbove   Reactivate user

  GET          /api/Profile                                ActiveUserOnly       Current user profile + avatar

  PUT          /api/Profile                                ActiveUserOnly       Update profile

  POST         /api/Profile/avatar                         ActiveUserOnly       Upload avatar

  DELETE       /api/Profile/avatar                         ActiveUserOnly       Remove avatar

  POST         /api/bidprojects/upload                     ActiveUserOnly       Upload RFP file, trigger extraction

  GET          /api/bidprojects                            ActiveUserOnly       List bid projects for tenant

  GET          /api/bidprojects/{id}                       ActiveUserOnly       Bid project details

  PATCH        /api/bidprojects/{id}/status                ActiveUserOnly       Manual status change

  POST         /api/bidprojects/{id}/extract               ActiveUserOnly       Re-trigger requirement extraction

  GET          /api/bidprojects/{id}/extraction-status     ActiveUserOnly       Poll extraction status

  GET          /api/bidprojects/{projectId}/requirements   ActiveUserOnly       List requirements

  POST         /api/bidprojects/{projectId}/requirements   ActiveUserOnly       Add requirement manually

  PUT          \.../requirements/{requirementId}           ActiveUserOnly       Update / mark reviewed

  DELETE       \.../requirements/{requirementId}           ActiveUserOnly       Soft-delete requirement

  POST         /api/projects/{id}/orchestrate              ActiveUserOnly       Run Orchestrator agent

  GET          /api/projects/{id}/sections                 ActiveUserOnly       List proposal sections

  POST         /api/projects/{id}/research                 ActiveUserOnly       Run Researcher agent

  POST         /api/projects/{id}/write                    ActiveUserOnly       Run Writer agent

  POST         /api/projects/{id}/review                   ActiveUserOnly       Run Critic agent

  POST         /api/projects/{id}/gap-report               ActiveUserOnly       Run Gap Analyst agent

  GET          /api/dashboard/statistics                   ActiveUserOnly       Dashboard statistics

  POST         /api/Knowledge/upload                       ActiveUserOnly       Upload & index documents

  POST         /api/Knowledge/search                       ActiveUserOnly       Semantic search over vault

  GET          /api/Knowledge                              ActiveUserOnly       List documents

  GET          /api/Knowledge/{id}                         ActiveUserOnly       Document metadata

  DELETE       /api/Knowledge/{id}                         ActiveUserOnly       Delete document (file + vectors)

  GET          /api/Knowledge/{id}/preview                 ActiveUserOnly       Preview/download file

  GET          /api/Knowledge/dashboard                    ActiveUserOnly       Vault coverage dashboard

  POST         /api/GoldenAnswer                           ActiveUserOnly       Create Q&A pair

  PUT          /api/GoldenAnswer/{id}                      ActiveUserOnly       Update Q&A (versioned)

  DELETE       /api/GoldenAnswer/{id}                      ActiveUserOnly       Delete Q&A

  GET          /api/GoldenAnswer                           ActiveUserOnly       List Q&As

  POST         /api/GoldenAnswer/search                    ActiveUserOnly       Search Q&As

  POST         /api/Rag/chat                               ActiveUserOnly       RAG chat over knowledge vault

  POST         /api/export/templates                       ActiveUserOnly       Upload export template

  GET          /api/export/templates                       ActiveUserOnly       List templates

  PUT          /api/export/templates/{id}/set-default      ActiveUserOnly       Set tenant default template

  POST         /api/projects/{id}/export/docx              ActiveUserOnly       Export DOCX

  POST         /api/projects/{id}/export/pdf               ActiveUserOnly       Export PDF

  POST         /api/projects/{id}/export/rtl               ActiveUserOnly       Export Arabic RTL DOCX

  POST         /api/projects/{id}/export/excel             ActiveUserOnly       Export Excel (no template)

  GET          /api/projects/{id}/export/jobs              ActiveUserOnly       List export jobs

  GET          /api/export/jobs/{jobId}                    ActiveUserOnly       Export job status

  GET          /api/export/jobs/{jobId}/download           ActiveUserOnly       Download exported file
  --------------------------------------------------------------------------------------------------------------------------

## 4.1 Testing

A repository-wide search for test projects and spec files was performed as part of preparing this documentation. Result: there is no dedicated automated test project in the backend solution (no \*.Tests.csproj exists alongside BidFast.APIs / BidFast.BLL / BidFast.DAL / BidFast.Common), and the Angular frontend contains exactly one spec file --- src/app/app.spec.ts --- which is the unmodified default generated by the Angular CLI (\"should create the app\", \"should render router outlet\"). No custom unit, service, or component tests exist for any of the \~35+ components or 11+ services described in this document.

***Note:** This is stated plainly rather than fabricated: no unit test suite, integration test suite, system test suite, or formal UAT process currently exists in the repository. What was actually used during development was manual, exploratory testing via the BidFast.APIs.http REST client file (checked into the API project) and the built-in Swagger/Scalar OpenAPI UI exposed by Program.cs.*

## 4.2 Unit Testing

Not implemented. No xUnit/NUnit/MSTest project references any of the four backend projects, and angular.json\'s schematics are configured with skipTests: true, so newly generated Angular components do not receive spec files by default.

## 4.3 Integration Testing

Not implemented. No test project exercises AppDbContext against a real or in-memory SQL Server instance, and no test exercises the Semantic Kernel agent pipeline end-to-end.

## 4.4 System Testing

Not implemented as an automated suite. End-to-end verification during development was done manually: running the API and SPA locally, exercising the full RFP → orchestrate → research → write → review → gap-report → export flow through the UI.

## 4.5 User Acceptance Testing (UAT)

No formal UAT process or sign-off record exists in the repository. This is listed as a gap to close before the platform could be considered production-ready, and is referenced again in Chapter 6.

## 4.6 Testing Strategy & Rationale

Although no automated suite exists yet, the architecture is structured to make adding one straightforward: every BLL manager/service is exposed through an interface and resolved via DI, so unit tests could mock IUnitOfWork and individual repositories without touching a real database, and the Result-pattern (GeneralResult\<T\>) makes asserting on success/failure paths simpler than exception-based control flow would. Establishing even a thin xUnit + Angular Testing Library suite around the five AI agent services and the auth flow would materially reduce regression risk given how central they are to the product.

## 4.7 Deployment

No Dockerfile or docker-compose.yml exists anywhere in either the Back-End or Front-end repositories (confirmed by a recursive search of both trees). The original proposal\'s fully containerized, docker-compose-orchestrated stack (Angular + .NET API + Qdrant + SQL/Postgres) has not been built. The application currently runs as two separately started local processes during development: the .NET Web API (dotnet run / IIS Express via Properties/launchSettings.json) and the Angular dev server / SSR Node process (ng serve or node dist/BidFast/server/server.mjs).

## 4.8 Server & Environment Setup

Backend configuration lives in BidFast.APIs/appsettings.json: SQL Server connection string (BidFastDB), JWT settings (issuer/audience/secret/expiry), SMTP settings, and the AI-related settings blocks (SemanticKernel: ApiKey/BaseUrl/ChatModel pointing at the ITI API endpoint with deepseek.v3.2; OpenAi: ApiKey/BaseUrl/EmbeddingModel pointing at OpenRouter with text-embedding-3-small; Qdrant: Host/Port/CollectionName/VectorSize). CORS is restricted to an AllowedOrigins list (default http://localhost:4200) with credentials enabled. Frontend configuration is split across environment.ts / environment.development.ts for the API base URL.

## 4.9 Security Hardening

Applied so far: JWT secret length validated at startup (fails fast below 32 characters); SuperAdmin seed password moved from a hardcoded appsettings.json value to the SUPERADMIN_SEED_PASSWORD environment variable; MailKit/MimeKit upgraded to 4.17.0 to close a known vulnerability (NU1902); GlobalExceptionMiddleware registered so unhandled exceptions never leak stack traces to clients. Not yet applied (see 2.2.2 for the full list): moving the JWT signing key itself out of source control, hashing refresh tokens at rest, and wrapping tenant+admin creation in a transaction.

## 4.10 Database Migration

Schema changes are managed entirely through EF Core Migrations (dotnet ef migrations add / dotnet ef database update). 37 migrations exist, from InitialCreation (2026-06-15) through FixShadowForeignKeyAndSentinel (2026-07-01), tracking the schema\'s evolution from initial Identity setup through the RFP domain, the five-agent pipeline\'s supporting tables, and the export module. No seed-data migration strategy beyond code-based role/SuperAdmin seeding in Program.cs was found.

## 4.11 Application Deployment

Not automated. There is no CI/CD pipeline definition (no .github/workflows, no azure-pipelines.yml) in either repository at the time of writing. Deployment today is manual: publish the .NET API (dotnet publish) to a host, build the Angular app (ng build) and serve either the static browser bundle or run the SSR server bundle via Node/Express, and point both at a reachable SQL Server and Qdrant instance.

## 4.12 Additional Considerations

-   Environment-specific configuration should be externalized (secrets, connection strings) before any deployment beyond a local developer machine.

-   Qdrant\'s Host is configured as \"localhost\" in appsettings.json, implying a co-located or Docker-forwarded instance during development --- this needs to become a real reachable host/port pair in any shared or production environment.

-   CORS\'s AllowedOrigins list must be updated for any non-localhost frontend origin.

## 4.13 Post-Deployment Tasks

-   Rotate the JWT signing key and SMTP credentials to environment-specific values.

-   Verify the SuperAdmin seed account was created (or intentionally skipped) via the SUPERADMIN_SEED_PASSWORD mechanism.

-   Confirm the Qdrant collection (knowledge_chunks, 1024-dim, cosine) was initialized by IVectorStoreManager.InitializeAsync() on first boot.

-   Smoke-test the full agent pipeline end-to-end (orchestrate → research → write → review → gap-report → export) against the deployed environment.

## 4.14 Application Screenshots

Per project decision, this revision of the documentation uses labeled placeholders rather than live screenshots. Replace each block below with an actual capture of the running application.

### Login Page

![](./media/image1.png){width="6.768055555555556in" height="3.057638888888889in"}

### 

### 

### 

### 

### 

### 

### Dashboard

### ![](./media/image2.png){width="6.768055555555556in" height="3.0590277777777777in"}

### 

### 

### RFP Creation Page

### ![](./media/image3.png){width="6.768055555555556in" height="3.0590277777777777in"}

### 

### 

### 

### 

### 

### 

### 

### 

### 

### Bid Submission Page

### ![](./media/image4.png){width="6.768055555555556in" height="3.045138888888889in"}

### 

### 

### AI Proposal Workspace

### ![](./media/image5.png){width="6.768055555555556in" height="3.0625in"}

### 

### 

### 

### 

### 

### ![](./media/image6.png){width="6.768055555555556in" height="3.0625in"}Admin Panel

# Chapter 5

# AI-Powered Proposal Workspace

## Purpose of the AI Proposal Workspace

The AI Proposal Workspace (AiWorkspaceComponent and its six sub-components, routed at /app/ai-workspace/:projectId) is the environment where the five-agent pipeline\'s output is monitored and reviewed by a human bid team member. It exists to keep the reviewer oriented at all times: aware of the original requirement being addressed, able to trace generated content back to its source, and in control of whether the pipeline proceeds past its Go/No-Go checkpoint.

## Key Elements of the Multi-Agent Pipeline

The Workspace surfaces the same five agents described in Chapter 3.4 (Orchestrator, Researcher, Writer, Critic, Gap Analyst) through dedicated UI regions: a split-screen editor (SplitEditorComponent), a live pipeline/phase tracker (AiStreamingComponent), a citation browser (CitationPaneComponent), a requirement-compliance matrix (ComplianceChecklistComponent), section-level review feedback (CriticReviewComponent), and the coverage/Go-No-Go decision surface (GapAnalystComponent).

## Model & Prompt Design

All five agents share a single chat model, deepseek.v3.2, reached through the ITI API endpoint configured in SemanticKernelSettings, wrapped by Semantic Kernel\'s IChatCompletionService abstraction (ItiApiChatCompletionService). Each agent uses a distinct system prompt tuned to its task:

-   Orchestrator --- instructed to group extracted requirements into typed, prioritized proposal sections and return strict JSON (fenced \`\`\`json blocks are stripped before parsing).

-   Researcher --- not itself a chat-model prompt; it is a retrieval step (Golden Answer lookup, then embedding + Qdrant similarity search with keyword-boost) that decides per section whether to hand the Writer a grounded context block or flag a knowledge gap.

-   Writer --- instructed to act as \"a professional bid writer\", produce 150--400 words per section, omit section headings, and prioritize any content sourced from a Golden Answer over general research chunks.

-   Critic --- instructed to check five criteria (requirement coverage, factual contradictions, ungrounded claims against the supplied source material, professional tone, numeric-constraint satisfaction) and return one of Approved / NeedsRevision / Escalated.

-   Gap Analyst --- instructed to assign a severity (Critical/High/Medium/Low) and a remediation suggestion per gap, then produce an executive summary and a Go / Conditional / No-Go rationale from the aggregated coverage score.

## Backend Integration (.NET 10, Orchestration Layer)

Each agent is a scoped BLL service (OrchestratorService, ResearcherService, WriterService, CriticService, GapAnalystService) invoked by its own controller (OrchestratorController, ResearcherController, WriterController, CriticController, GapAnalystController), all under /api/projects/{id}/\... All agent calls are tenant-scoped: every service method takes an explicit tenantId alongside the projectId/sectionId and passes it down to the DAL repositories (e.g., GetByProjectIdAsync(projectId, tenantId)-style calls), consistent with the manual-tenant-filtering pattern described in section 2.2.4. The Researcher\'s retrieval step calls QdrantVectorStoreManager.SearchAsync(vector, tenantId, topK, documentId?), which adds a tenantId filter condition to every Qdrant query against the single shared knowledge_chunks collection.

## Frontend Integration (Angular, SignalR Streaming)

***Note:** This heading is reproduced verbatim from the documentation template, but the implementation it describes does not use SignalR. No \@microsoft/signalr package is installed, and no HubConnection/Hub class exists anywhere in the Angular or .NET source. What is actually implemented is PipelineOrchestratorService, which drives a phase state machine (idle → research → gap1 → awaiting_decision → writing → critic → gap2 → done/declined/error) by calling each agent endpoint over ordinary HTTP, in sequence, and pushing each response into Angular Signals (WorkspaceStateService.agentFeed, streamContent, criticReviews, gapReport). The UI updates as each HTTP call resolves, which looks similar to live streaming but is not token-by-token push delivery. True SignalR/WebSocket streaming is listed under Future Work in Chapter 6.*

## Security

Every Workspace-facing endpoint requires the ActiveUserOnly policy (authenticated + password-change-complete), and every query is additionally scoped to the caller\'s TenantId at the repository level, so a user cannot address another tenant\'s BidProject/ProposalSection/WrittenSection records even with a valid token for a different tenant.

## Testing

As stated in Chapter 4, no automated tests cover the Workspace components or the agent services. Manual testing was the only verification method used during development.

## Deployment

The Workspace ships as part of the single Angular SSR bundle and calls the same .NET API instance as the rest of the application; it has no separate deployment unit or configuration beyond the shared appsettings.json AI settings (SemanticKernel, OpenAi, Qdrant blocks) described in section 4.8.

## Maintenance and Updates

-   The Researcher\'s gap threshold (GapThreshold = 0.60) and the Critic\'s retry ceiling (MaxRevisionCycles = 2) are hardcoded constants in their respective services; making them tenant-configurable (as the RAG retrieval settings section of the original proposal envisioned) is a natural next step.

-   The chat and embedding models are swappable via appsettings.json (SemanticKernel:ChatModel, OpenAi:EmbeddingModel) without code changes, but there is no per-tenant model selection UI yet.

-   Because chunking, embedding, and retrieval were hand-rolled rather than using LlamaIndex (see 3.4.1), any future improvement to retrieval quality (BM25 hybrid search, cross-encoder reranking) will need to be implemented directly against Qdrant rather than inherited from a RAG framework.

## Conclusion

The AI Proposal Workspace delivers the core value proposition of BidFast --- an AI-assisted, requirement-traceable, source-grounded drafting environment --- using a simpler, single-stack architecture than originally proposed. The trade-off for that simplicity is that several proposal-level guarantees (real-time streaming, a hard entailment-based hallucination gate, hybrid/reranked retrieval) are not yet present and are tracked explicitly as Future Work rather than silently dropped.

## 

## 

## 

## 

## 

## Output Screenshots

### ![](./media/image7.png){width="6.768055555555556in" height="3.2180555555555554in"}

### 

### 

### 

### 

# Chapter 6

# Maintenance, Support and Conclusion

## Conclusion

BidFast delivers a working, end-to-end AI-assisted RFP response pipeline: multi-tenant identity and RBAC, a knowledge vault with semantic search and a Golden Answer library, automated RFP requirement extraction, a five-agent Semantic-Kernel-driven drafting pipeline with a human Go/No-Go checkpoint, and a multi-format export engine with tenant-template support. The team made a deliberate, documented architectural substitution --- Semantic Kernel inside .NET instead of a separate Python/FastAPI + CrewAI + LlamaIndex microservice --- that simplified the deployment topology at the cost of some retrieval sophistication and agent-orchestration abstraction. Several proposal-level capabilities (real-time SignalR streaming, an enforced hallucination-entailment gate, Arabic NLP tooling, SSO, e-signature, CRM/ERP integrations, portal auto-connectors, and automated testing/containerized deployment) were not implemented within the graduation-project timeline and are captured below as Future Work rather than implied to exist.

## Key Takeaways

-   The N-Tier Clean Architecture (APIs/BLL/DAL/Common) with Repository + Unit of Work + GeneralResult\<T\> gave the team a consistent, testable-in-principle structure across 18 controllers and 30+ services, even though an automated test suite was not built.

-   Replacing the proposed Python AI microservice with in-process Semantic Kernel removed a deployment unit and a network boundary, at the cost of hand-rolling RAG steps that LlamaIndex would otherwise have provided.

-   Manual, per-repository tenant filtering (rather than EF Core global query filters) works but is more fragile than a centrally enforced approach --- this is the single highest-value architectural improvement identified for a post-graduation iteration.

-   The AI pipeline\'s core loop (Orchestrate → Research → Write → Critic-with-retries → Gap Analyst) is implemented end-to-end and matches the proposal\'s five-agent concept, but several of its \"hard guarantee\" details (0.72 vs. 0.60 confidence threshold, an entailment-score hallucination gate) were simplified in the actual build.

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Proposal Item**                                               **Actual Implementation**
  --------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------
  Python/FastAPI + CrewAI + LlamaIndex AI microservice            Replaced by Microsoft Semantic Kernel running in-process inside the .NET backend (settled decision, see 3.4.1)

  PostgreSQL relational database                                  SQL Server via EF Core 10

  Qdrant vector database                                          Implemented as proposed

  BGE-M3 multilingual embeddings                                  OpenAI-compatible text-embedding-3-small via OpenRouter/ITI API

  Researcher confidence threshold 0.72                            Implemented as 0.60 (GapThreshold constant)

  Critic entailment-score hallucination gate (block below 0.65)   Not implemented --- grounding check is prompt-level guidance only

  SignalR real-time token-by-token streaming                      Not implemented --- sequential HTTP calls drive Angular Signals instead

  Redis SignalR backplane                                         Not implemented (no SignalR to back-plane)

  Arabic NLP pipeline (morphology, diacritics, NER)               Not implemented --- RTL export only, no Arabic-aware retrieval or client i18n

  Etimad / Munaqasat portal auto-connector                        Not implemented --- manual RFP upload only

  E-signature integration (DocuSign / Adobe Sign)                 Not implemented

  BOQ Auto-Fill with Financial Agent                              Not implemented

  SSO (SAML 2.0 / OIDC / SCIM)                                    Not implemented --- JWT + cookie auth only

  CRM/ERP integrations                                            Not implemented

  Tenant impersonation, feature flags, kill-switch                Not implemented

  EF Core global query filters for tenant isolation               Not implemented --- manual per-repository tenantId filtering instead

  Docker Compose / containerized deployment                       Not implemented --- no Dockerfile or compose file in either repository

  Automated test suite (unit/integration/UAT)                     Not implemented --- manual testing only
  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Future Work

The list that follows captures capabilities envisioned in the team\'s initial technical blueprint but absent from the shipped codebase, verified by a direct source search across both repositories. The Python/FastAPI + CrewAI + LlamaIndex replacement is excluded from this list, since that substitution is a settled architectural decision (Chapter 3.4.1) rather than an open item.

## Planned Feature Enhancements

-   Real-time SignalR/WebSocket streaming of agent status and token-by-token draft generation, replacing today\'s sequential-HTTP-driven phase machine.

-   An enforced, entailment-score-based hallucination gate in the Critic agent (proposal specified blocking claims below a 0.65 entailment score) --- today the Critic\'s grounding check is prompt-level guidance only, with no computed score or hard block.

-   Orchestrator dynamic re-planning when the Researcher returns a low-confidence result for a critical requirement --- today the Orchestrator makes one deterministic pass with no feedback loop back from the Researcher.

-   Tenant impersonation for Super Admin support escalations, with full audit logging.

-   A platform-wide feature-flag system with per-tenant gradual rollout and an emergency kill-switch.

-   Golden Answer expiry dates with automatic pre-expiry review notifications.

-   Win/Loss analytics with competitor-name tracking and correlation between vault coverage score and win rate.

## Scalability & Infrastructure Improvements

-   A Redis-backed SignalR backplane to allow the API to scale horizontally once real-time streaming (above) is implemented.

-   Containerized deployment: a Dockerfile per service and a docker-compose stack (Angular + .NET API + SQL Server + Qdrant), plus an eventual on-premise/air-gapped deployment package for government or defense clients who cannot use external cloud LLM providers.

-   A CI/CD pipeline (build, migrate, test, deploy) --- none exists today.

## Additional AI Agent Capabilities

-   A native Arabic NLP pipeline (morphological analysis, diacritic/tashkeel normalization, root-based stemming, Arabic Named Entity Recognition) --- today Arabic support is limited to the Writer\'s ContentArabic field and RTL DOCX/PDF export; there is no Arabic-aware retrieval or client-side i18n/RTL UI.

-   A Regional Compliance Rules Engine (Saudi NUSANED local-content rules, Nitaqat/Saudization, UAE Emiratization, KSA/UAE/Egypt VAT rates, ZATCA e-invoicing awareness).

-   BOQ Auto-Fill driven by a dedicated Financial Agent, mapping tenant pricing data into client-supplied Excel BOQ templates with per-cell confidence indicators.

-   E-signature integration (DocuSign / Adobe Sign) for the internal sign-off sequence before export/submission.

-   Enterprise SSO: SAML 2.0 / OpenID Connect, native Azure AD / Okta / Google Workspace connectors, and SCIM 2.0 provisioning.

-   CRM/ERP connectors (Salesforce, HubSpot, SAP, Oracle NetSuite) and project-management connectors (Jira, Asana) to auto-populate client data and push won-bid outcomes.

-   An Etimad (KSA) / Munaqasat (UAE) portal auto-connector to ingest new tenders automatically instead of requiring manual upload.

-   A Knowledge Vault template marketplace (pre-built starter vaults per sector/market).

## Mobile Application Extension

A native or cross-platform mobile companion app (for reviewing bid status, approving/declining the Gap Analyst\'s Go/No-Go recommendation, and receiving deadline alerts on the go) is a natural extension once the platform\'s notification system moves beyond in-app signals to real push delivery. No mobile work has been started; this is a forward-looking item rather than something derived from the current codebase or the original proposal.

# Table of References

Internal project documents (this repository):

-   Back-End/API-Documentation.md --- endpoint-level API reference maintained by the team.

-   Back-End/important to read/CHANGELOG.md --- dated log of notable backend changes.

-   Back-End/important to read/CHANGES_FIXED.md --- record of 12 applied fixes (security, DI, data-integrity).

-   Back-End/important to read/Some_Mistakes_Could_Happen.md --- internal security/quality audit (2 Critical, 4 High, 15 Medium, 17 Low findings).

Project source documents:

-   \"xNext-Gen Agentic AI RFP Platform --- Technical & Strategic Blueprint (Final Version)\" --- the original strategic proposal this graduation project is derived from.

-   \"BidFast --- AI-Powered B2B Bidding & RFP Platform --- Graduation Project Documentation Template\" --- the template this document follows section-for-section.

External references cited in the original proposal:

-   \[1\] https://www.qorusdocs.com

-   \[2\] https://www.v7labs.com

-   \[3\] https://www.linkedin.com

-   \[4\] https://eaglobal.ai

-   \[5\] https://ai-marketinglabs.com

-   \[6\] https://www.qorusdocs.com

-   \[7\] https://datagrid.com

-   \[8\] https://www.datagrid.com

-   \[9\] https://www.linkedin.com

-   \[10\] https://www.youtube.com

-   \[11\] https://www.linkedin.com

-   \[12\] https://www.youtube.com

-   \[13\] https://www.sparrowgenie.com

-   \[14\] https://autorfp.ai

-   \[15\] https://www.sia-partners.com

-   \[16\] https://www.linkedin.com

-   \[17\] https://www.linkedin.com

-   \[18\] https://dev.to

-   \[19\] https://deeprfp.com

Technical references (added for this documentation revision):

-   \[20\] Microsoft --- Semantic Kernel documentation, https://learn.microsoft.com/en-us/semantic-kernel/overview/

-   \[21\] Microsoft --- Entity Framework Core documentation, https://learn.microsoft.com/en-us/ef/core/

-   \[22\] Lewis, P. et al. --- \"Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks,\" https://arxiv.org/abs/2005.11401
