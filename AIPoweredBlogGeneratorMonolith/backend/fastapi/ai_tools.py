"""
AI-powered utilities for blog-related image and text functions.
"""

import os
import base64
import logging
from typing import List, Optional

import openai
from fastapi import HTTPException

# Configure logging for AI tools
logger = logging.getLogger("ai_tools")
logger.setLevel(logging.INFO)

def get_openai_client():
    """Get configured OpenAI client using OPENAI_API_KEY."""
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        logger.error("OPENAI_API_KEY not set in environment.")
        raise HTTPException(status_code=500, detail="OpenAI API key not configured on server.")
    openai.api_key = api_key
    return openai


# PUBLIC_INTERFACE
def generate_ai_thumbnail(prompt: str) -> str:
    """
    Generate an image (thumbnail) for a blog post using OpenAI's DALL·E (or compatible) API.

    Args:
        prompt (str): Prompt describing the image.

    Returns:
        str: URL to generated image (preferred) or base64 image (fallback).
    """
    openai_client = get_openai_client()
    try:
        response = openai_client.Image.create(
            prompt=prompt,
            n=1,
            size="512x512",
            response_format="url",
        )
        if response and response["data"] and "url" in response["data"][0]:
            return response["data"][0]["url"]
        else:
            raise Exception("No image URL returned from OpenAI API.")
    except Exception as e:
        logger.exception("AI thumbnail generation failed.")
        raise HTTPException(status_code=500, detail=f"AI image generation failed: {str(e)}")


# PUBLIC_INTERFACE
def suggest_keywords(text: str, max_keywords: int = 8) -> List[str]:
    """
    Use OpenAI's API to suggest SEO-friendly keywords for a blog post.

    Args:
        text (str): Blog post text or topic.
        max_keywords (int): Maximum number of keywords to suggest.

    Returns:
        List[str]: List of suggested keywords.
    """
    openai_client = get_openai_client()
    prompt = (
        f"Suggest {max_keywords} SEO-friendly, single or multi-word keywords for the following blog post content "
        f"(or description). Return as a comma-separated list.\n\n{text}\n\nKeywords:"
    )
    try:
        response = openai_client.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert blog SEO optimizer."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=60,
            temperature=0.4,
        )
        keywords_str = response["choices"][0]["message"]["content"]
        keywords = [kw.strip() for kw in keywords_str.replace('\n', ',').split(",") if kw.strip()]
        # Only return up to max_keywords
        return keywords[:max_keywords]
    except Exception as e:
        logger.exception("AI keyword suggestion failed.")
        raise HTTPException(status_code=500, detail=f"Keyword suggestion failed: {str(e)}")


# PUBLIC_INTERFACE
def summarize_content(content: str, max_words: int = 120) -> str:
    """
    Summarize a blog post to generate a concise summary.

    Args:
        content (str): The full blog post text.
        max_words (int): Approximate maximum number of words.

    Returns:
        str: The summary.
    """
    openai_client = get_openai_client()
    prompt = (
        f"Summarize the following blog post in a concise, engaging paragraph. Max {max_words} words.\n\n{content}\n\nSummary:"
    )
    try:
        response = openai_client.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that writes engaging blog summaries."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=180,
            temperature=0.45,
        )
        summary = response["choices"][0]["message"]["content"].strip()
        return summary
    except Exception as e:
        logger.exception("AI summarization failed.")
        raise HTTPException(status_code=500, detail=f"Content summarization failed: {str(e)}")
