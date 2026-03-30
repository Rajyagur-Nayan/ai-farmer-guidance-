from typing import Dict, Any

def validate_response(output: Dict[str, Any]) -> Dict[str, Any]:
    """
    Applies safety guardrails to AI-generated agricultural advice.
    """
    confidence = float(output.get("confidence", "0.8"))
    
    # Rule 1: Risky Financial Advice Check
    if "loan" in str(output).lower() or "invest all" in str(output).lower():
        output["risk_alert"] = "⚠️ Alert: This contains financial advice. Verify with a bank or credit society."
        
    # Rule 2: Confidence Warning
    if confidence < 0.6:
        output["final_action"] = "⚠️ [UNSTABLE] " + output.get("final_action", "")
        output["risk_alert"] = "Caution: Low data confidence. Consult a local expert."
        
    # Rule 3: Extreme Recommendations
    if "destroy" in str(output).lower() or "abandon" in str(output).lower():
        output["risk_alert"] = "Critical: Extreme action detected. Verify with Agri-Dept."
        
    return output
