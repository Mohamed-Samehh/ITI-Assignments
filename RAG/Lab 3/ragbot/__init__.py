from pathlib import Path

from flask import Flask

from .routes import api

ROOT = Path(__file__).resolve().parent.parent


def create_app() -> Flask:
    app = Flask(
        __name__,
        template_folder=str(ROOT / "templates"),
        static_folder=str(ROOT / "static"),
    )
    app.register_blueprint(api)
    return app
