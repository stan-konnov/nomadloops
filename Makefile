BACKEND_DIR = backend
FRONTEND_DIR = frontend

VENV = $(BACKEND_DIR)/venv
UV = $(VENV)/bin/uv
PYTHON = $(VENV)/bin/python

.PHONY: help install install-backend install-frontend install-hooks venv init-env

help:
	@echo ""
	@echo "Common tasks:"
	@echo "  make install             - install all dependencies (backend + frontend + hooks)"
	@echo "  make install-backend     - install backend Python dependencies"
	@echo "  make install-frontend    - install frontend npm dependencies"
	@echo "  make install-hooks       - install pre-commit hooks"
	@echo "  make venv                - create Python virtual environment in backend/"
	@echo "  make init-env            - copy default .env files for backend & frontend"
	@echo ""

install: install-backend install-frontend install-hooks init-env

venv:
	@echo "🐍 Creating virtual environment in $(VENV)…"
	python3 -m venv $(VENV)
	@echo "✅ Virtualenv created at $(VENV)."

install-backend: venv
	@echo "📦 Installing backend Python dependencies with uv…"
	. $(VENV)/bin/activate && pip install -U uv && $(UV) pip install -r $(BACKEND_DIR)/requirements.txt -e $(BACKEND_DIR)
	@echo "✅ Backend dependencies installed."

install-frontend:
	@echo "📦 Installing frontend npm dependencies…"
	cd $(FRONTEND_DIR) && npm install
	@echo "✅ Frontend dependencies installed."

install-hooks:
	@echo "🔗 Installing git hooks (pre-commit)…"
	. $(VENV)/bin/activate && pre-commit install
	@echo "✅ Git hooks installed."

init-env:
	@echo "📄 Initializing .env files from defaults…"
	cp $(BACKEND_DIR)/.env.default $(BACKEND_DIR)/.env
	@echo "✅ Copied $(BACKEND_DIR)/.env.default → $(BACKEND_DIR)/.env"
	cp $(FRONTEND_DIR)/.env.default $(FRONTEND_DIR)/.env
	@echo "✅ Copied $(FRONTEND_DIR)/.env.default → $(FRONTEND_DIR)/.env"