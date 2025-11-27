"""SDK officiel pour l'API Prompts Vidéo Marketing."""

from .client import PromptsVideoMarketingClient
from .types import (
    VariationParams,
    GenerateVariationOptions,
    PromptData,
    GeneratedVariation,
    GenerateVariationResult,
    Prompt,
    PromptsListResult,
    APIError,
)

__version__ = "1.0.0"
__all__ = [
    "PromptsVideoMarketingClient",
    "VariationParams",
    "GenerateVariationOptions",
    "PromptData",
    "GeneratedVariation",
    "GenerateVariationResult",
    "Prompt",
    "PromptsListResult",
    "APIError",
]
