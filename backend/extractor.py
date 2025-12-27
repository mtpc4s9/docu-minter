import fitz
from typing import List, Dict, Any

class PDFExtractor:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.doc = fitz.open(file_path)

    def get_metadata(self) -> Dict[str, Any]:
        return {
            "title": self.doc.metadata.get("title", ""),
            "author": self.doc.metadata.get("author", ""),
            "page_count": len(self.doc),
            "is_encrypted": self.doc.is_encrypted
        }

    def extract_raw_pages(self, start_page: int = 1, end_page: int = None) -> List[Dict[str, Any]]:
        pages_content = []
        
        # Adjust 1-based index to 0-based
        start_idx = max(0, start_page - 1)
        end_idx = end_page if end_page is not None else len(self.doc)
        end_idx = min(end_idx, len(self.doc))

        for page_num in range(start_idx, end_idx):
            page = self.doc[page_num]
            text_dict = page.get_text("dict")
            
            blocks = []
            for block in text_dict.get("blocks", []):
                if block.get("type") == 0:  # Text block
                    lines = []
                    for line in block.get("lines", []):
                        spans = []
                        for span in line.get("spans", []):
                            spans.append({
                                "text": span.get("text"),
                                "font": span.get("font"),
                                "size": span.get("size"),
                                "color": span.get("color"),
                                "bbox": span.get("bbox"),
                                "flags": span.get("flags")
                            })
                        lines.append({"spans": spans, "bbox": line.get("bbox")})
                    blocks.append({"lines": lines, "bbox": block.get("bbox")})
            
            pages_content.append({
                "page_num": page_num + 1,
                "blocks": blocks,
                "width": page.rect.width,
                "height": page.rect.height
            })
            
        return pages_content

    def close(self):
        self.doc.close()
