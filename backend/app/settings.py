from os import curdir, getenv
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

HOST = str(getenv("HOST"))
PORT = int(str(getenv("PORT")))
VERSION = str(getenv("VERSION"))
REDIS_URL = str(getenv("REDIS_URL"))
ENVIRONMENT = str(getenv("ENVIRONMENT"))
OPENAI_API_KEY = str(getenv("OPENAI_API_KEY"))
DEFAULT_BUDGET = float(str(getenv("DEFAULT_BUDGET")))

ROOT_DIR = Path(curdir).resolve()
PROMPTS_DIR = Path(f"{ROOT_DIR}/app/prompts")
