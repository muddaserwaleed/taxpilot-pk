import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

def explain_tax(tax_data: dict):
    try:
        prompt = f"""
        You are a friendly Pakistani tax advisor. Explain this tax calculation 
        in simple plain English in 4-5 lines. Use PKR amounts. Be helpful and clear.
        
        Income: PKR {tax_data['income_pkr']:,.0f}
        Tax before exemption: PKR {tax_data['tax_before_exemption']:,.0f}
        Section 100D savings: PKR {tax_data['section_100d_savings']:,.0f}
        Final tax owed: PKR {tax_data['tax_after_exemption']:,.0f}
        Effective tax rate: {tax_data['effective_rate']}%
        """
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return "Your tax calculation is complete. Based on FBR 2024-25 brackets, Section 100D freelancer exemption has been applied to reduce your tax liability."

def answer_question(question: str, income_pkr: float):
    try:
        prompt = f"""
        You are a Pakistani FBR tax advisor helping a freelancer.
        Their annual income is PKR {income_pkr:,.0f}.
        Answer this question simply and clearly in 3-4 lines: {question}
        """
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return "I'm unable to answer right now due to API limits. Please try again in a moment."