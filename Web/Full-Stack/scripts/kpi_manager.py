import os
import json
import subprocess
import requests
from datetime import datetime

class AutomatedKPIManager:
    """
    Professional KPI Manager for the Finance System.
    Tracks success metrics automatically.
    """
    
    def __init__(self, backend_url="http://localhost:5000"):
        self.backend_url = backend_url
        self.report_path = "kpi_report.json"

    def run_check(self, name, cmd, cwd=None):
        print(f"Running {name}...")
        try:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=cwd)
            return result.returncode == 0
        except:
            return False

    def check_uptime(self):
        try:
            r = requests.get(f"{self.backend_url}/api/health", timeout=3)
            return r.status_code == 200
        except:
            return False

    def generate_report(self):
        # 1. Functional Success (Tests)
        tests_passed = self.run_check("Unit Tests", "./venv/bin/python3 -m pytest tests/", cwd="Web/Full-Stack/backend")
        
        # 2. Quality Success (Linting)
        lint_passed = self.run_check("Linting", "./venv/bin/python3 -m flake8 .", cwd="Web/Full-Stack/backend")
        
        # 3. Reliability (Uptime)
        is_up = self.check_uptime()
        
        report = {
            "project": "Finance Accounting System",
            "timestamp": datetime.now().isoformat(),
            "kpis": {
                "reliability_score": "PASS" if is_up else "FAIL",
                "quality_score": "PASS" if lint_passed else "FAIL",
                "functional_score": "PASS" if tests_passed else "FAIL"
            },
            "overall_health": "OPTIMAL" if (is_up and lint_passed and tests_passed) else "NEEDS_ATTENTION"
        }
        
        with open(self.report_path, 'w') as f:
            json.dump(report, f, indent=4)
            
        print(f"\n--- SUCCESS KPI REPORT ---")
        print(f"Overall Health: {report['overall_health']}")
        print(f"Reliability:    {report['kpis']['reliability_score']}")
        print(f"Quality:        {report['kpis']['quality_score']}")
        print(f"Functional:     {report['kpis']['functional_score']}")
        print(f"Report saved to {self.report_path}\n")

if __name__ == "__main__":
    manager = AutomatedKPIManager()
    manager.generate_report()
