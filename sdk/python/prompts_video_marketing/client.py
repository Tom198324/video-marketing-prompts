"""Client SDK pour l'API Prompts Vidéo Marketing."""

import time
import requests
from typing import Optional
from urllib.parse import urljoin

from .types import (
    GenerateVariationOptions,
    GenerateVariationResult,
    Prompt,
    PromptsListResult,
    APIError,
)


class PromptsVideoMarketingClient:
    """Client SDK pour l'API Prompts Vidéo Marketing."""

    def __init__(
        self,
        base_url: str,
        api_key: Optional[str] = None,
        timeout: int = 30,
        retries: int = 3,
    ):
        """
        Crée une nouvelle instance du client SDK.

        Args:
            base_url: URL de base de l'API (ex: https://votre-site.manus.space)
            api_key: Clé API pour l'authentification (optionnel)
            timeout: Timeout en secondes (défaut: 30)
            retries: Nombre de tentatives en cas d'échec (défaut: 3)
        """
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.timeout = timeout
        self.retries = retries
        self.session = requests.Session()

        if api_key:
            self.session.headers["Authorization"] = f"Bearer {api_key}"

    def _request(
        self,
        method: str,
        endpoint: str,
        json_data: Optional[dict] = None,
        params: Optional[dict] = None,
        attempt: int = 1,
    ) -> dict:
        """
        Effectue une requête HTTP avec retry logic.

        Args:
            method: Méthode HTTP (GET, POST, etc.)
            endpoint: Point de terminaison de l'API
            json_data: Données JSON à envoyer (pour POST)
            params: Paramètres de requête (pour GET)
            attempt: Numéro de tentative actuelle

        Returns:
            Réponse JSON de l'API

        Raises:
            APIError: En cas d'erreur API
            requests.RequestException: En cas d'erreur réseau
        """
        url = urljoin(self.base_url, endpoint)

        try:
            response = self.session.request(
                method=method,
                url=url,
                json=json_data,
                params=params,
                timeout=self.timeout,
            )

            if not response.ok:
                try:
                    error_data = response.json()
                    code = error_data.get("code", "UNKNOWN_ERROR")
                    message = error_data.get("message", f"HTTP {response.status_code}")
                    details = error_data.get("details")
                except Exception:
                    code = "UNKNOWN_ERROR"
                    message = f"HTTP {response.status_code}: {response.reason}"
                    details = None

                raise APIError(code, message, details)

            return response.json()

        except (requests.Timeout, requests.ConnectionError, APIError) as error:
            # Retry logic pour les erreurs réseau, timeout, ou erreurs serveur 5xx
            if attempt < self.retries and self._should_retry(error):
                delay = 2 ** attempt  # Backoff exponentiel (2s, 4s, 8s...)
                time.sleep(delay)
                return self._request(method, endpoint, json_data, params, attempt + 1)

            raise

    def _should_retry(self, error: Exception) -> bool:
        """
        Détermine si une erreur doit déclencher un retry.

        Args:
            error: L'erreur à évaluer

        Returns:
            True si un retry doit être effectué
        """
        if isinstance(error, (requests.Timeout, requests.ConnectionError)):
            return True

        if isinstance(error, APIError):
            # Retry sur erreurs serveur 5xx
            return "500" in error.message or "502" in error.message or \
                   "503" in error.message or "504" in error.message

        return False

    def generate_variation(
        self,
        options: GenerateVariationOptions,
    ) -> GenerateVariationResult:
        """
        Génère des variations d'un prompt existant.

        Args:
            options: Options de génération

        Returns:
            Résultat avec les variations générées

        Raises:
            APIError: En cas d'erreur API
        """
        json_data = {
            "promptId": options["prompt_id"],
            "variations": options["variations"],
            "count": options.get("count", 1),
        }

        response = self._request("POST", "/api/trpc/generator.generateVariation", json_data=json_data)
        return response["result"]["data"]

    def get_prompts(self) -> PromptsListResult:
        """
        Récupère la liste de tous les prompts.

        Returns:
            Liste des prompts disponibles

        Raises:
            APIError: En cas d'erreur API
        """
        response = self._request("GET", "/api/trpc/prompts.list")
        return response["result"]["data"]

    def get_prompt_by_id(self, prompt_id: int) -> Prompt:
        """
        Récupère un prompt spécifique par son ID.

        Args:
            prompt_id: ID du prompt

        Returns:
            Données du prompt

        Raises:
            APIError: En cas d'erreur API
        """
        response = self._request("GET", f"/api/trpc/prompts.getById", params={"id": prompt_id})
        return response["result"]["data"]

    def get_prompts_by_category(self, category: str) -> PromptsListResult:
        """
        Recherche des prompts par catégorie.

        Args:
            category: Catégorie à rechercher

        Returns:
            Liste des prompts de cette catégorie

        Raises:
            APIError: En cas d'erreur API
        """
        response = self._request("GET", "/api/trpc/prompts.listByCategory", params={"category": category})
        return response["result"]["data"]

    def close(self):
        """Ferme la session HTTP."""
        self.session.close()

    def __enter__(self):
        """Support du context manager."""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Ferme la session à la sortie du context manager."""
        self.close()
