function blockToLines(block) {
  switch (block.type) {
    case 'heading':
      return [`## ${block.text}`, '']

    case 'paragraph':
      return [block.text, '']

    case 'list':
      return [...block.items.map((item) => `- ${item}`), '']

    case 'callout':
      return [`> [${block.variant || 'default'}] ${block.text}`, '']

    case 'image':
      return [`![${block.heading || block.alt || 'תמונה'}](${block.src})`, '']

    case 'suppliers':
      return [
        '[SUPPLIERS]',
        ...block.items.map((item) => {
          const parts = [item.label, item.phone]
          if (item.contact) parts.push(item.contact)
          if (item.note) parts.push(item.note)
          return parts.join('|')
        }),
        '[/SUPPLIERS]',
        '',
      ]

    default:
      return []
  }
}

export function blocksToEditableText(blocks = []) {
  return blocks.flatMap(blockToLines).join('\n').trim()
}

function parseCallout(line) {
  const match = line.match(/^> \[(.+?)\] (.+)$/)
  if (!match) {
    return { type: 'callout', variant: 'default', text: line.replace(/^> /, '') }
  }
  return { type: 'callout', variant: match[1], text: match[2] }
}

function parseSupplierLine(line) {
  const [label, phone, contact, note] = line.split('|').map((part) => part?.trim())
  return {
    label: label || '',
    phone: phone || '',
    ...(contact ? { contact } : {}),
    ...(note ? { note } : {}),
  }
}

export function editableTextToBlocks(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index].trim()

    if (!line) {
      index += 1
      continue
    }

    if (line.startsWith('## ')) {
      blocks.push({ type: 'heading', text: line.slice(3).trim() })
      index += 1
      continue
    }

    if (line.startsWith('> ')) {
      blocks.push(parseCallout(line))
      index += 1
      continue
    }

    if (line.startsWith('![')) {
      const match = line.match(/^!\[(.*?)\]\((.+)\)$/)
      if (match) {
        blocks.push({
          type: 'image',
          heading: match[1],
          src: match[2],
          alt: match[1],
        })
      }
      index += 1
      continue
    }

    if (line === '[SUPPLIERS]') {
      index += 1
      const items = []
      while (index < lines.length && lines[index].trim() !== '[/SUPPLIERS]') {
        const supplierLine = lines[index].trim()
        if (supplierLine) {
          items.push(parseSupplierLine(supplierLine))
        }
        index += 1
      }
      blocks.push({ type: 'suppliers', items })
      index += 1
      continue
    }

    if (line.startsWith('- ')) {
      const items = []
      while (index < lines.length && lines[index].trim().startsWith('- ')) {
        items.push(lines[index].trim().slice(2))
        index += 1
      }
      blocks.push({ type: 'list', items })
      continue
    }

    const paragraphLines = []
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().startsWith('## ') &&
      !lines[index].trim().startsWith('> ') &&
      !lines[index].trim().startsWith('- ') &&
      !lines[index].trim().startsWith('![') &&
      lines[index].trim() !== '[SUPPLIERS]'
    ) {
      paragraphLines.push(lines[index].trim())
      index += 1
    }

    if (paragraphLines.length) {
      blocks.push({ type: 'paragraph', text: paragraphLines.join('\n') })
    }
  }

  return blocks
}
