"""
FastAPI application entrypoint for the AI Powered Blog Generator backend.

- Includes core app initialization.
- Registers AI endpoints for thumbnail generation, keyword suggestion, and summarization.
- Configures OpenAPI docs.
"""

import os
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from .ai_endpoints import router as ai_router

openapi_tags = [
    {
        "name": "AI Tools",
        "description": "AI-powered blog tools (thumbnail, keywords, summaries) provided via OpenAI API."
    }
]

# PUBLIC_INTERFACE
def create_app():
    """
    Construct the FastAPI application.
    """
    app = FastAPI(
        title="AI Powered Blog Generator API",
        description="REST API for AI-powered blog tools and management.",
        version="1.0.0",
        openapi_tags=openapi_tags,
    )

    # Add CORS (can be adjusted as needed)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register AI endpoints
    app.include_router(ai_router)

    @app.get("/", tags=["Health"])
    async def root():
        """Health check endpoint for API."""
        return {"status": "ok"}

    return app

app = create_app()
