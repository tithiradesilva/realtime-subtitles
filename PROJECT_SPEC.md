# SinhalaLive — Real-Time Sinhala Subtitle Chrome Extension

## 1. Project Overview

**Project Name:** SinhalaLive

**Project Type:** Chrome Extension + Lightweight Backend

**Primary Purpose:**

SinhalaLive is a lightweight Chrome Extension that provides real-time Sinhala subtitles for audio playing inside the current browser tab.

The primary use case is:

* Google Meet
* Microsoft Teams Web
* Discord Web
* Zoom Web
* YouTube
* Other browser-based meetings, calls, videos, or audio

The user installs the Chrome Extension, opens a meeting/call/video, clicks **Start Sinhala Subtitles**, and the extension captures the current tab's audio, sends audio to a backend speech-processing service, receives real-time transcription, and displays Sinhala subtitles as a floating overlay.

---

# 2. Primary Project Goal

The primary goal is **NOT** to build a large AI product.

The goal is to demonstrate the ability to:

1. Build a browser extension.
2. Capture browser-tab audio.
3. Process real-time audio.
4. Communicate through WebSockets.
5. Integrate a speech-to-text service.
6. Build a lightweight backend.
7. Containerize the backend.
8. Implement automated testing.
9. Implement CI/CD.
10. Deploy the application.
11. Implement application monitoring.
12. Implement health checks.
13. Implement logging.
14. Implement basic reliability practices.
15. Document and operate the system.

The project should therefore be treated as a **small production-style Platform Engineering / DevOps / SRE project**.

---

# 3. Core Product Requirement

The user should be able to perform this workflow:

```text
Install Extension
      ↓
Open Google Meet / Discord / Teams / YouTube
      ↓
Click SinhalaLive
      ↓
Click "Start Subtitles"
      ↓
Capture Current Tab Audio
      ↓
Stream Audio
      ↓
Speech-to-Text
      ↓
Receive Transcript
      ↓
Display Sinhala Subtitle
```

The subtitle should update continuously rather than waiting until the entire meeting ends.

---

# 4. MVP Definition

The MVP consists of ONLY the following features.

## Required Features

### Extension

* Chrome Manifest V3
* Popup interface
* Start/Stop subtitle button
* Current tab audio capture
* Floating subtitle overlay
* Real-time subtitle updates
* Basic subtitle settings
* Error state
* Connection state

### Backend

* FastAPI
* WebSocket endpoint
* Speech-to-text integration
* Health endpoint
* Readiness endpoint
* Structured logging
* Basic error handling
* Basic metrics

### Infrastructure

* Docker
* Docker Compose for local development
* GitHub Actions
* Container image build
* Container image security scan
* Cloud deployment
* HTTPS
* Environment-based configuration

### Observability

* Prometheus-compatible metrics
* Grafana dashboard
* Application logs
* Health monitoring
* Basic alerting/reliability demonstration

---

# 5. Explicit Non-Goals

The AI coding agent MUST NOT implement the following unless explicitly requested by the project owner.

Do NOT automatically add:

* User authentication
* User registration
* OAuth
* Database
* PostgreSQL
* MongoDB
* Redis
* Kafka
* RabbitMQ
* Kubernetes
* Helm
* Terraform
* ArgoCD
* Service mesh
* Microservices
* Payment system
* Subscription system
* Admin dashboard
* User profiles
* Meeting recording
* Meeting history
* AI meeting summaries
* Speaker identification
* Speaker diarization
* Chatbot
* Mobile application
* Desktop application
* Custom machine-learning model training
* Custom speech recognition model
* Multi-region infrastructure
* Auto-scaling infrastructure
* Complex caching
* Event-driven architecture
* Complex domain-driven design

The project must remain **small, understandable, deployable, and finishable within approximately one week**.

If a feature is not required for the core workflow or the Platform/DevOps/SRE demonstration, do not add it.

---

# 6. Design Philosophy

Follow these principles throughout development.

## Principle 1 — Simplicity First

Prefer:

```text
one backend
one container
one deployment
```

over:

```text
multiple services
multiple containers
Kubernetes
service mesh
```

The architecture should be appropriate for the project's size.

---

