"""
Generate a UTRGV planning guide PDF from an HTML source.

Usage:  python generate.py [html-file]
        defaults to dental-planning-guide.html

Convention (per established OPPD workflow):
- Always use format="Letter" with landscape=True/False
- Never pass explicit pixel dimensions alongside the format parameter
- Margins handled via Playwright params, not @page CSS
"""

import sys
from pathlib import Path
from playwright.sync_api import sync_playwright


def generate(html_path: Path, pdf_path: Path):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(f"file://{html_path.resolve()}")
        page.wait_for_load_state("networkidle")
        # Wait for embedded fonts to be available before snapshotting
        page.evaluate("() => document.fonts.ready")
        page.wait_for_function("document.fonts.status === 'loaded'")
        page.emulate_media(media="print")

        page.pdf(
            path=str(pdf_path),
            format="Letter",
            landscape=True,
            print_background=True,
            margin={"top": "0.3in", "right": "0.4in", "bottom": "0.3in", "left": "0.4in"},
        )
        browser.close()

    print(f"✓ {pdf_path.name}  ({pdf_path.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    here = Path(__file__).parent
    name = sys.argv[1] if len(sys.argv) > 1 else "dental-planning-guide.html"
    src = here / name
    out = src.with_suffix(".pdf")
    generate(src, out)
