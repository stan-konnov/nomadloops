from os import getenv

from dotenv import load_dotenv

load_dotenv()

HOST = str(getenv("HOST"))
PORT = int(str(getenv("PORT")))
VERSION = str(getenv("VERSION"))
ENVIRONMENT = str(getenv("ENVIRONMENT"))
