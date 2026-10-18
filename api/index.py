import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
backend_dir = os.path.join(root_dir, "backend")

for d in [backend_dir, root_dir]:
    if d not in sys.path:
        sys.path.insert(0, d)

try:
    from backend.app import app
except ImportError:
    from app import app
