_**AI Governance Layer MVP**_

Model Registry • Maturity Scoring • Runtime Validation

**Overview**

This project demonstrates a lightweight AI Governance Layer designed to safely integrate multiple AI Proofs of Concept (POCs) into a centralized enterprise platform (Project X).

It enforces:

Controlled AI scaling

Production readiness validation

Risk & PII governance

Runtime enforcement before invocation

Audit visibility

**Principle**: _Standardize integration, not the innovation._

__________________________________________________________________

**Architecture**
Diagram Attached

_Provides:_

Model registration

Portfolio visibility

Validation demo UI

Model Registry Stores

Owner

Vendor

Risk level

PII usage

SLA & logging status

Security review state

Maturity Scoring

Scoring is based on objective governance criteria.

Audit Logging

_Tracks:_

Model registration

Governance validation

Decision outcomes

Ensuring transparency and traceability.
_____________________________________________________________

**Tech Stack**

_Backend_

	Node.js
	Express
	PostgreSQL
	pg
	Zod

_Frontend_

	Next.js (App Router)
	React
	Custom CSS (corporate theme)

_Infrastructure_

	Docker
	PostgreSQL container

_____________________________________________________________

**Run Locally**

_1. Clone the GIT Repo_

_2. Start PostgreSQL (Docker)_


docker run \
  --name governance-db \
  --env POSTGRES_USER=postgres \
  --env POSTGRES_PASSWORD=postgres \
  --env POSTGRES_DB=governance \
  -p 5432:5432 \
  --volume "<absolute-path>/infra:/docker-entrypoint-initdb.d" \
  -d postgres:16

_3. Start Backend_


Create .env inside /api:

DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/governance

cd api

npm install

npm run dev

Backend runs on:

http://localhost:4000

_4. Start Frontend_

Create .env.local inside /web:

NEXT_PUBLIC_API_BASE=http://localhost:4000

cd web

npm install

npm run dev

Frontend runs on:

http://localhost:3000

_____________________________________________________________

**Demo Flow**

Register model with:

PII enabled

Logging disabled

Security review pending

Validate for Production → ❌ DENY

Enable logging + SLA + approve security

Validate again → ✅ ALLOW

Demonstrates enforceable runtime governance.

_____________________________________________________________

**Evolution Path**

This MVP can evolve into a full AI Control Plane:

Traffic throttling

Cost governance

Vendor exposure monitoring

Drift detection

Policy-as-code engine

Real-time revocation

_____________________________________________________________

**Why This Matters**

AI at scale is not a modeling challenge — it is a governance and integration challenge.

This solution enables federated innovation while maintaining centralized enterprise control.
