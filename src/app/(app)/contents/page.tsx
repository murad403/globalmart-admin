"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  FileText,
  RefreshCcw,
  ShieldCheck,
  ScrollText,
  Cookie,
  HelpCircle,
  Bold,
  Italic,
  Underline,
  Minus,
  List,
  Menu,
  X,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

/* ─── Pages ──────────────────────────────────────────────────────────────────── */
const PAGES = [
  { id: "about", label: "About Us", desc: "General company information", Icon: FileText },
  { id: "returns", label: "Returns & Refunds", desc: "Customer return policies", Icon: RefreshCcw },
  { id: "privacy", label: "Privacy Policy", desc: "Data privacy guidelines", Icon: ShieldCheck },
  { id: "terms", label: "Terms of Service", desc: "Legal service agreements", Icon: ScrollText },
  { id: "cookie", label: "Cookie Policy", desc: "Cookie usage guidelines", Icon: Cookie },
  { id: "help", label: "Help Center", desc: "Cookie usage guidelines", Icon: HelpCircle },
];

/* ─── Toolbar button ─────────────────────────────────────────────────────────── */
const ToolbarBtn = ({
  title,
  onClick,
  active,
  children,
}: {
  title: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${active ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
  >
    {children}
  </button>
);

/* ─── Rich Editor ────────────────────────────────────────────────────────────── */
const RichEditor = ({
  value,
  onChange,
  rawMode,
}: {
  value: string;
  onChange: (html: string) => void;
  rawMode: boolean;
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [fmts, setFmts] = useState<Record<string, boolean>>({});
  const lastVal = useRef(value);

  const exec = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
  }, []);

  const updateFmts = useCallback(() => {
    setFmts({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", updateFmts);
    return () => document.removeEventListener("selectionchange", updateFmts);
  }, [updateFmts]);

  useEffect(() => {
    if (editorRef.current && value !== lastVal.current) {
      editorRef.current.innerHTML = value;
      lastVal.current = value;
    }
  }, [value]);

  const handleInput = () => {
    const html = editorRef.current?.innerHTML ?? "";
    lastVal.current = html;
    onChange(html);
  };

  if (rawMode) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[300px] px-5 py-4 text-sm font-mono text-gray-700 resize-none focus:outline-none bg-transparent"
        placeholder="Enter raw HTML..."
        spellCheck={false}
      />
    );
  }

  return (
    <div className="flex flex-col">
      {/* Minimal toolbar — B I U = • */}
      <div className="flex items-center gap-0.5 px-4 py-2 border-b border-gray-100">
        <ToolbarBtn title="Bold" onClick={() => exec("bold")} active={fmts["bold"]}>
          <Bold className="w-4 h-4" strokeWidth={2.5} />
        </ToolbarBtn>
        <ToolbarBtn title="Italic" onClick={() => exec("italic")} active={fmts["italic"]}>
          <Italic className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Underline" onClick={() => exec("underline")} active={fmts["underline"]}>
          <Underline className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Horizontal Rule" onClick={() => exec("insertHorizontalRule")}>
          <Minus className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Bullet List" onClick={() => exec("insertUnorderedList")}>
          <List className="w-4 h-4" />
        </ToolbarBtn>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyUp={updateFmts}
        onMouseUp={updateFmts}
        data-placeholder="Enter page content..."
        className="
          min-h-[300px] px-5 py-4 text-sm text-gray-700 leading-relaxed focus:outline-none
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2
          [&_p]:mb-1.5
          [&_hr]:border-gray-200 [&_hr]:my-3
          [&_a]:text-blue-600 [&_a]:underline
          empty:before:content-[attr(data-placeholder)]
          empty:before:text-gray-300
          empty:before:pointer-events-none
        "
      />
    </div>
  );
};

/* ─── Main ───────────────────────────────────────────────────────────────────── */
export default function ContentsPage() {
  const [activePage, setActivePage] = useState("about");
  const [contents, setContents] = useState<Record<string, string>>({});
  const [rawMode, setRawMode] = useState(false);
  const [lastSaved, setLastSaved] = useState<Record<string, Date>>({});
  const [autoTimer, setAutoTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeMeta = PAGES.find((p) => p.id === activePage)!;

  const handleChange = (html: string) => {
    setContents((prev) => ({ ...prev, [activePage]: html }));
    if (autoTimer) clearTimeout(autoTimer);
    const t = setTimeout(() => {
      setLastSaved((prev) => ({ ...prev, [activePage]: new Date() }));
    }, 1800);
    setAutoTimer(t);
  };

  const fmtTime = (d?: Date) =>
    d
      ? `Today at ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      : null;

  return (
    <div>
      {/* Page title */}
      <div className="pb-6 flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <PageHeader title="Contents" description="Manage public platform pages and policies" />
        </div>
      </div>

      <div className=" pb-10 flex gap-6 items-start">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={`
            fixed top-0 left-0 h-full z-40 w-60 bg-white shadow-xl overflow-y-auto
            transition-transform duration-300 ease-in-out
            lg:static lg:translate-x-0 lg:z-auto lg:h-auto
            lg:w-64 lg:shrink-0 lg:shadow-none lg:bg-transparent lg:overflow-visible
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Mobile header */}
          <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-gray-100 lg:hidden">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Platform Pages
            </span>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Desktop label */}
          <p className="hidden lg:block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Platform Pages
          </p>

          <nav className="p-2 lg:p-0 space-y-0.5">
            {PAGES.map(({ id, label, desc, Icon }) => {
              const active = activePage === id;
              return (
                <button
                  key={id}
                  onClick={() => { setActivePage(id); setSidebarOpen(false); }}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${active
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Icon
                    className={`w-4 h-4 mt-0.5 shrink-0 ${active ? "text-white" : "text-gray-400"
                      }`}
                  />
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold leading-snug ${active ? "text-white" : "text-gray-800"}`}>
                      {label}
                    </p>
                    <p className={`text-xs mt-0.5 truncate ${active ? "text-blue-100" : "text-gray-400"}`}>
                      {desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── Editor card ── */}
        <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Card header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-5 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">
              Editing: {activeMeta.label}
            </h2>
            <span className="text-xs text-gray-400">
              {fmtTime(lastSaved[activePage])
                ? `Last updated: ${fmtTime(lastSaved[activePage])}`
                : ""}
            </span>
          </div>

          {/* Editor */}
          <RichEditor
            value={contents[activePage] ?? ""}
            onChange={handleChange}
            rawMode={rawMode}
          />

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 py-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setRawMode(false)}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${!rawMode ? "text-gray-800" : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                Rich Text Editor
              </button>
              <button
                type="button"
                onClick={() => setRawMode(true)}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${rawMode ? "text-gray-800" : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                Raw Formatting
              </button>
            </div>
            <span className="text-xs text-gray-400">Auto-save: draft</span>
          </div>
        </div>
      </div>
    </div>
  );
}