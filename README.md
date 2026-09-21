# 🤖 AI Study Assistant

A full-stack study tool that lets you upload lecture notes and instantly get AI-generated answers, summaries, quiz questions, and flashcards — built to demonstrate practical LLM API integration alongside a REST backend and modern frontend.

## Overview

Students can upload `.txt` or `.pdf` notes, then ask questions about them, generate a summary, produce quiz questions, or create flashcards — all grounded in the actual uploaded content rather than generic AI knowledge, via prompt engineering that includes the notes directly in each request.

## Screenshots

![Study Assistant](./screenshots/ai-study-img1.png)
![Study Assistant](./screenshots/ai-study-img2.png)

## Features

- Upload study notes as `.txt` or `.pdf`, with automatic text extraction
- Ask free-form questions, answered using only the uploaded notes as context
- One-click note summarization
- Automatic quiz question generation
- Automatic flashcard generation
- Fast responses via Groq's LLM inference API

## Tech Stack

**Backend**
- Python 3.13
- FastAPI
- Groq API (LLM inference, OpenAI-compatible chat completions format)
- PyPDF2 (PDF text extraction)
- Pydantic (request validation)
- python-dotenv (environment variable / secret management)

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS

## Architecture

```
React (TypeScript, Vite)
        ↓  fetch (multipart upload + JSON)
FastAPI
        ↓
Groq API (LLM inference)
```

Unlike the Finance Tracker project, this app has no database — uploaded notes are processed in memory per-request rather than persisted, since the "data" here is transient study content rather than records that need to be retrieved later.

## API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/upload` | Upload a `.txt` or `.pdf` file, returns extracted text |
| POST | `/ask` | Ask a question, answered using provided notes as context |
| POST | `/summarize` | Generate a summary of the provided notes |
| POST | `/quiz` | Generate quiz questions from the provided notes |
| POST | `/flashcards` | Generate flashcards from the provided notes |

Interactive API documentation is available via FastAPI's built-in docs at `/docs` when the backend is running.

## How to Run

### Prerequisites
- Python 3.11+
- Node.js (LTS)
- A free Groq API key from [console.groq.com](https://console.groq.com)

### Backend
```bash
cd ai-study-assistant
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Create a `.env` file in the project root:
```
GROQ_API_KEY=your_key_here
```

Then run:
```bash
uvicorn main:app --reload
```
The API starts at `http://127.0.0.1:8000`, with interactive docs at `/docs`.

### Frontend
```bash
cd study-assistant-frontend
npm install
npm run dev
```
The app is available at `http://localhost:5173`.

## What I Learned

- Integrating a third-party LLM API into a backend service, including prompt construction and grounding model responses in user-supplied context
- The "chat completions" request/response shape used industry-wide across LLM providers (Groq, OpenAI, and others share this same structure)
- Python fundamentals coming from a C# background: virtual environments as Python's answer to per-project dependency isolation, decorators as Python's equivalent to C# attributes, and Pydantic models as the equivalent of Data Annotations for request validation
- Handling file uploads in FastAPI (`UploadFile`) and extracting text from PDFs server-side
- Recognizing that several seemingly distinct AI features (Q&A, summarization, quiz generation, flashcard generation) are really the same underlying mechanic — one API call, with the prompt as the only real variable
- Managing secrets in a Python project using `.env` + `.gitignore`, and the difference between this pattern and .NET's User Secrets
- Debugging real environment issues: PowerShell execution policy blocking scripts, forgetting to run a server from the correct working directory, and losing track of which of two simultaneously-running local servers had stopped

## Future Improvements

- Persist uploaded notes and generated content (would require adding a database, currently everything is in-memory per request)
- Support for longer documents via chunking (this project sends the full notes text in every prompt, which works for short documents but would hit context length or cost limits on longer ones — this exact limitation is what Project 5, a RAG application, is designed to solve properly)
- User accounts, so students can save and revisit past uploads and generated study material
- Streaming responses (showing the AI's answer as it's generated, rather than waiting for the full response)
- Automated tests
