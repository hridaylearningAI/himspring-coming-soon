"use client";

import ImageNode from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

/* The body field.

   It was a Markdown textarea with a preview beside it, which meant the writer
   typed one thing and read another. TipTap replaces that with the article
   itself: the editable surface carries .hsb-article, the same class the
   published post is rendered with, in the same two typefaces — so bold looks
   bold and a heading is already the size it will be on the page.

   What it emits is HTML, and that is what the column stores. There is no
   Markdown step left anywhere: the post page renders post.body directly.

   Nothing here sanitises that HTML on the way out, and it does not need to
   twice over — TipTap parses everything, typed or pasted, into its own schema,
   so a <script> is dropped at the point of entry rather than at the point of
   render, and the row-level security policy means only a named editor can write
   the column at all.
   ponytail: trusted-author HTML. If authorship ever widens past the allowlist
   in supabase/schema.sql, sanitise on render with DOMPurify or similar. */

const HEADINGS = [
  { level: 2 as const, label: "H2" },
  { level: 3 as const, label: "H3" },
];

export default function RichText({
  value,
  onChange,
  onUploadImage,
}: {
  value: string;
  onChange: (html: string) => void;
  onUploadImage: (file: File) => Promise<string | null>;
}) {
  const editor = useEditor({
    extensions: [
      /* h1 belongs to the post title, so the body starts at h2 — the same rule
         the Markdown renderer used to enforce by shifting every level down one.
         blog.css styles h2 through h4 and nothing beyond. */
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      ImageNode.configure({ HTMLAttributes: { class: "hsb-figure" } }),
    ],
    content: value,
    /* Next renders this component on the server first, and an editor that
       instantiates during that pass hydrates against markup React did not
       produce. */
    immediatelyRender: false,
    /* v3 skips re-rendering on transactions by default, which is right for a
       bare editor and wrong for this one: the toolbar reads isActive() and would
       otherwise light up a beat behind the cursor. */
    shouldRerenderOnTransaction: true,
    editorProps: { attributes: { class: "ad__rt hsb-article" } },
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
  });

  if (!editor) return <div className="ad__rt ad__rt--loading" />;

  /* The picture goes in at the caret straight away, reading from the file on
     disk, and swaps to the bucket's URL when the upload lands. Waiting for the
     round trip first meant clicking Image did nothing visible for several
     seconds — long enough to read as a broken button, and long enough to click
     it again.

     The node is found again by its blob: src rather than remembered by
     position, because the writer can keep typing above it while it uploads and
     move it. Editor.tsx holds every exit out of the form shut until this
     resolves, so a blob: URL — which means nothing outside this tab — cannot be
     what gets saved. */
  const insertImage = async (file: File) => {
    const local = URL.createObjectURL(file);
    editor.chain().focus().setImage({ src: local, alt: "" }).run();

    const url = await onUploadImage(file);

    let at = -1;
    editor.state.doc.descendants((node, pos) => {
      if (at === -1 && node.type.name === "image" && node.attrs.src === local) at = pos;
    });
    const placeholder = at === -1 ? null : editor.state.doc.nodeAt(at);

    if (placeholder) {
      const tr = editor.state.tr;
      /* No URL means the upload failed and said so in the status line; leaving
         the placeholder would be a picture that exists only on this machine. */
      if (url) tr.setNodeMarkup(at, undefined, { ...placeholder.attrs, src: url });
      else tr.delete(at, at + placeholder.nodeSize);
      editor.view.dispatch(tr);
    }
    URL.revokeObjectURL(local);
  };

  const link = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Link to", previous ?? "https://");
    if (href === null) return;
    if (!href) return editor.chain().focus().unsetLink().run();
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };

  return (
    <div className="ad__editor">
      <div className="ad__tools">
        <Tool on={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </Tool>
        <Tool
          on={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <i>I</i>
        </Tool>

        <span className="ad__toolsep" />

        {HEADINGS.map(({ level, label }) => (
          <Tool
            key={level}
            on={editor.isActive("heading", { level })}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          >
            {label}
          </Tool>
        ))}

        <span className="ad__toolsep" />

        <Tool
          on={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </Tool>
        <Tool
          on={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </Tool>
        <Tool
          on={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </Tool>

        <span className="ad__toolsep" />

        <Tool on={editor.isActive("link")} onClick={link}>
          Link
        </Tool>
        <label className="ad__tool ad__tool--file">
          Image
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void insertImage(file);
              event.target.value = "";
            }}
          />
        </label>

        <span className="ad__toolsep" />

        <Tool onClick={() => editor.chain().focus().undo().run()}>Undo</Tool>
        <Tool onClick={() => editor.chain().focus().redo().run()}>Redo</Tool>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function Tool({
  on,
  onClick,
  children,
}: {
  on?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`ad__tool${on ? " is-on" : ""}`}
      /* Without this the button takes focus on mousedown, the selection
         collapses, and the command it runs has nothing to apply to. */
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
