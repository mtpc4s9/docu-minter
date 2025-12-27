from typing import List, Dict, Any, Set
import re
from collections import Counter

class PDFCleaner:
    # Text that should always be removed regardless of position or frequency
    BLACKLIST_TEXTS = [
        "Complimentary IIBA® Member Copy. Not for Distribution or Resale.",
        "Business Analysis Planning and Monitoring" # Specific noise identified by user
    ]

    def __init__(self, pages_data: List[Dict[str, Any]]):
        self.pages_data = pages_data
        self.metadata = {}

    def is_page_number(self, text: str, b_top: float, b_bottom: float, height: float) -> bool:
        """
        Detect if text is an isolated page number at top or bottom.
        """
        # Top 12% or Bottom 12%
        if b_bottom > height * 0.12 and b_top < height * 0.88:
            return False
            
        clean_val = text.strip()
        # Common patterns: "21", "- 21 -", "Page 21", "21 |"
        patterns = [
            r'^\d+$', 
            r'^-\s*\d+\s*-$', 
            r'^Page\s+\d+$', 
            r'^\d+\s*\|.*$',
            r'^.*\|\s*\d+$'
        ]
        return any(re.match(p, clean_val, re.IGNORECASE) for p in patterns)

    def detect_headers_footers(self) -> Set[str]:
        """
        Identify text that appears frequently at the very top or bottom of pages.
        """
        top_texts = []
        bottom_texts = []
        
        for page in self.pages_data:
            height = page["height"]
            top_threshold = height * 0.15 # Slightly wider zone for noise
            bottom_threshold = height * 0.85
            
            for block in page["blocks"]:
                b_top = block["bbox"][1]
                b_bottom = block["bbox"][3]
                
                block_text = "".join([s["text"] for line in block["lines"] for s in line["spans"]]).strip()
                if not block_text: continue
                
                if self.is_page_number(block_text, b_top, b_bottom, height):
                    continue

                if b_bottom < top_threshold:
                    top_texts.append(block_text)
                elif b_top > bottom_threshold:
                    bottom_texts.append(block_text)
        
        # Lower threshold: If text appears in > 20% of pages and at least 2 pages.
        # This catches chapter headers in small page ranges.
        threshold_count = max(2, round(len(self.pages_data) * 0.2))
        
        headers_footers = set()
        for text, count in Counter(top_texts + bottom_texts).items():
            if count >= threshold_count:
                headers_footers.add(text)
                
        return headers_footers

    def is_likely_table(self, block: Dict[str, Any]) -> bool:
        """
        Heuristic to detect if a block is a table.
        """
        lines = block.get("lines", [])
        if len(lines) < 3: return False 
        
        numeric_count = 0
        total_chars = 0
        
        for line in lines:
            line_text = "".join([s["text"] for s in line["spans"]])
            total_chars += len(line_text)
            numeric_count += len(re.findall(r'\d', line_text))
        
        if total_chars > 0 and (numeric_count / total_chars) > 0.6: 
            return True
             
        return False

    def clean_process(self, remove_headers: bool = True) -> List[Dict[str, Any]]:
        bad_texts = self.detect_headers_footers() if remove_headers else set()
        
        cleaned_pages = []
        for page_idx, page in enumerate(self.pages_data):
            height = page.get("height", 800)
            new_blocks = []
            for block in page["blocks"]:
                b_top = block["bbox"][1]
                b_bottom = block["bbox"][3]
                
                block_text = "".join([s["text"] for line in block["lines"] for s in line["spans"]]).strip()
                if not block_text: continue
                
                # 0. GLOBAL BLACKLIST CHECK (Watermarks/Hardcoded Noise)
                # Removes specific text regardless of where it appears on the page.
                if any(bt.lower() in block_text.lower() for bt in self.BLACKLIST_TEXTS):
                    continue

                # 1. Frequency-based header/footer removal (Position dependent)
                is_in_noise_zone = (b_bottom < height * 0.15 or b_top > height * 0.85)
                if remove_headers and is_in_noise_zone and block_text in bad_texts:
                    continue
                
                # 2. Page number removal
                if remove_headers and self.is_page_number(block_text, b_top, b_bottom, height):
                    continue

                # 3. Filter out tables
                if self.is_likely_table(block):
                    continue
                
                new_blocks.append(block)
                
            cleaned_pages.append({
                "page_num": page["page_num"],
                "blocks": new_blocks
            })
            
        return cleaned_pages
