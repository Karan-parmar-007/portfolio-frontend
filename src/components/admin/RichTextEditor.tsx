import { useEffect } from 'react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Placeholder } from '@tiptap/extensions'
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Underline as UnderlineIcon,
  Undo2,
} from 'lucide-react'
import { cn } from '@/lib/cn'

const EMPTY = '<p></p>'

function promptUrl(label: string, current?: string): string | null {
  const value = window.prompt(label, current ?? 'https://')
  if (value === null) return null
  const url = value.trim()
  if (url && !/^https?:\/\//i.test(url)) {
    window.alert('Use a full http(s):// URL.')
    return null
  }
  return url
}

/** Project write-up editor. Output is sanitized again by the API before it is stored. */
export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write the project story. Headings, lists, links and images are supported.',
}: {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false,
          autolink: true,
          protocols: ['http', 'https', 'mailto'],
          HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
        },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || EMPTY,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'project-prose min-h-[280px] px-4 py-3 focus:outline-none',
        'aria-label': 'Project description',
      },
    },
    onUpdate: ({ editor: next }) => onChange(next.getHTML()),
  })

  // Load server content (e.g. after the project fetch) without fighting the user's typing.
  useEffect(() => {
    if (!editor) return
    const incoming = value || EMPTY
    if (editor.getHTML() !== incoming) {
      editor.commands.setContent(incoming, { emitUpdate: false })
    }
  }, [editor, value])

  const active = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            bold: e.isActive('bold'),
            italic: e.isActive('italic'),
            underline: e.isActive('underline'),
            h2: e.isActive('heading', { level: 2 }),
            h3: e.isActive('heading', { level: 3 }),
            bullet: e.isActive('bulletList'),
            ordered: e.isActive('orderedList'),
            quote: e.isActive('blockquote'),
            code: e.isActive('codeBlock'),
            link: e.isActive('link'),
          }
        : null,
  })

  if (!editor || !active) return null

  const setLink = () => {
    const previous: unknown = editor.getAttributes('link').href
    const url = promptUrl('Link URL', typeof previous === 'string' ? previous : undefined)
    if (url === null) return
    if (!url) {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const insertImage = () => {
    const url = promptUrl('Image URL')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  const tools = [
    { label: 'Bold', icon: Bold, on: active.bold, run: () => editor.chain().focus().toggleBold().run() },
    { label: 'Italic', icon: Italic, on: active.italic, run: () => editor.chain().focus().toggleItalic().run() },
    { label: 'Underline', icon: UnderlineIcon, on: active.underline, run: () => editor.chain().focus().toggleUnderline().run() },
    { label: 'Heading', icon: Heading2, on: active.h2, run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: 'Subheading', icon: Heading3, on: active.h3, run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: 'Bullet list', icon: List, on: active.bullet, run: () => editor.chain().focus().toggleBulletList().run() },
    { label: 'Numbered list', icon: ListOrdered, on: active.ordered, run: () => editor.chain().focus().toggleOrderedList().run() },
    { label: 'Quote', icon: Quote, on: active.quote, run: () => editor.chain().focus().toggleBlockquote().run() },
    { label: 'Code block', icon: Code, on: active.code, run: () => editor.chain().focus().toggleCodeBlock().run() },
    { label: 'Link', icon: LinkIcon, on: active.link, run: setLink },
    { label: 'Image from URL', icon: ImagePlus, on: false, run: insertImage },
    { label: 'Undo', icon: Undo2, on: false, run: () => editor.chain().focus().undo().run() },
    { label: 'Redo', icon: Redo2, on: false, run: () => editor.chain().focus().redo().run() },
  ]

  return (
    <div className="overflow-hidden rounded border border-lightest-navy bg-light-navy">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-navy-border px-2 py-1.5" role="toolbar" aria-label="Formatting">
        {tools.map(({ label, icon: Icon, on, run }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={on}
            onClick={run}
            className={cn(
              'rounded p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green',
              on ? 'bg-green-tint text-green' : 'text-slate hover:bg-lightest-navy hover:text-lightest-slate',
            )}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
