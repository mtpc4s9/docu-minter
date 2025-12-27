from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ProcessingOptions(BaseModel):
    start_page: int = 1
    end_page: Optional[int] = None
    mode: str = "clean" # "raw" or "clean"

class ExtractionResult(BaseModel):
    id: str
    filename: str
    markdown_content: str
    page_count: int
    metadata: Dict[str, Any]

class ErrorResponse(BaseModel):
    detail: str
