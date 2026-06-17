"""
PDF and text extraction service.
Supports PDF files and plain text.
"""

import io
import pdfplumber


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text from a PDF file.
    Uses pdfplumber for accurate text extraction including tables.
    """
    text_parts = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text.strip())

    full_text = "\n\n".join(text_parts)

    if not full_text.strip():
        raise ValueError(
            "Could not extract text from PDF. "
            "The file may be scanned or image-based."
        )

    return full_text


def extract_text(file_bytes: bytes, filename: str) -> str:
    """
    Extract text from a file based on its extension.
    Supports .pdf and .txt files.
    """
    filename_lower = filename.lower()

    if filename_lower.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    elif filename_lower.endswith(".txt"):
        return file_bytes.decode("utf-8", errors="ignore")
    else:
        raise ValueError(
            f"Unsupported file type: {filename}. "
            "Please upload a .pdf or .txt file."
        )
