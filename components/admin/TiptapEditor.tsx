"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  ImageIcon,
  LinkIcon,
  Undo,
  Redo,
  Minus,
  Loader2,
} from "lucide-react";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024;

export default function TiptapEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadingRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: false,
      }),
      ImageExt.configure({ inline: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[var(--accent)] underline" },
      }),
      Placeholder.configure({
        placeholder: "Start writing your post...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm max-w-none min-h-[400px] focus:outline-none px-5 py-4 " +
          "prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight " +
          "prose-a:text-[var(--accent)] prose-strong:text-white " +
          "prose-blockquote:border-[var(--accent)] prose-blockquote:text-gray-300 " +
          "prose-code:text-[var(--accent)] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded " +
          "prose-img:rounded prose-img:border prose-img:border-white/10",
      },
    },
  });

  const handleImageUpload = useCallback(async () => {
    fileInputRef.current?.click();
  }, []);

  const onFileSelected = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor || uploadingRef.current) return;

      if (!ALLOWED.includes(file.type)) {
        alert("Unsupported format. Use JPG, PNG, or WebP.");
        return;
      }
      if (file.size > MAX_SIZE) {
        alert(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 10MB.`);
        return;
      }

      uploadingRef.current = true;

      try {
        const form = new FormData();
        form.append("file", file);
        form.append("type", "inline");
        form.append("scope", "blog");

        const res = await fetch("/api/blog/upload", { method: "POST", body: form });
        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Upload failed");
          return;
        }

        editor.chain().focus().setImage({ src: data.url }).run();
      } catch {
        alert("Upload failed. Please try again.");
      } finally {
        uploadingRef.current = false;
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [editor]
  );

  const handleLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const ToolBtn = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded transition-colors ${
        active
          ? "bg-white/10 text-[var(--accent)]"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-white/10 bg-[#0F0F0F] rounded overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-white/10 bg-[#111]">
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={15} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={15} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough size={15} />
        </ToolBtn>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <ToolBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={15} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={15} />
        </ToolBtn>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <ToolBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={15} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered size={15} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Block Quote"
        >
          <Quote size={15} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code size={15} />
        </ToolBtn>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <ToolBtn onClick={handleLink} active={editor.isActive("link")} title="Link">
          <LinkIcon size={15} />
        </ToolBtn>
        <ToolBtn onClick={handleImageUpload} title="Insert Image">
          <ImageIcon size={15} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus size={15} />
        </ToolBtn>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <ToolBtn
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo size={15} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo size={15} />
        </ToolBtn>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onFileSelected}
        className="hidden"
      />
    </div>
  );
}
