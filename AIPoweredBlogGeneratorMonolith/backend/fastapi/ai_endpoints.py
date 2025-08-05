"""
REST API endpoints for AI-powered blog tools: thumbnail generation, keyword suggestion, and content summarization.

- Uses ai_tools.py for OpenAI-powered operations.
- Requires OPENAI_API_KEY to be present in environment variables.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import List, Dict, Optional

from .ai_tools import generate_ai_thumbnail, suggest_keywords, summarize_content

router = APIRouter(
    prefix="/ai",
    tags=["AI Tools"],
)

class ThumbnailRequest(BaseModel):
    prompt: str = Field(..., description="Blog topic or description to generate a thumbnail for.")

class ThumbnailResponse(BaseModel):
    image_url: str = Field(..., description="URL to AI-generated thumbnail image.")

class KeywordsRequest(BaseModel):
    text: str = Field(..., description="Blog post text, excerpt, or topic to generate SEO keywords.")

class KeywordsResponse(BaseModel):
    keywords: List[str] = Field(..., description="AI-suggested SEO keywords for the content.")

class SummaryRequest(BaseModel):
    content: str = Field(..., description="Full blog post content to summarize.")

class SummaryResponse(BaseModel):
    summary: str = Field(..., description="Concise AI-generated summary of the content.")

# PUBLIC_INTERFACE
@router.post(
    "/thumbnail",
    response_model=ThumbnailResponse,
    summary="Generate AI Thumbnail",
    description="Generate a blog post thumbnail image using DALL·E (OpenAI). Returns URL to image.",
    responses={
        200: {"description": "Generated image URL returned."},
        400: {"description": "Missing or invalid prompt."},
        500: {"description": "AI service unavailable or misconfigured."}
    }
)
def ai_generate_thumbnail(data: ThumbnailRequest):
    """
    Generate a thumbnail using AI model given a prompt.
    """
    if not data.prompt or not data.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt is required for thumbnail generation.")
    image_url = generate_ai_thumbnail(data.prompt)
    return ThumbnailResponse(image_url=image_url)

# PUBLIC_INTERFACE
@router.post(
    "/keywords",
    response_model=KeywordsResponse,
    summary="Suggest SEO Keywords",
    description="Suggest SEO-friendly keywords for a blog post or topic using OpenAI.",
    responses={
        200: {"description": "List of suggested keywords."},
        400: {"description": "Missing or invalid input text."},
        500: {"description": "AI service unavailable or misconfigured."}
    }
)
def ai_suggest_keywords(data: KeywordsRequest):
    """
    Suggest a list of SEO-optimized keywords using AI given the text/topic.
    """
    if not data.text or not data.text.strip():
        raise HTTPException(status_code=400, detail="Input text or topic is required for keyword suggestion.")
    keywords = suggest_keywords(data.text)
    return KeywordsResponse(keywords=keywords)

# PUBLIC_INTERFACE
@router.post(
    "/summarize",
    response_model=SummaryResponse,
    summary="Summarize Blog Content",
    description="Generate a concise summary for a given blog post (or content body) using OpenAI.",
    responses={
        200: {"description": "Summary generated and returned."},
        400: {"description": "Missing or invalid input content."},
        500: {"description": "AI service unavailable or misconfigured."}
    }
)
def ai_summarize_content(data: SummaryRequest):
    """
    Summarize a blog post using AI.
    """
    if not data.content or not data.content.strip():
        raise HTTPException(status_code=400, detail="Blog post content is required for summarization.")
    summary = summarize_content(data.content)
    return SummaryResponse(summary=summary)
