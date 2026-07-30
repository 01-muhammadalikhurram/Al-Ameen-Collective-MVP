Document 00
Project Index
Al Ameen Collective
Version 2.0
Master Project Documentation Index

1. Purpose

This document serves as the central entry point for the entire Al Ameen Collective project documentation.

Every developer, AI development agent, or future contributor must read this document first before opening any other project file.

This document defines:

Project overview
Documentation structure
Reading order
Development rules
Document relationships
AI workflow
Repository structure

No implementation work should begin until all referenced documents have been reviewed.

2. Project Overview

Project Name

Al Ameen Collective

Project Type

Modern E-Commerce Platform

Primary Market

Pakistan

Architecture

Full Stack Web Application

Development Methodology

Agile Development

Feature-Based Development

Incremental Delivery

3. Project Goal

Develop a scalable, production-ready e-commerce platform for Al Ameen Collective that enables customers to browse and order products while allowing the business owner to manage products, pricing, orders, delivery, and vendor communication through a secure admin dashboard.

The first version intentionally avoids customer accounts and online payments to reduce complexity and accelerate deployment, while preserving an architecture that supports these features in future releases.

4. High-Level Architecture
   Customer Browser
   │
   ▼
   React + TypeScript Frontend
   │
   REST API (HTTPS)
   │
   ▼
   Node.js + Express Backend
   │
   Prisma ORM Layer
   │
   ▼
   PostgreSQL (Supabase Database)
   │
   ▼
   Supabase Storage (Images)

Only the backend communicates with the database.

The frontend communicates exclusively through REST APIs.

5. Repository Structure
   al-ameen-collective/

├── frontend/
│
├── backend/
│
├── docs/
│
├── README.md
│
├── .gitignore
│
└── LICENSE 6. Documentation Structure
docs/

00-Project-Index.md

01-Project-Vision-Business-Requirements.md

02-Complete-User-Stories.md

03-UI-UX-Design-Specification.md

04-Database-Design.md

05-Backend-Specification.md

06-Frontend-Specification.md

07-Admin-Dashboard-Specification.md

08-Vendor-Portal-Specification.md

09-Technical-Constraints.md

10-AI-Development-Constitution.md

11-Development-Roadmap-Milestones.md 7. Document Summary
Document 00

Project Index

Purpose:

Provides the entry point for the project, documentation map, architecture overview, and development rules.

Document 01

Project Vision & Business Requirements

Purpose:

Defines the business, project objectives, scope, stakeholders, business rules, and overall vision.

Document 02

Complete User Stories

Purpose:

Defines every user interaction for:

Customer
Admin
Vendor
Document 03

UI/UX Design Specification

Purpose:

Defines the complete visual design, branding, layouts, responsiveness, colors, typography, spacing, components, animations, and user experience.

Document 04

Database Design

Purpose:

Defines all entities, relationships, tables, constraints, and database architecture.

Document 05

Backend Specification

Purpose:

Defines backend architecture, APIs, authentication, business logic, validation, folder structure, and coding standards.

Document 06

Frontend Specification

Purpose:

Defines frontend architecture, routing, state management, components, API integration, and coding standards.

Document 07

Admin Dashboard Specification

Purpose:

Defines the complete administrator interface, workflows, management modules, and dashboard behavior.

Document 08

Vendor Portal Specification

Purpose:

Defines the secure, read-only portal used by vendors to fulfill customer orders.

Document 09

Technical Constraints

Purpose:

Defines mandatory technologies, architecture, coding standards, security requirements, and prohibited practices.

Document 10

AI Development Constitution

Purpose:

Defines how AI agents must behave while developing the project, including workflow, decision hierarchy, and development principles.

Document 11

Development Roadmap & Milestones

Purpose:

Defines the implementation sequence, project phases, milestones, testing strategy, deployment, and completion criteria.

8. Mandatory Reading Order

Every AI development agent must read the documents in the following order:

00

↓

01

↓

02

↓

03

↓

04

↓

05

↓

06

↓

07

↓

08

↓

09

↓

10

↓

11

Skipping documents is not permitted.

9. Document Dependency Map
   Project Vision
   │
   ▼
   User Stories
   │
   ▼
   UI/UX Design
   │
   ▼
   Database Design
   │
   ▼
   Backend Specification
   │
   ▼
   Frontend Specification
   │
   ▼
   Admin Dashboard
   │
   ▼
   Vendor Portal
   │
   ▼
   Technical Constraints
   │
   ▼
   AI Development Constitution
   │
   ▼
   Development Roadmap

Changes in an earlier document may require updates to all dependent documents.

10. Development Rules

All development must adhere to the following principles:

Frontend and backend remain separate applications.
The backend owns all business logic.
The frontend communicates only with the backend via REST APIs.
Prisma ORM is the exclusive database access layer.
PostgreSQL (Supabase) is the only production database.
No undocumented features may be added.
No changes to the technology stack without approval. 11. AI Operating Instructions

Before implementing any feature, the AI must:

Read this Project Index.
Review all related specification documents.
Identify impacted modules.
Confirm the requested work aligns with the documented requirements.
Implement only the requested scope.
Update documentation if the implementation changes the specification.

The AI must ask for clarification whenever requirements are incomplete or conflicting.

12. Versioning

All project documents should follow semantic versioning.

Example:

Version 2.0.0

Suggested rules:

Major: Breaking architectural or business changes.
Minor: New features or significant enhancements.
Patch: Documentation corrections, bug fixes, or clarifications.

Each document should include:

Version
Last Updated
Author
Status (Draft, In Review, Approved) 13. Change Management

Any change to:

Business rules
Database schema
API contracts
UI/UX
Technology stack
Security model

must be reflected in the relevant specification document before implementation begins.

14. Project Completion Criteria

The project is considered complete when:

All roadmap milestones have been achieved.
All specification documents are reflected in the implementation.
The application is production-ready.
Security, performance, and accessibility requirements are satisfied.
Documentation is synchronized with the codebase.
The system is deployable and maintainable.
