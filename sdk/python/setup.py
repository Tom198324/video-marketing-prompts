from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="prompts-video-marketing",
    version="1.0.0",
    author="Prompts Vidéo Marketing",
    author_email="contact@prompts-video-marketing.com",
    description="SDK officiel pour l'API Prompts Vidéo Marketing - Génération de variations de prompts avec IA",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/votre-org/prompts-video-marketing-sdk-python",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
    python_requires=">=3.8",
    install_requires=[
        "requests>=2.28.0",
        "typing-extensions>=4.0.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "black>=22.0.0",
            "mypy>=0.990",
        ],
    },
    keywords="prompts video marketing ai sora veo runway sdk",
)
