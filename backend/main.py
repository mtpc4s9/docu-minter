import os
import uuid
import shutil
from typing import Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models import ProcessingOptions, ExtractionResult
from extractor import PDFExtractor
from cleaner import PDFCleaner
from renderer import MarkdownRenderer

app = FastAPI(title="DocuMinter API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ProcessRequest(BaseModel):
    file_id: str
    options: ProcessingOptions

@app.get("/")
async def root():
    return {"message": "DocuMinter API is running on port 8002"}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Quick metadata extraction
    extractor = PDFExtractor(file_path)
    metadata = extractor.get_metadata()
    extractor.close()
    
    return {
        "file_id": file_id, 
        "filename": file.filename,
        "page_count": metadata["page_count"]
    }

@app.post("/process", response_model=ExtractionResult)
async def process_pdf(request: ProcessRequest):
    file_path = os.path.join(UPLOAD_DIR, f"{request.file_id}.pdf")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        # Step 1: Extract
        extractor = PDFExtractor(file_path)
        raw_pages = extractor.extract_raw_pages(
            start_page=request.options.start_page,
            end_page=request.options.end_page
        )
        metadata = extractor.get_metadata()
        extractor.close()
        
        # Step 2 & 3 & 4: Clean
        cleaner = PDFCleaner(raw_pages)
        remove_hf = True if request.options.mode == "clean" else False
        cleaned_pages = cleaner.clean_process(remove_headers=remove_hf)
        
        # Step 5 & 6: Render
        renderer = MarkdownRenderer(cleaned_pages)
        markdown = renderer.render()
        
        return ExtractionResult(
            id=request.file_id,
            filename=os.path.basename(file_path),
            markdown_content=markdown,
            page_count=len(raw_pages),
            metadata=metadata
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
