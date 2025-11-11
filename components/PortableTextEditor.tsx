"use client";
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Link2, 
  Image as ImageIcon,
  Type,
  Eye,
  EyeOff,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PortableTextBlock {
  _type: string;
  _key: string;
  style?: string;
  listItem?: string;
  level?: number;
  children: Array<{
    _type: string;
    _key: string;
    text: string;
    marks?: string[];
  }>;
}

interface PortableTextEditorProps {
  value: PortableTextBlock[];
  onChange: (blocks: PortableTextBlock[]) => void;
  placeholder?: string;
  className?: string;
}

export default function PortableTextEditor({ 
  value, 
  onChange, 
  placeholder = "Escribe tu contenido aquí...",
  className 
}: PortableTextEditorProps) {
  const [content, setContent] = useState<PortableTextBlock[]>(value || []);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selection, setSelection] = useState<{
    blockIndex: number;
    textIndex: number;
    start: number;
    end: number;
  } | null>(null);
  const [history, setHistory] = useState<PortableTextBlock[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize with empty block if no content
  useEffect(() => {
    if (!content.length) {
      const emptyBlock: PortableTextBlock = {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        children: [{
          _type: 'span',
          _key: generateKey(),
          text: '',
          marks: []
        }]
      };
      setContent([emptyBlock]);
    }
  }, [content.length]);

  // Generate unique key
  const generateKey = () => Math.random().toString(36).substr(2, 9);

  // Save to history for undo/redo
  const saveToHistory = useCallback((newContent: PortableTextBlock[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newContent]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Update content and notify parent
  const updateContent = useCallback((newContent: PortableTextBlock[]) => {
    setContent(newContent);
    onChange(newContent);
    saveToHistory(newContent);
  }, [onChange, saveToHistory]);

  // Undo/Redo functions
  const undo = () => {
    if (historyIndex > 0) {
      const previousContent = history[historyIndex - 1];
      setContent([...previousContent]);
      onChange([...previousContent]);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextContent = history[historyIndex + 1];
      setContent([...nextContent]);
      onChange([...nextContent]);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Apply formatting to selected text
  const applyFormat = (format: string) => {
    if (!selection) return;

    const newContent = [...content];
    const block = newContent[selection.blockIndex];
    const textSpan = block.children[selection.textIndex];

    // Toggle mark
    const marks = textSpan.marks || [];
    const hasFormat = marks.includes(format);
    
    if (hasFormat) {
      textSpan.marks = marks.filter(mark => mark !== format);
    } else {
      textSpan.marks = [...marks, format];
    }

    updateContent(newContent);
  };

  // Change block style (normal, h2, h3, h4, blockquote)
  const changeBlockStyle = (style: string) => {
    if (!selection) return;

    const newContent = [...content];
    newContent[selection.blockIndex].style = style;
    updateContent(newContent);
  };

  // Convert to list
  const toggleList = (listType: 'bullet' | 'number') => {
    if (!selection) return;

    const newContent = [...content];
    const block = newContent[selection.blockIndex];

    if (block.listItem === listType) {
      // Remove list formatting
      delete block.listItem;
      delete block.level;
      block.style = 'normal';
    } else {
      // Add list formatting
      block.listItem = listType;
      block.level = 1;
      delete block.style;
    }

    updateContent(newContent);
  };

  // Add new block
  const addBlock = (type: string = 'normal') => {
    const newBlock: PortableTextBlock = {
      _type: 'block',
      _key: generateKey(),
      style: type,
      children: [{
        _type: 'span',
        _key: generateKey(),
        text: '',
        marks: []
      }]
    };

    const insertIndex = selection ? selection.blockIndex + 1 : content.length;
    const newContent = [...content];
    newContent.splice(insertIndex, 0, newBlock);
    
    updateContent(newContent);
  };

  // Handle text input
  const handleTextChange = (blockIndex: number, textIndex: number, newText: string) => {
    const newContent = [...content];
    newContent[blockIndex].children[textIndex].text = newText;
    updateContent(newContent);
  };

  // Add link
  const addLink = () => {
    const url = prompt('Ingresa la URL:');
    if (!url || !selection) return;

    const newContent = [...content];
    const block = newContent[selection.blockIndex];
    
    // This is a simplified version - in a real implementation,
    // you'd need to handle text selection and link annotations properly
    const textSpan = block.children[selection.textIndex];
    textSpan.marks = [...(textSpan.marks || []), 'link'];
    
    updateContent(newContent);
  };

  // Render preview of portable text
  const renderPreview = () => {
    return (
      <div className="prose prose-sm max-w-none p-4">
        {content.map((block) => {
          if (block.style === 'h2') {
            return (
              <h2 key={block._key} className="text-2xl font-bold mt-6 mb-4">
                {block.children.map(child => child.text).join('')}
              </h2>
            );
          }
          if (block.style === 'h3') {
            return (
              <h3 key={block._key} className="text-xl font-bold mt-4 mb-3">
                {block.children.map(child => child.text).join('')}
              </h3>
            );
          }
          if (block.style === 'h4') {
            return (
              <h4 key={block._key} className="text-lg font-bold mt-3 mb-2">
                {block.children.map(child => child.text).join('')}
              </h4>
            );
          }
          if (block.style === 'blockquote') {
            return (
              <blockquote key={block._key} className="border-l-4 border-gray-300 pl-4 italic my-4">
                {block.children.map(child => child.text).join('')}
              </blockquote>
            );
          }
          if (block.listItem === 'bullet') {
            return (
              <ul key={block._key} className="list-disc ml-6 my-2">
                <li>{block.children.map(child => child.text).join('')}</li>
              </ul>
            );
          }
          if (block.listItem === 'number') {
            return (
              <ol key={block._key} className="list-decimal ml-6 my-2">
                <li>{block.children.map(child => child.text).join('')}</li>
              </ol>
            );
          }
          
          return (
            <p key={block._key} className="mb-4">
              {block.children.map((child) => {
                let textElement: React.ReactNode = child.text;
                if (child.marks?.includes('strong')) {
                  textElement = <strong key={child._key}>{textElement}</strong>;
                }
                if (child.marks?.includes('em')) {
                  textElement = <em key={`${child._key}-em`}>{textElement}</em>;
                }
                if (child.marks?.includes('code')) {
                  textElement = <code key={`${child._key}-code`} className="bg-gray-100 px-1 rounded">{textElement}</code>;
                }
                return <span key={`${child._key}-span`}>{textElement}</span>;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <Card className={cn("relative", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center space-x-1">
          {/* History */}
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={historyIndex <= 0}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
          >
            <Redo className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Text Formatting */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('strong')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('em')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('code')}
          >
            <Code className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Block Styles */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeBlockStyle('h2')}
          >
            H2
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeBlockStyle('h3')}
          >
            H3
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeBlockStyle('h4')}
          >
            H4
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeBlockStyle('blockquote')}
          >
            <Quote className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Lists */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleList('bullet')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleList('number')}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Links and Media */}
          <Button
            variant="ghost"
            size="sm"
            onClick={addLink}
          >
            <Link2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => alert('Image upload será implementado próximamente')}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Preview Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
        >
          {isPreviewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {isPreviewMode ? 'Editor' : 'Preview'}
        </Button>
      </div>

      {/* Editor Content */}
      <div className="min-h-[400px]">
        {isPreviewMode ? (
          renderPreview()
        ) : (
          <div className="p-4">
            {content.map((block, blockIndex) => (
              <div key={block._key} className="mb-2">
                {block.children.map((child, textIndex) => (
                  <textarea
                    key={child._key}
                    className={cn(
                      "w-full border-none outline-none resize-none bg-transparent",
                      block.style === 'h2' && "text-2xl font-bold",
                      block.style === 'h3' && "text-xl font-bold",
                      block.style === 'h4' && "text-lg font-bold",
                      block.style === 'blockquote' && "italic border-l-4 border-gray-300 pl-4",
                      block.listItem && "ml-6"
                    )}
                    value={child.text}
                    onChange={(e) => handleTextChange(blockIndex, textIndex, e.target.value)}
                    onFocus={() => setSelection({ blockIndex, textIndex, start: 0, end: 0 })}
                    placeholder={blockIndex === 0 && textIndex === 0 ? placeholder : ""}
                    rows={Math.max(1, Math.ceil(child.text.length / 80))}
                  />
                ))}
                {block.listItem && (
                  <span className="absolute left-2 text-gray-500">
                    {block.listItem === 'bullet' ? '•' : `${blockIndex + 1}.`}
                  </span>
                )}
              </div>
            ))}
            
            {/* Add Block Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addBlock()}
              className="mt-4 text-gray-500"
            >
              + Agregar párrafo
            </Button>
          </div>
        )}
      </div>

      {/* Character Count */}
      <div className="px-4 py-2 text-xs text-gray-500 border-t bg-gray-50">
        Palabras: {content.reduce((acc, block) => 
          acc + block.children.reduce((childAcc, child) => 
            childAcc + (child.text?.split(/\s+/).filter(word => word.length > 0).length || 0), 0), 0
        )} • Caracteres: {content.reduce((acc, block) => 
          acc + block.children.reduce((childAcc, child) => childAcc + (child.text?.length || 0), 0), 0
        )}
      </div>
    </Card>
  );
}