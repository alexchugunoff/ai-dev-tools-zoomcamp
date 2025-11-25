# TODO App (01-todo)

This is a small Django TODO application used by the exercises in this repository.

Quick start (inside the devcontainer / workspace):

1. Enter the project folder:

```bash
cd 01-todo
```

2. (Recommended) Create and activate a venv:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

3. Install dependencies (Django is in requirements.txt):

```bash
pip install -r requirements.txt
```

4. Run migrations and start the dev server:

```bash
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

5. Open http://localhost:8000/ in the container/port-forwarding environment.

Running tests:

```bash
python manage.py test
```

Project layout notes:
- `todoproject/` — minimal Django settings & URL config.
- `todo/` — the app implementation (models, views, templates, tests).
- `templates/` — global templates used by the app.
