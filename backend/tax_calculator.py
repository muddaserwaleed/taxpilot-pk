def calculate_tax(annual_income_pkr: float):
    tax = 0

    if annual_income_pkr <= 600000:
        tax = 0
    elif annual_income_pkr <= 1200000:
        tax = (annual_income_pkr - 600000) * 0.05
    elif annual_income_pkr <= 2200000:
        tax = 30000 + (annual_income_pkr - 1200000) * 0.15
    elif annual_income_pkr <= 3200000:
        tax = 180000 + (annual_income_pkr - 2200000) * 0.25
    elif annual_income_pkr <= 4100000:
        tax = 430000 + (annual_income_pkr - 3200000) * 0.30
    else:
        tax = 700000 + (annual_income_pkr - 4100000) * 0.35

    # Section 100D freelancer exemption
    # IT exporters registered with PSEB get reduced rate
    exemption_rate = 0.25
    tax_after_exemption = tax * (1 - exemption_rate)

    return {
        "income_pkr": round(annual_income_pkr, 2),
        "tax_before_exemption": round(tax, 2),
        "section_100d_savings": round(tax - tax_after_exemption, 2),
        "tax_after_exemption": round(tax_after_exemption, 2),
        "effective_rate": round((tax_after_exemption / annual_income_pkr) * 100, 2) if annual_income_pkr > 0 else 0
    }