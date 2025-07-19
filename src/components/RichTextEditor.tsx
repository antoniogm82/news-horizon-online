import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Image } from '@tiptap/extension-image';
import { Youtube } from '@tiptap/extension-youtube';
import { Link } from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Table as TableIcon,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkFollow, setLinkFollow] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showYoutubeDialog, setShowYoutubeDialog] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
      Link.configure({
        HTMLAttributes: {
          class: 'editor-link',
        },
        openOnClick: false,
      }),
    ],
    content,
    editable: true,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ 
        href: linkUrl,
        rel: linkFollow ? null : 'nofollow'
      }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageDialog(false);
    }
  };

  const addYoutube = () => {
    if (youtubeUrl) {
      editor.commands.setYoutubeVideo({
        src: youtubeUrl,
        width: 640,
        height: 480,
      });
      setYoutubeUrl('');
      setShowYoutubeDialog(false);
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  // Generar tabla de contenidos
  const generateTableOfContents = () => {
    const content = editor.getHTML();
    const headings: { level: number; text: string; id: string }[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    
    doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent || '';
      const id = `heading-${index}`;
      heading.setAttribute('id', id);
      headings.push({ level, text, id });
    });

    return headings;
  };

  const tableOfContents = generateTableOfContents();

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="border rounded-lg p-3 bg-background">
        <div className="flex flex-wrap gap-2">
          {/* Formato de texto */}
          <div className="flex gap-1 border-r pr-2">
            <Button
              type="button"
              variant={editor.isActive('bold') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive('italic') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive('strike') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
          </div>

          {/* Encabezados */}
          <div className="flex gap-1 border-r pr-2">
            <Button
              type="button"
              variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Listas */}
          <div className="flex gap-1 border-r pr-2">
            <Button
              type="button"
              variant={editor.isActive('bulletList') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive('orderedList') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive('blockquote') ? 'default' : 'outline'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>

          {/* Multimedia */}
          <div className="flex gap-1 border-r pr-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowLinkDialog(!showLinkDialog)}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowImageDialog(!showImageDialog)}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowYoutubeDialog(!showYoutubeDialog)}
            >
              <YoutubeIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={insertTable}
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Deshacer/Rehacer */}
          <div className="flex gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Diálogos */}
        {showLinkDialog && (
          <div className="mt-3 p-3 border rounded bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label>URL del enlace</Label>
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={linkFollow}
                  onChange={(e) => setLinkFollow(e.target.checked)}
                />
                <Label>Follow (SEO)</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={addLink} size="sm">Insertar</Button>
                <Button variant="outline" onClick={() => setShowLinkDialog(false)} size="sm">
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {showImageDialog && (
          <div className="mt-3 p-3 border rounded bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>URL de la imagen</Label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addImage} size="sm">Insertar</Button>
                <Button variant="outline" onClick={() => setShowImageDialog(false)} size="sm">
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {showYoutubeDialog && (
          <div className="mt-3 p-3 border rounded bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>URL del video de YouTube</Label>
                <Input
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addYoutube} size="sm">Insertar</Button>
                <Button variant="outline" onClick={() => setShowYoutubeDialog(false)} size="sm">
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Editor */}
        <div className="lg:col-span-3">
          <div className="border rounded-lg min-h-[500px] focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Tabla de contenidos */}
        {tableOfContents.length > 0 && (
          <div className="lg:col-span-1">
            <div className="sticky top-4 border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold mb-3">Tabla de Contenidos</h4>
              <nav className="space-y-1">
                {tableOfContents.map((heading, index) => (
                  <a
                    key={index}
                    href={`#${heading.id}`}
                    className={`block text-sm hover:text-primary transition-colors ${
                      heading.level === 1 ? 'font-medium' : 
                      heading.level === 2 ? 'ml-3' : 
                      'ml-6 text-muted-foreground'
                    }`}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;