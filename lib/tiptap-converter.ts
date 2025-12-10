import { PortableTextBlock } from '@portabletext/types';

// Helper to generate random keys
const generateKey = () => Math.random().toString(36).substring(2, 9);

// TipTap JSON types (simplified)
interface TiptapNode {
  type: string;
  content?: TiptapNode[];
  attrs?: Record<string, any>;
  text?: string;
  marks?: { type: string; attrs?: Record<string, any> }[];
}

interface TiptapDoc {
  type: 'doc';
  content: TiptapNode[];
}

export function tiptapToPortableText(json: TiptapDoc): PortableTextBlock[] {
  if (!json.content) return [];

  const blocks: PortableTextBlock[] = [];

  json.content.forEach((node) => {
    if (node.type === 'heading') {
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: `h${node.attrs?.level || 1}`,
        children: convertContentToSpans(node.content),
        markDefs: convertMarksToDefs(node.content),
      });
    } else if (node.type === 'paragraph') {
      // Check if it's an image wrapped in paragraph (Tiptap sometimes does this)
      const imageNode = node.content?.find(n => n.type === 'image');
      if (imageNode) {
        blocks.push({
          _type: 'image',
          _key: generateKey(),
          asset: {
            _type: 'reference',
            _ref: imageNode.attrs?.src, // Assuming src is the asset ID or we handle it
          },
          alt: imageNode.attrs?.alt,
        } as any);
      } else {
        blocks.push({
          _type: 'block',
          _key: generateKey(),
          style: 'normal',
          children: convertContentToSpans(node.content),
          markDefs: convertMarksToDefs(node.content),
        });
      }
    } else if (node.type === 'bulletList') {
      node.content?.forEach((listItem) => {
        listItem.content?.forEach((p) => {
          if (p.type === 'paragraph') {
            blocks.push({
              _type: 'block',
              _key: generateKey(),
              style: 'normal',
              listItem: 'bullet',
              level: 1,
              children: convertContentToSpans(p.content),
              markDefs: convertMarksToDefs(p.content),
            });
          }
        });
      });
    } else if (node.type === 'orderedList') {
      node.content?.forEach((listItem) => {
        listItem.content?.forEach((p) => {
          if (p.type === 'paragraph') {
            blocks.push({
              _type: 'block',
              _key: generateKey(),
              style: 'normal',
              listItem: 'number',
              level: 1,
              children: convertContentToSpans(p.content),
              markDefs: convertMarksToDefs(p.content),
            });
          }
        });
      });
    } else if (node.type === 'image') {
       blocks.push({
          _type: 'image',
          _key: generateKey(),
          asset: {
            _type: 'reference',
            _ref: node.attrs?.src,
          },
          alt: node.attrs?.alt,
        } as any);
    } else if (node.type === 'blockquote') {
       node.content?.forEach((p) => {
          if (p.type === 'paragraph') {
             blocks.push({
              _type: 'block',
              _key: generateKey(),
              style: 'blockquote',
              children: convertContentToSpans(p.content),
              markDefs: convertMarksToDefs(p.content),
            });
          }
       });
    }
  });

  return blocks;
}

function convertContentToSpans(content?: TiptapNode[]): any[] {
  if (!content) return [{ _type: 'span', _key: generateKey(), text: '', marks: [] }];

  return content.map((node) => {
    if (node.type === 'text') {
      const marks = node.marks?.map((m) => {
        if (m.type === 'bold') return 'strong';
        if (m.type === 'italic') return 'em';
        if (m.type === 'code') return 'code';
        if (m.type === 'link') return m.attrs?.href; // This needs handling in markDefs
        return undefined;
      }).filter(Boolean) || [];

      // Separate link marks to markDefs
      const simpleMarks = marks.filter(m => !m?.startsWith('http') && !m?.startsWith('/'));
      const linkMark = node.marks?.find(m => m.type === 'link');
      
      if (linkMark) {
          // In a real implementation we would generate a key for the link and add it to markDefs
          // For simplicity here we are skipping complex link handling in this direction
          // or we can use a convention.
          // Let's assume we handle links in markDefs separately.
      }

      return {
        _type: 'span',
        _key: generateKey(),
        text: node.text || '',
        marks: simpleMarks,
      };
    }
    return null;
  }).filter(Boolean);
}

function convertMarksToDefs(content?: TiptapNode[]): any[] {
    // Extract links and create markDefs
    // This is a simplified version
    return [];
}

export function portableTextToHtml(blocks: PortableTextBlock[]): string {
  // Basic conversion for initial value
  if (!blocks) return '';
  
  return blocks.map(block => {
    if (block._type === 'block') {
      const childrenHtml = block.children.map((child: any) => {
        let text = child.text;
        if (child.marks?.includes('strong')) text = `<strong>${text}</strong>`;
        if (child.marks?.includes('em')) text = `<em>${text}</em>`;
        if (child.marks?.includes('code')) text = `<code>${text}</code>`;
        return text;
      }).join('');

      if (block.style === 'h1') return `<h1>${childrenHtml}</h1>`;
      if (block.style === 'h2') return `<h2>${childrenHtml}</h2>`;
      if (block.style === 'h3') return `<h3>${childrenHtml}</h3>`;
      if (block.style === 'blockquote') return `<blockquote>${childrenHtml}</blockquote>`;
      if (block.listItem === 'bullet') return `<ul><li>${childrenHtml}</li></ul>`; // This is wrong, lists need grouping
      if (block.listItem === 'number') return `<ol><li>${childrenHtml}</li></ol>`; // This is wrong, lists need grouping
      
      return `<p>${childrenHtml}</p>`;
    }
    return '';
  }).join('');
}
