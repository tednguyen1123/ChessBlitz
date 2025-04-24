# ♟️ ChessBlitzBackend

## 🔧 Project Setup

⚠️ Requires: Python 3.11+ and [`uv`](https://github.com/astral-sh/uv) installed  

1. **Initialize the environment and install dependencies**:

    ```bash
    uv sync
    ```

    This will:
    - Create a `.venv` directory
    - Install all dependencies from `pyproject.toml`
    - Lock your environment via `uv.lock`

1. **Set up your environment variables**:

    Create a `.env` file in the project root and add the following:

    ```env
    FIREBASE_API_KEY=your_key
    FIREBASE_AUTH_DOMAIN=your_auth_domain
    DATABASE_URL=your_db_url
    FIREBASE_STORAGE_BUCKET=your_bucket
    OPENAI_API_KEY=your_openai_key
    PORT=5000  # or any available port
    ```

1. **Run the development server**:

    ```bash
    uv run run-backend
    ```

    The API will be hosted at `http://localhost:5000` (or the port specified in `.env`).

---

## 🧪 Running Tests

We can now also easily write tests in the `tests/` directory and run them using `pytest`:

```bash
uv run pytest
```
