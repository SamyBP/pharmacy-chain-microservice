from dataclasses import dataclass, field, asdict
from typing import Optional, Callable


@dataclass
class EngineConfig:
    url: str
    echo: bool = field(default=True)

    def dict(self):
        return {k: v for k, v in asdict(self).items()}


@dataclass
class FastDbxConfig:
    engine: EngineConfig
    create_tables: bool = field(default=True)
