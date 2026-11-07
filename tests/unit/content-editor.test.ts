import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { createSyntheticFixturePdf } from '../fixtures/create-synthetic-pdf'
import { applyAnnotationsToPdf, hexToRgbComponents } from '../../src/modules/content-editor'
import { extractAllText } from '../../src/modules/verification/canary'

describe('Content Editor Annotation Pipeline', () => {
  it('converts hex colors to 0..1 RGB components correctly', () => {
    expect(hexToRgbComponents('#000000')).toEqual({ r: 0, g: 0, b: 0 })
    expect(hexToRgbComponents('#ffffff')).toEqual({ r: 1, g: 1, b: 1 })
    expect(hexToRgbComponents('#ff0000')).toEqual({ r: 1, g: 0, b: 0 })
    expect(hexToRgbComponents('#00ff00')).toEqual({ r: 0, g: 1, b: 0 })
    expect(hexToRgbComponents('#0000ff')).toEqual({ r: 0, g: 0, b: 1 })
    expect(hexToRgbComponents('#f00')).toEqual({ r: 1, g: 0, b: 0 })
  })

  it('embeds text annotations into PDF and makes them extractable', async () => {
    const initialBytes = await createSyntheticFixturePdf()
    const customText = 'CONFIDENTIAL_CONTRACT_AMENDMENT_2026'

    const updatedBytes = await applyAnnotationsToPdf(initialBytes, {
      texts: [
        {
          id: 'text_1',
          pageIndex: 0,
          text: customText,
          x: 100,
          y: 150,
          fontSize: 16,
          fontFamily: 'Helvetica-Bold',
          color: '#1e293b'
        }
      ],
      images: [],
      drawings: [],
      stamps: []
    })

    expect(updatedBytes.length).toBeGreaterThan(0)

    // Verify text is now extractable by pdfjs-dist
    const extractedText = await extractAllText(updatedBytes)
    expect(extractedText.join('\n')).toContain(customText)
  })

  it('embeds stamps and drawings into PDF pages', async () => {
    const initialBytes = await createSyntheticFixturePdf()

    const updatedBytes = await applyAnnotationsToPdf(initialBytes, {
      texts: [],
      images: [],
      drawings: [
        {
          id: 'draw_1',
          pageIndex: 0,
          points: [
            { x: 50, y: 50 },
            { x: 100, y: 70 },
            { x: 150, y: 50 }
          ],
          color: '#2563eb',
          thickness: 3,
          opacity: 1.0
        }
      ],
      stamps: [
        {
          id: 'stamp_1',
          pageIndex: 0,
          label: 'OFFICIAL_APPROVED',
          x: 80,
          y: 200,
          color: '#10b981'
        }
      ]
    })

    expect(updatedBytes.length).toBeGreaterThan(initialBytes.length)

    // Verify output is a valid PDF
    const reloaded = await PDFDocument.load(updatedBytes)
    expect(reloaded.getPageCount()).toBe(2)

    // Verify stamp text is extractable
    const extractedText = await extractAllText(updatedBytes)
    expect(extractedText.join('\n')).toContain('OFFICIAL_APPROVED')
  })

  it('embeds configured custom dimensions, positioning and multiline text correctly', async () => {
    const initialBytes = await createSyntheticFixturePdf()
    const multiLineContent = 'LINE_ALPHA_1\nLINE_BETA_2\nLINE_GAMMA_3'

    const updatedBytes = await applyAnnotationsToPdf(initialBytes, {
      texts: [
        {
          id: 'text_custom_1',
          pageIndex: 0,
          text: multiLineContent,
          x: 120,
          y: 220,
          width: 250,
          height: 60,
          fontSize: 14,
          fontFamily: 'Helvetica',
          color: '#dc2626'
        }
      ],
      images: [],
      drawings: [],
      stamps: [
        {
          id: 'stamp_custom_1',
          pageIndex: 0,
          label: 'SPECIAL_VERIFIED',
          x: 200,
          y: 100,
          width: 180,
          height: 48,
          color: '#3b82f6'
        }
      ]
    })

    expect(updatedBytes.length).toBeGreaterThan(0)
    const reloaded = await PDFDocument.load(updatedBytes)
    expect(reloaded.getPageCount()).toBe(2)

    const textContent = (await extractAllText(updatedBytes)).join('\n')
    expect(textContent).toContain('LINE_ALPHA_1')
    expect(textContent).toContain('LINE_BETA_2')
    expect(textContent).toContain('LINE_GAMMA_3')
    expect(textContent).toContain('SPECIAL_VERIFIED')
  })
})