## Principle 2 — Production Practices Over Feature Count

A small application deployed properly is more valuable than a large application that is unfinished.

Prioritize:

* reliability
* observability
* security
* testing
* deployment automation
* documentation

over additional product features.

---

## Principle 3 — No Premature Abstraction

Do not create abstractions merely because they might be useful later.

Build what the current MVP requires.

---

## Principle 4 — No Premature Scalability

Do not design for millions of users.

The target is a small portfolio deployment.

However, architecture should remain reasonably extensible.

---

## Principle 5 — Explainable Engineering

Every major technical decision should be explainable.

The developer should understand:

* why the technology exists
* what problem it solves
* what tradeoffs it introduces

---

# 7. High-Level Architecture

```text
                         USER
                           │
                           ▼
                 ┌───────────────────┐
                 │ Chrome Extension  │
                 │                   │
                 │ Popup             │
                 │ Subtitle Overlay  │
                 │ Tab Audio Capture │
                 └─────────┬─────────┘
                           │
                           │ WebSocket
                           │
                           ▼
                 ┌───────────────────┐
                 │   HTTPS / Cloud   │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ FastAPI Backend   │
                 │                   │
                 │ WebSocket         │
                 │ Speech Service    │
                 │ Health Checks     │
                 │ Metrics           │
                 │ Logging           │
                 └─────────┬─────────┘
                           │
                           │ API
                           ▼
                 ┌───────────────────┐
                 │ Speech-to-Text    │
                 │ Provider          │
                 └─────────┬─────────┘
                           │
                           │ Transcript
                           ▼
                 ┌───────────────────┐
                 │ FastAPI Backend   │
                 └─────────┬─────────┘
                           │
                           │ WebSocket
                           ▼
                 ┌───────────────────┐
                 │ Subtitle Overlay  │
                 └───────────────────┘
```

---

# 8. Platform Architecture

```text
                         GitHub
                           │
                           │ git push
                           ▼
                  ┌─────────────────┐
                  │ GitHub Actions  │
                  └────────┬────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
            Lint         Tests       Security
              │            │            │
              └────────────┼────────────┘
                           │
                           ▼
                    Docker Build
                           │
                           ▼
                    Container Registry
                           │
                           ▼
                    Cloud Deployment
                           │
                           ▼
                  ┌─────────────────┐
                  │ FastAPI Server  │
                  └────────┬────────┘
                           │
               ┌───────────┼───────────┐
               │           │           │
               ▼           ▼           ▼
            Metrics      Logs      Health Check
               │           │
               ▼           ▼
          Prometheus    Log System
               │
               ▼
             Grafana
```

---

# 9. Component Responsibilities

## 9.1 Chrome Extension

The Chrome Extension is responsible for:

* User interaction
* Starting/stopping subtitle capture
* Requesting tab capture
* Communicating with the backend
* Receiving transcript messages
* Rendering subtitles
* Managing subtitle preferences
* Showing connection state
* Showing errors

The extension must NOT contain cloud API credentials.

---

# 10. Chrome Extension Architecture

Use Chrome Manifest V3.

Suggested structure:

```text
extension/
│
├── manifest.json
│
├── src/
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.ts
│   │   └── popup.css
│   │
│   ├── background/
│   │   └── service-worker.ts
│   │
│   ├── content/
│   │   ├── subtitle-overlay.ts
│   │   └── subtitle.css
│   │
│   ├── offscreen/
│   │   ├── offscreen.html
│   │   └── offscreen.ts
│   │
│   ├── audio/
│   │   └── audio-processor.ts
│   │
│   ├── websocket/
│   │   └── websocket-client.ts
│   │
│   └── types/
│       └── messages.ts
│
├── assets/
│
└── package.json
```

The exact structure can change if a simpler structure is justified.

---

# 11. Audio Capture Architecture

```text
Current Browser Tab
        │
        ▼
   tabCapture
        │
        ▼
    MediaStream
        │
        ▼
 Audio Processing
        │
        ├──────────────► Speakers
        │
        ▼
 WebSocket Streaming
```

Important: Capturing tab audio must not silence the meeting/video for the user.

---

# 12. Offscreen Document

