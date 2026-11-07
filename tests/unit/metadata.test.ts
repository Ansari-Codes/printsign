import { describe, it, expect } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { readMetadata, writeMetadata, scrubMetadata } from '../../src/modules/metadata'
import { createSyntheticFixturePdf } from '../fixtures/create-synthetic-pdf'

describe('Metadata & XMP Operations', () => {
  it('reads metadata correctly from document', async () => {
    const rawPdf = await createSyntheticFixturePdf()
    const doc = await PDFDocument.load(rawPdf)

    const meta = readMetadata(doc)
    expect(meta.title).toBe('Synthetic Confidential Test Document')
    expect(meta.author).toBe('Test Suite Generator')
    expect(meta.subject).toBe('Canary Redaction Integrity Test')
    expect(meta.creator).toBe('PrintSign Test Harness')
  })

  it('updates metadata fields', async () => {
    const rawPdf = await createSyntheticFixturePdf()
    const doc = await PDFDocument.load(rawPdf)

    writeMetadata(doc, {
      title: 'Updated Confidential Title',
      author: 'Jane Doe',
      subject: 'Updated Subject',
      keywords: ['redacted', 'safe'],
      creator: 'PrintSign App',
      producer: 'In-Memory PDF Engine',
      creationDate: new Date('2026-01-01'),
      modificationDate: new Date('2026-01-02'),
      xmpXml: '<x:xmpmeta>test</x:xmpmeta>'
    })

    const updated = readMetadata(doc)
    expect(updated.title).toBe('Updated Confidential Title')
    expect(updated.author).toBe('Jane Doe')
  })

  it('scrubs all metadata completely', async () => {
    const rawPdf = await createSyntheticFixturePdf()
    const doc = await PDFDocument.load(rawPdf)

    scrubMetadata(doc)

    const scrubbed = readMetadata(doc)
    expect(scrubbed.title).toBe('')
    expect(scrubbed.author).toBe('')
    expect(scrubbed.subject).toBe('')
    expect(scrubbed.creator).toBe('')
    expect(scrubbed.keywords).toEqual([])
  })
})
