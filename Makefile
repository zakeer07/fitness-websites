.PHONY: setup install-hooks lint format check help

help:
	@echo "Targets:"
	@echo "  make setup         Install dev deps + git hooks"
	@echo "  make lint          Run all pre-commit checks"
	@echo "  make format        Auto-fix formatting (pre-commit)"
	@echo "  make check         Same as lint"

setup: install-hooks

install-hooks:
	python3 -m pip install -r requirements-dev.txt
	npm install
	pre-commit install
	@echo "Done. Hooks run automatically on git commit."

lint check:
	pre-commit run --all-files
	npm run format:check

format:
	npm run format
	pre-commit run --all-files
