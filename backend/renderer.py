import statistics
from typing import List, Dict, Any

class MarkdownRenderer:
    def __init__(self, cleaned_pages: List[Dict[str, Any]]):
        self.pages = cleaned_pages
        self.median_size = self._calculate_median_font_size()

    def _calculate_median_font_size(self) -> float:
        sizes = []
        for page in self.pages:
            for block in page["blocks"]:
                for line in block["lines"]:
                    for span in line["spans"]:
                        sizes.append(span["size"])
        
        if not sizes: return 12.0
        return statistics.median(sizes)

    def render(self) -> str:
        md_output = []
        
        for page in self.pages:
            for block in page["blocks"]:
                lines_data = []
                max_size = 0
                is_bold_block = False
                
                for line in block["lines"]:
                    line_text = ""
                    max_line_size = 0
                    is_line_bold = False
                    for span in line["spans"]:
                        line_text += span["text"]
                        max_line_size = max(max_line_size, span["size"])
                        if span["flags"] & 16:
                            is_line_bold = True
                    
                    lines_data.append({
                        "text": line_text.strip(),
                        "size": max_line_size,
                        "bold": is_line_bold
                    })
                    max_size = max(max_size, max_line_size)
                    if is_line_bold: is_bold_block = True

                # Determine if it's a heading
                block_all_text = " ".join([l["text"] for l in lines_data]).strip()
                if not block_all_text: continue

                if max_size > self.median_size * 1.5:
                    md_output.append(f"# {block_all_text}\n")
                elif (max_size > self.median_size * 1.2) or (max_size > self.median_size and is_bold_block and len(block_all_text) < 150):
                    md_output.append(f"## {block_all_text}\n")
                elif is_bold_block and len(block_all_text) < 100:
                    md_output.append(f"### {block_all_text}\n")
                else:
                    # Paragraph or List
                    # We process line by line to detect bullet points
                    processed_block = []
                    for line in lines_data:
                        txt = line["text"]
                        # Detect common bullet points: •, -, *, o
                        if txt.startswith(('•', '-', '*', 'o')):
                            processed_block.append(f"\n{txt}")
                        else:
                            processed_block.append(txt)
                    
                    md_output.append(" ".join(processed_block).replace(" \n", "\n").strip() + "\n")
            
            md_output.append("\n")

        return "\n".join(md_output)
