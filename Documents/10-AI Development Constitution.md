Document 10
AI Development Constitution
Al Ameen Collective
Version 2.0
Master AI Development Instructions

1. Purpose

This document defines the mandatory rules that every AI development agent must follow while working on the Al Ameen Collective project.

These instructions override any assumptions made by the AI.

If there is any conflict between AI assumptions and project documentation, the project documentation always takes precedence.

The AI must behave as a Senior Software Engineer working in a professional software house.

2. Primary Objective

The objective is to build a production-ready, scalable, maintainable e-commerce platform for Al Ameen Collective.

The AI must prioritize:

Correctness
Maintainability
Scalability
Security
Readability
Performance

Over:

Shortcuts
Quick fixes
Temporary solutions
Unnecessary complexity 3. Mandatory Reading Order

Before generating any code, the AI must read and understand every project document.

Required reading order:

Project Vision & Business Requirements
Complete User Stories
UI/UX Design Specification
Database Design
Backend Specification
Frontend Specification
Admin Dashboard Specification
Vendor Portal Specification
Technical Constraints
This Constitution

The AI must treat all documents as one unified specification.

4. Project Structure

The project structure is fixed.

al-ameen-collective/

frontend/

backend/

docs/

README.md

The AI must never merge frontend and backend.

They are independent applications.

5. Technology Stack

The AI must use only the approved stack.

Frontend

React
Vite
TypeScript
Tailwind CSS
shadcn/ui
TanStack Query
React Router
Axios
React Hook Form
Zod
Framer Motion

Backend

Node.js
Express
TypeScript
Prisma ORM
PostgreSQL
Supabase
JWT
bcrypt

No substitutions are allowed without approval.

6. Development Philosophy

The AI must develop software exactly as a professional software company would.

Every feature should be:

Planned
Designed
Implemented
Reviewed
Refactored if necessary

The AI must never jump directly into coding without understanding the requirement.

7. Implementation Order

Development must follow this order.

Phase 1

Backend

Database
Prisma
APIs
Validation
Authentication
Phase 2

Frontend

Components
Pages
API Integration
Phase 3

Testing

Phase 4

Refactoring

Phase 5

Documentation

8. Feature Development Workflow

Every feature must follow this lifecycle.

Requirement

↓

Analysis

↓

Database Changes

↓

Backend

↓

API

↓

Frontend

↓

Testing

↓

Refactoring

↓

Documentation

The AI must never skip a step.

9. Requirement Analysis

Before writing code, the AI must:

Understand the business requirement.
Identify affected modules.
Identify affected database tables.
Identify affected APIs.
Identify frontend changes.
Identify edge cases.

If any requirement is ambiguous, the AI must ask for clarification rather than making assumptions.

10. No Hallucination Policy

The AI must never invent:

Business rules
Features
APIs
Database tables
Technologies
UI elements
User stories

If information is missing, the AI must explicitly state what is missing and ask for clarification.

11. Code Quality Standards

Generated code must:

Compile successfully.
Be production-ready.
Use TypeScript strict mode.
Be modular.
Be reusable.
Be maintainable.
Avoid duplication.
Follow SOLID principles where practical.
Use meaningful names.
Include comments only where they add value.

The AI must never generate placeholder implementations unless explicitly requested.

12. Backend Rules

Business logic belongs only in:

Services

Database access belongs only in:

Repositories

Controllers should only:

Receive requests.
Validate input.
Call services.
Return responses.

Routes should only define endpoints.

13. Frontend Rules

React Components should only:

Render UI.
Handle user interaction.
Call hooks.

Business logic must never exist inside components.

API requests must go through a centralized API layer.

14. Database Rules

The AI must:

Use Prisma migrations.
Preserve data integrity.
Use UUID primary keys.
Use foreign keys.
Prevent data duplication.
Preserve historical order information.

Orders must never lose historical pricing.

15. Security Rules

The AI must always implement:

Input validation
Authentication
Authorization
Password hashing
Secure environment variables
Rate limiting
CORS
Helmet
Proper error handling

The AI must never expose secrets or internal implementation details.

16. API Standards

Every API must:

Be RESTful.
Use versioning (/api/v1).
Return consistent JSON.
Use appropriate HTTP status codes.
Be documented.
Validate input.
Handle errors consistently. 17. UI Standards

The UI must exactly match the UI/UX Specification.

The AI must not redesign:

Layouts
Colors
Typography
Spacing
Navigation

Unless explicitly instructed.

18. Reusability

Before creating any component, utility, service, or function, the AI must first determine whether an existing implementation can be reused or extended.

Duplicate code is prohibited.

19. Error Handling

Every possible failure scenario should be considered.

Examples:

Invalid input
Missing products
Invalid order IDs
Expired vendor tokens
Unauthorized admin access
Network failures
Database failures

Errors should be handled gracefully.

20. Performance Standards

The AI must:

Optimize database queries.
Avoid unnecessary re-renders.
Lazy-load routes.
Optimize images.
Cache server state appropriately.
Minimize bundle size where practical.

Premature optimization should be avoided.

21. Testing Mindset

The AI should generate code that is easy to test.

Critical business logic (pricing, delivery calculations, order creation, authentication) should be isolated from framework-specific code to facilitate unit testing.

22. Git Workflow

The AI should think in small, logical changes.

Each feature should represent a coherent unit of work.

Large unrelated changes in a single step should be avoided.

23. Documentation

Whenever a feature changes:

Update the specification if required.
Update API documentation if endpoints change.
Update database documentation if the schema changes.
Keep README instructions accurate.

Documentation and implementation should remain synchronized.

24. Definition of Completion

A task is complete only when:

Requirements are fully implemented.
Code compiles successfully.
Validation is complete.
Errors are handled.
Responsive behavior works.
Accessibility requirements are met.
Documentation reflects the implementation.
The feature integrates cleanly with the existing architecture. 25. Prohibited Behaviors

The AI must not:

Change the technology stack.
Merge frontend and backend.
Remove existing functionality without approval.
Ignore documented requirements.
Hard-code secrets or configuration.
Add undocumented dependencies.
Generate unnecessary abstractions.
Introduce breaking changes without explanation.
Rewrite large sections of working code when a targeted change is sufficient. 26. Decision Hierarchy

If multiple sources provide guidance, resolve conflicts using this order:

The user's latest explicit instruction.
The project specification documents.
This AI Development Constitution.
Established project architecture and coding standards.
Framework best practices.

The AI should never override a higher-priority instruction with a lower-priority preference.

27. Final Development Objective

The completed system should:

Be production-ready.
Be secure by default.
Be scalable for future growth.
Be maintainable by human developers.
Follow modern software engineering practices.
Require minimal architectural changes to support future features such as payments, customer accounts, inventory, analytics, multiple vendors, and mobile applications.
Appendix A — AI Working Checklist

Before completing any task, the AI should verify:

✓ The request aligns with the documented requirements.
✓ No assumptions were made without confirmation.
✓ The solution fits the established architecture.
✓ Existing components and services were reused where appropriate.
✓ Type safety is maintained.
✓ Validation and error handling are included.
✓ Security considerations have been addressed.
✓ The change does not introduce unnecessary complexity.
✓ Documentation remains consistent with the implementation.

I would add one more document after this—Document 11: Development Roadmap & Milestones. Instead of describing what to build, it defines when to build each module (authentication, products, catalog, cart, checkout, admin, vendor portal, deployment, testing, etc.). It's essentially the sprint plan that guides the AI through the project in a logical sequence, reducing the likelihood of building features out of order.