Use a Chrome Offscreen Document for audio processing.

```text
Popup
  │
  ▼
Service Worker
  │
  ▼
Offscreen Document
  │
  ▼
Audio Processing
```

---

# 13. Backend Architecture

Use Python + FastAPI.

```text
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── api/
│   │   ├── health.py
│   │   └── websocket.py
│   │
│   ├── services/
│   │   ├── transcription.py
│   │   └── audio.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── logging.py
│   │   └── metrics.py
│   │
│   └── models/
│       └── messages.py
│
├── tests/
│   ├── test_health.py
│   ├── test_websocket.py
│   └── test_transcription.py
│
├── requirements.txt
├── Dockerfile
└── .dockerignore
```

Keep the backend stateless. No database in V1.

---

# 14. Backend API

## Health

```
GET /health
→ { "status": "healthy" }
```

## Readiness

```
GET /ready
→ { "status": "ready" }
```

## WebSocket

```
/ws/transcribe
```

---

# 15. WebSocket Message Design

Client → Server:
```json
{ "type": "audio", "data": "<audio-data>" }
```

Server → Client (interim):
```json
{ "type": "transcript", "text": "...", "final": false }
```

Server → Client (final):
```json
{ "type": "transcript", "text": "...", "final": true }
```

Error:
```json
{ "type": "error", "message": "..." }
```

Status:
```json
{ "type": "status", "status": "connected" }
```

---

# 16. Speech Recognition

Use a managed Speech-to-Text provider for V1. Do NOT train a custom model.

Primary target: Sinhala (si-LK)

Internal abstraction:
```text
WebSocket → SpeechService → Provider
```

---

# 17. Language Behavior

V1 priority:
- Sinhala → Sinhala
- English → Sinhala

---

# 18. Real-Time Requirement

```text
Audio Stream → Small Chunks → Streaming Processing → Interim Transcript → Final Transcript
```

---

# 19. Subtitle UI

Floating overlay injected into the active page.

Requirements:
* Fixed position, high readability
* Does not block whole page
* Adjustable font size, opacity, position
* Start/stop state, connection status

---

# 20. Subtitle State

```text
Connecting / Connected / Listening / Processing / Error / Stopped
```

---

# 21. Error Handling

Handle gracefully:
- No tab capture permission
- Backend unavailable
- Speech API unavailable
- WebSocket disconnect (limited reconnection with exponential backoff)

---

# 22. WebSocket Reliability

Exponential backoff: 1s → 2s → 4s → 8s → fail with user message.

---

# 23. Backend Logging

Structured logs. Do not log credentials, audio data, or complete conversations.

---

# 24. Observability

Three pillars: Metrics, Logs, Health. No tracing in V1.

---

# 25. Metrics

```text
http_requests_total
http_request_duration_seconds
http_errors_total
websocket_connections_active
websocket_connections_total
websocket_connection_errors_total
transcription_requests_total
transcription_errors_total
transcription_latency_seconds
```

---

# 26. Grafana Dashboard

One dashboard showing:
- Active Connections, Request Rate, Error Rate, Avg Latency, Transcription metrics

---

# 27–29. Health, Docker, Local Development

- Periodic health checks on `GET /health`
- Docker: small base image, non-root user, no secrets, `.dockerignore`
- Local: `git clone → configure .env → docker compose up → load extension`

---

# 30. Environment Configuration

```text
APP_ENV=development
LOG_LEVEL=INFO
SPEECH_PROVIDER=...
SPEECH_API_KEY=...
CORS_ORIGINS=...
```

Provide `.env.example`. Never commit secrets.

---

# 31. CI Pipeline

```text
Push → Checkout → Install → Lint → Tests → Docker Build → Security Scan
```

---

# 32. CD Pipeline

```text
CI pass → Build Image → Push → Deploy → Health Check → Done
```

---

# 33. HTTPS

Production: `wss://` only. Local dev: `ws://localhost` acceptable.

---

# 34. Secrets Management

Environment variables only. Never hardcode. Never commit. Never in extension.

---

# 35. Repository Structure

```text
sinhalalive/
├── extension/
├── backend/
├── infrastructure/
├── monitoring/
├── .github/workflows/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
├── ARCHITECTURE.md
├── CONTRIBUTING.md
└── PROJECT_SPEC.md
```

