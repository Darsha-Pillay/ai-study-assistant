import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from groq import Groq
from fastapi import UploadFile, File
import PyPDF2
import io
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# Initializes Groq using GROQ_API_KEY from .env
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str
    context: str

@app.get("/")
def read_root():
    return {"message": "Study Assistant API is running"}

@app.post("/ask")
def ask_question(request: QuestionRequest):
    try:
        prompt = (
            f"You are a helpful study assistant. A student has provided the following notes:\n\n"
            f"{request.context}\n\n"
            f"Answer this question based on the notes above: {request.question}"
        )

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="openai/gpt-oss-20b",
        )

        return {"answer": chat_completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        content = await file.read()

        if file.filename.endswith(".pdf"):
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
        else:
            text = content.decode("utf-8")

        return {"filename": file.filename, "text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class TextRequest(BaseModel):
    text: str

@app.post("/summarize")
def summarize(request: TextRequest):
    try:
        prompt = f"Summarize the following study notes in a clear, concise way:\n\n{request.text}"
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="openai/gpt-oss-20b",
        )
        return {"summary": completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/quiz")
def generate_quiz(request: TextRequest):
    try:
        prompt = f"Based on the following notes, generate 5 quiz questions to test understanding. Number each question:\n\n{request.text}"
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="openai/gpt-oss-20b",
        )
        return {"quiz": completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/flashcards")
def generate_flashcards(request: TextRequest):
    try:
        prompt = f"Based on the following notes, generate 5 flashcards in the format 'Q: ... / A: ...':\n\n{request.text}"
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="openai/gpt-oss-20b",
        )
        return {"flashcards": completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))