import os
import json
from datetime import datetime
from typing import List, Dict, Any

# Simple in-memory storage for logging, or file-based for persistence
LOG_FILE = "ai_agent_reasoning.log"

def log_decision(
    inputs: Dict[str, Any],
    data_sources: List[str],
    rules_applied: List[str],
    ai_reasoning: str,
    final_decision: Dict[str, Any]
):
    """
    Records the logic behind the AI's final advice for transparency.
    """
    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "inputs": inputs,
        "data_sources": data_sources,
        "rules_applied": rules_applied,
        "ai_reasoning": ai_reasoning,
        "final_decision": final_decision
    }
    
    try:
        with open(LOG_FILE, "a") as f:
            f.write(json.dumps(entry) + "\n")
    except Exception as e:
        print(f"Logging Failure: {e}")

def get_logs(limit: int = 10) -> List[Dict[str, Any]]:
    """
    Retrieves latest AI logs with robust line parsing.
    """
    logs = []
    try:
        if not os.path.exists(LOG_FILE):
             return []
             
        with open(LOG_FILE, "r") as f:
            lines = f.readlines()
            for line in reversed(lines):
                if not line.strip():
                    continue
                try:
                    logs.append(json.loads(line))
                    if len(logs) >= limit:
                        break
                except json.JSONDecodeError:
                    # Skip malformed lines instead of crashing
                    print(f"Skipping malformed log line: {line[:50]}...")
                    continue
    except Exception as e:
        print(f"Log Read Error: {e}")
        return []
    return logs
