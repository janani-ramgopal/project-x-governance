🛡 AI Governance Layer MVP
Model Registry • Maturity Scoring • Runtime Validation
🚀 Overview

This project demonstrates a lightweight AI Governance Layer designed to safely integrate multiple AI Proofs of Concept (POCs) into a centralized enterprise platform (Project X).

It enforces:

Controlled AI scaling
Production readiness validation
Risk & PII governance
Runtime enforcement before invocation
Audit visibility

Principle: Standardize integration, not innovation.
Architecture
Project X
     ↓
Governance API (Node + Express)
     ↓
PostgreSQL (Model Registry)
     ↓
AI POCs


Frontend (Next.js) provides:
Model registration
Portfolio visibility
Validation demo UI

Central catalog storing:
Owner
Vendor
Risk level
PII usage
SLA & logging status
Security review state
Maturity Scoring - Scoring is based on objective governance criteria.

Audit Logging Tracks:
Model registration
Governance validation
Decision outcomes
Ensuring transparency and traceability.

Tech Stack
Backend
	Node.js
	Express
	PostgreSQL
	pg
	Zod
Frontend
	Next.js (App Router)
	React
	Custom CSS (corporate theme)
Infrastructure
	Docker
	PostgreSQL container

Run Locally
Start PostgreSQL (Docker)
docker run --name governance-db --env POSTGRES_USER=postgres --env POSTGRES_PASSWORD=postgres --env POSTGRES_DB=governance -p 5432:5432 --volume "<absolute-path>/infra:/docker-entrypoint-initdb.d" -detach postgres:16 

Start Backend
cd api
npm install
npm run dev
.env
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/governance

Runs on:
http://localhost:4000

Start Frontend
cd web
npm install
npm run dev


.env.local

NEXT_PUBLIC_API_BASE=http://localhost:4000


Runs on:
http://localhost:3000

Demo Flow

Register model with:

PII enabled

Logging disabled

Security review pending

Validate for Production → ❌ DENY

Enable logging + SLA + approve security

Validate again → ✅ ALLOW

Demonstrates enforceable runtime governance.

Evolution Path
This MVP can evolve into a full AI Control Plane:
Traffic throttling
Cost governance
Vendor exposure monitoring
Drift detection
Policy-as-code engine
Real-time revocation

Why This Matters
AI at scale is not a modeling challenge — it is a governance and integration challenge.
This solution enables federated innovation while maintaining centralized enterprise control.