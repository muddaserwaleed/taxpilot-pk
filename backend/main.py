from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tax_calculator import calculate_tax
from ai_helper import explain_tax, answer_question
from database import save_calculation, get_history
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "TaxPilot PK backend is running!"}

@app.get("/calculate")
def calculate(income_usd: float, exchange_rate: float = 278.0):
    income_pkr = income_usd * exchange_rate
    result = calculate_tax(income_pkr)
    result["explanation"] = explain_tax(result)
    save_calculation(result, income_usd)
    return result

@app.post("/chat")
def chat(question: str, income_pkr: float = 0):
    answer = answer_question(question, income_pkr)
    return {"answer": answer}

@app.get("/history")
def history():
    rows = get_history()
    return [
        {
            "id": r[0],
            "date": r[1],
            "income_usd": r[2],
            "income_pkr": r[3],
            "tax_before_exemption": r[4],
            "section_100d_savings": r[5],
            "tax_after_exemption": r[6],
            "effective_rate": r[7],
            "explanation": r[8]
        }
        for r in rows
    ]