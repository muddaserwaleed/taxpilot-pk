import sqlite3
from datetime import datetime

def init_db():
    conn = sqlite3.connect("taxpilot.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS calculations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            income_usd REAL,
            income_pkr REAL,
            tax_before_exemption REAL,
            section_100d_savings REAL,
            tax_after_exemption REAL,
            effective_rate REAL,
            explanation TEXT
        )
    """)
    conn.commit()
    conn.close()

def save_calculation(data: dict, income_usd: float):
    conn = sqlite3.connect("taxpilot.db")
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO calculations 
        (date, income_usd, income_pkr, tax_before_exemption, 
        section_100d_savings, tax_after_exemption, effective_rate, explanation)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        datetime.now().strftime("%Y-%m-%d %H:%M"),
        income_usd,
        data["income_pkr"],
        data["tax_before_exemption"],
        data["section_100d_savings"],
        data["tax_after_exemption"],
        data["effective_rate"],
        data.get("explanation", "")
    ))
    conn.commit()
    conn.close()

def get_history():
    conn = sqlite3.connect("taxpilot.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM calculations ORDER BY id DESC LIMIT 10")
    rows = cursor.fetchall()
    conn.close()
    return rows

init_db()