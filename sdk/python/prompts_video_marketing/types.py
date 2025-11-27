"""Types et modèles de données pour le SDK Prompts Vidéo Marketing."""

from typing import Dict, List, Any, Optional, TypedDict
from typing_extensions import NotRequired


class VariationParams(TypedDict, total=False):
    """Paramètres de variation pour la génération."""
    subject: bool
    location: bool
    style: bool
    equipment: bool
    lighting: bool
    action: bool
    audio: bool
    technical: bool


class GenerateVariationOptions(TypedDict):
    """Options pour la génération de variations."""
    prompt_id: int
    variations: VariationParams
    count: NotRequired[int]


class PromptData(TypedDict):
    """Structure d'un prompt JSON."""
    shot: Dict[str, Any]
    subject: Dict[str, Any]
    action: List[Dict[str, str]]
    scene: Dict[str, Any]
    cinematography: Dict[str, Any]
    audio: Dict[str, Any]
    visual_rules: Dict[str, Any]
    technical_specifications: Dict[str, Any]


class GeneratedVariation(TypedDict):
    """Variation générée."""
    id: str
    data: PromptData


class GenerateVariationResult(TypedDict):
    """Résultat de la génération de variations."""
    variations: List[GeneratedVariation]
    original: PromptData


class Prompt(TypedDict):
    """Informations sur un prompt."""
    id: int
    title: str
    category: str
    prompt_json: str


class PromptsListResult(TypedDict):
    """Liste de prompts."""
    prompts: List[Prompt]
    total: int


class APIError(Exception):
    """Erreur API."""
    
    def __init__(self, code: str, message: str, details: Optional[Any] = None):
        self.code = code
        self.message = message
        self.details = details
        super().__init__(f"API Error [{code}]: {message}")
