# MedAI - Medical AI Assistant

## Setup

1. Install dependencies

```bash
pip install -r requirements.txt
```

2. Create your env file

```bash
cp .env.example .env
```

3. Add your key in `.env`

```env
OPENAI_API_KEY=your_api_key_here
```

4. Run

```bash
python app.py
```

5. Open

```text
http://localhost:5000
```

## Project Structure

- `app.py` - App entry point
- `medai/config.py` - Environment/config values
- `medai/tools.py` - Prompt + tools (`WebSearch`, local hospital search, CSV store)
- `medai/agent.py` - Agent setup (`create_agent`, `InMemorySaver`, middleware)
- `medai/routes.py` - Flask routes
- `index.html` - Simple UI page
- `cases.csv` - Stored cases (created automatically)
