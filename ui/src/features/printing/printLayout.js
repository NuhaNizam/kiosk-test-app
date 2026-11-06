// Page size for silent (Electron) printing. Without an explicit size the
// printer driver's default page is used (e.g. 72 x 297mm on POS-80), which
// shrinks the receipt and feeds a long strip of blank paper.

/** Printable width of the receipt paper: 72mm for 80mm rolls, 48mm for 58mm. */
export const PAPER_WIDTH_MM = 72

/** Blank space around the receipt. */
export const PAGE_MARGIN_MM = 4

const MM_PER_CSS_PX = 25.4 / 96

/**
 * Measures the receipt in the print portal at the paper's printable width
 * and returns the page size to print it on, in mm.
 */
export function measureReceiptPage() {
  const root = document.querySelector('.print-root')
  if (!root) throw new Error('Nothing to print: the print portal is empty')

  // The portal is hidden on screen; lay it out off-screen just to measure.
  const previous = root.getAttribute('style')
  root.setAttribute(
    'style',
    `display:block; position:fixed; left:-10000px; top:0; width:${PAPER_WIDTH_MM - 2 * PAGE_MARGIN_MM}mm`,
  )
  const contentHeightMm = root.scrollHeight * MM_PER_CSS_PX
  if (previous === null) root.removeAttribute('style')
  else root.setAttribute('style', previous)

  return {
    widthMm: PAPER_WIDTH_MM,
    // +2mm so rounding never pushes the last line onto a second page.
    heightMm: Math.ceil(contentHeightMm + 2 * PAGE_MARGIN_MM + 2),
    marginMm: PAGE_MARGIN_MM,
  }
}