---

# 36. Testing Strategy

Backend minimum:
- `/health`, `/ready`, WebSocket connection, invalid message, service failure, config validation

Extension: manual testing of start, stop, subtitle rendering, reconnect, error state.

---

# 37. Performance Goals

Target perceived subtitle latency: **1–3 seconds**. Measure; do not claim.

---

# 38. Privacy Requirements

- Clearly indicate active capture
- Stop capture on user stop
- Do not store audio permanently
- Do not log raw audio or full conversations

---

# 39. Development Phases

```text
Phase 1 — Extension Skeleton       ✅ DONE
Phase 2 — Audio Capture            ✅ DONE
Phase 2B — Audio Extraction        ⏳ NEXT  (PCM chunks, log size/duration)
Phase 3 — Backend                  ⏳
Phase 4 — Speech Recognition       ⏳
Phase 5 — Subtitle Overlay         ⏳
Phase 6 — Productionization        ⏳
Phase 7 — CI/CD                    ⏳
Phase 8 — Observability            ⏳
Phase 9 — Reliability Testing      ⏳
```

---

# 40. Definition of Done

### Product
- [ ] Chrome Extension loads
- [ ] User can start subtitles
- [ ] User can stop subtitles
- [ ] Tab audio is captured
- [ ] User can still hear original audio
- [ ] Audio reaches backend
- [ ] Speech recognition works
- [ ] Sinhala subtitles appear
- [ ] Subtitles update in real time
- [ ] Basic settings work

### Backend
- [ ] FastAPI works
- [ ] WebSocket works
- [ ] Health endpoint works
- [ ] Readiness endpoint works
- [ ] Errors handled
- [ ] Structured logs

### Infrastructure
- [ ] Docker image works
- [ ] Docker Compose works locally
- [ ] Production deployment works
- [ ] HTTPS works
- [ ] No committed secrets

### CI/CD
- [ ] Automated tests
- [ ] Lint
- [ ] Docker build
- [ ] Security scan
- [ ] Automated deployment

### Observability
- [ ] Prometheus metrics
- [ ] Grafana dashboard
- [ ] Application logs
- [ ] Health monitoring

### Reliability
- [ ] WebSocket reconnect
- [ ] Backend restart tested
- [ ] Health failure tested
- [ ] Recovery tested

### Documentation
- [ ] README
- [ ] Architecture docs
- [ ] Local setup
- [ ] Deployment instructions
- [ ] Environment config
- [ ] Troubleshooting
- [ ] Engineering decisions

---

# 41. AI Coding Agent Rules

1. Read `PROJECT_SPEC.md` before modifying architecture.
2. Do not introduce unapproved technologies without asking.
3. Do not expand scope automatically.
4. No database unless requested.
5. No Kubernetes unless requested.
6. No authentication unless requested.
7. Never expose secrets in source code.
8. Prefer simple implementations.
9. Explain what, why, and tradeoffs before implementing a new component.
10. Do not rewrite working components unnecessarily.
11. Preserve existing architecture without clear technical reason to change.
12. Update `PROJECT_SPEC.md` and `ARCHITECTURE.md` when architecture changes permanently.

---

# 42. AI Coding Agent Workflow

```text
Understand → Inspect existing code → Identify changes → Explain approach
→ Implement smallest solution → Run tests → Check errors → Update docs
```

---

# 43. Technology Stack

| Layer | Technology |
|---|---|
| Extension | TypeScript, HTML, CSS, Chrome MV3, Web Audio API, WebSocket |
| Backend | Python, FastAPI, Uvicorn, WebSockets |
| AI | Managed Speech-to-Text (si-LK) |
| Testing | Pytest |
| Containers | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Observability | Prometheus, Grafana |

---

# 44. Final Project Principle

**SinhalaLive is intentionally a small application.**

The value comes from the engineering around it:

```text
Build → Test → Containerize → Deploy → Monitor → Break → Recover → Document
```

**Small enough to finish. Real enough to deploy. Observable enough to operate. Reliable enough to demonstrate SRE thinking. Simple enough to explain in an interview.**
