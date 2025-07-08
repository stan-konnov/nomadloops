from os import curdir, getenv
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

HOST = str(getenv("HOST"))
PORT = int(str(getenv("PORT")))
VERSION = str(getenv("VERSION"))
REDIS_URL = str(getenv("REDIS_URL"))
ENVIRONMENT = str(getenv("ENVIRONMENT"))
LLM_MODEL_ID = str(getenv("LLM_MODEL_ID"))
DEFAULT_BUDGET = float(str(getenv("DEFAULT_BUDGET")))
HUGGINGFACE_API_URL = str(getenv("HUGGINGFACE_API_URL"))
HUGGINGFACE_API_TOKEN = str(getenv("HUGGINGFACE_API_TOKEN"))

ROOT_DIR = Path(curdir).resolve()
PROMPTS_DIR = Path(f"{ROOT_DIR}/app/prompts")
