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
  Plus,
  Trash2,
  Save,
  Loader2,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

import PageHeader from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAllContentsQuery,
  useAddContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation,
} from "@/redux/features/contents/contents.api";
import { ContentItem } from "@/redux/features/contents/contents.type";

/* ─── Dynamic Icon Resolver ──────────────────────────────────────────────────── */
const resolvePageIcon = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes("about")) return FileText;
  if (lower.includes("return") || lower.includes("refund")) return RefreshCcw;
  if (lower.includes("privacy")) return ShieldCheck;
  if (lower.includes("term")) return ScrollText;
  if (lower.includes("cookie")) return Cookie;
  if (lower.includes("help") || lower.includes("support")) return HelpCircle;
  return FileText;
};

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
    className={`size-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
      active ? "bg-slate-900 text-white shadow-2xs" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`}
  >
    {children}
  </button>
);

/* ─── Rich Editor Component ──────────────────────────────────────────────────── */
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
        className="w-full min-h-[360px] px-5 py-4 text-sm font-mono text-slate-800 resize-y focus:outline-none bg-slate-50/50 border-0"
        placeholder="Enter raw HTML content payload..."
        spellCheck={false}
      />
    );
  }

  return (
    <div className="flex flex-col">
      {/* Minimal toolbar — B I U = • */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-100 bg-slate-50/30">
        <ToolbarBtn title="Bold" onClick={() => exec("bold")} active={fmts["bold"]}>
          <Bold className="size-4" strokeWidth={2.5} />
        </ToolbarBtn>
        <ToolbarBtn title="Italic" onClick={() => exec("italic")} active={fmts["italic"]}>
          <Italic className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Underline" onClick={() => exec("underline")} active={fmts["underline"]}>
          <Underline className="size-4" />
        </ToolbarBtn>
        <div className="h-4 w-px bg-slate-200 mx-1" />
        <ToolbarBtn title="Horizontal Rule border strip" onClick={() => exec("insertHorizontalRule")}>
          <Minus className="size-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Bullet List itemization" onClick={() => exec("insertUnorderedList")}>
          <List className="size-4" />
        </ToolbarBtn>
      </div>

      {/* Editable Content Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyUp={updateFmts}
        onMouseUp={updateFmts}
        data-placeholder="Start typing formatted dynamic page markup..."
        className="
          min-h-[360px] px-5 py-4 text-sm text-slate-800 leading-relaxed focus:outline-none bg-white
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:space-y-1
          [&_p]:mb-2.5
          [&_hr]:border-slate-200 [&_hr]:my-4
          [&_a]:text-blue-600 [&_a]:underline [&_a]:font-medium
          empty:before:content-[attr(data-placeholder)]
          empty:before:text-slate-400
          empty:before:pointer-events-none
        "
      />
    </div>
  );
};

/* ─── Main Dynamic Contents Interface ────────────────────────────────────────── */
export default function ContentsPage() {
  // Remote queries
  const { data: response, isLoading } = useGetAllContentsQuery();
  const [addContentMutation, { isLoading: isAdding }] = useAddContentMutation();
  const [updateContentMutation, { isLoading: isUpdating }] = useUpdateContentMutation();
  const [deleteContentMutation, { isLoading: isDeleting }] = useDeleteContentMutation();

  const contentItems: ContentItem[] = response?.data || [];

  // Active workspace item
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rawMode, setRawMode] = useState(false);

  // Local buffering variables for active item modifications
  const [editTitle, setEditTitle] = useState("");
  const [editSubTitle, setEditSubTitle] = useState("");
  const [editHtmlContent, setEditHtmlContent] = useState("");

  // Creation modal view toggler
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubTitle, setNewSubTitle] = useState("");
  const [newHtmlContent, setNewHtmlContent] = useState("");

  // Auto-resolve initially active record when fetched items update
  useEffect(() => {
    if (contentItems.length > 0) {
      // If currently selected ID is invalid or missing, auto focus first
      if (!selectedContentId || !contentItems.some((c) => c.id === selectedContentId)) {
        setSelectedContentId(contentItems[0].id);
      }
    } else {
      setSelectedContentId(null);
    }
  }, [contentItems, selectedContentId]);

  // Synchronize dynamic buffering variables matching active entity model
  const activeItem = contentItems.find((c) => c.id === selectedContentId);

  useEffect(() => {
    if (activeItem) {
      setEditTitle(activeItem.title || "");
      setEditSubTitle(activeItem.sub_title || "");
      setEditHtmlContent(activeItem.content || "");
    } else {
      setEditTitle("");
      setEditSubTitle("");
      setEditHtmlContent("");
    }
  }, [activeItem]);

  // Save changes handler matching PATCH API requirements exactly
  const handleSaveChanges = async () => {
    if (!activeItem) return;
    if (!editTitle.trim()) {
      toast.error("Content Page Title cannot be empty.");
      return;
    }

    try {
      await updateContentMutation({
        id: activeItem.id,
        data: {
          title: editTitle.trim(),
          sub_title: editSubTitle.trim(),
          content: editHtmlContent,
        },
      }).unwrap();

      toast.success(`Content page "${editTitle}" updated successfully!`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to finalize content page updates.");
    }
  };

  // Submit trigger handler matching POST API requirements exactly
  const handleCreateNewContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a valid target page title.");
      return;
    }

    try {
      const created = await addContentMutation({
        title: newTitle.trim(),
        sub_title: newSubTitle.trim() || "General platform information",
        content: newHtmlContent.trim() || "<p>Initial drafted page markup content...</p>",
      }).unwrap();

      toast.success(`Dynamic page "${created.data.title}" instantiated successfully!`);
      // Reset view creation buffer parameters
      setNewTitle("");
      setNewSubTitle("");
      setNewHtmlContent("");
      setIsAddModalOpen(false);
      // Auto transition perspective context onto dynamically generated ID
      setSelectedContentId(created.data.id);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create dynamic page record.");
    }
  };

  // Execute resource unbinding via DELETE API exactly
  const handleDeleteContent = async (id: number, title: string) => {
    if (!window.confirm(`Are you certain you wish to permanently delete the content page "${title}"?`)) {
      return;
    }

    try {
      await deleteContentMutation(id).unwrap();
      toast.success(`Content page "${title}" successfully dropped.`);
      if (selectedContentId === id) {
        setSelectedContentId(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to execute delete instruction on record.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Title Header Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          {/* Responsive side overlay activation toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Menu className="size-5" />
          </button>
          <PageHeader title="Dynamic Contents" description="Manage customizable frontend content web pages, policies, and embedded HTML documents" />
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="size-4 stroke-3" />
          <span>Add New Content Page</span>
        </button>
      </div>

      <div className="flex gap-6 items-start relative">
        {/* Responsive viewport dimming backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-950/30 z-30 lg:hidden backdrop-blur-2xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Dynamic Sidebar Itemization ── */}
        <aside
          className={`
            fixed top-0 left-0 h-full z-40 w-64 bg-white shadow-2xl border-r border-slate-200 overflow-y-auto p-4
            transition-transform duration-300 ease-in-out
            lg:static lg:translate-x-0 lg:z-auto lg:h-auto lg:w-64 lg:shrink-0 lg:shadow-none lg:border-r-0 lg:p-0 lg:bg-transparent
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Portable side view heading */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 lg:hidden">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Available Pages
            </span>
            <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
              <X className="size-4" />
            </button>
          </div>

          <p className="hidden lg:block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
            Available Managed Pages
          </p>

          {isLoading ? (
            /* Rich loading representations */
            <div className="space-y-2">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          ) : contentItems.length === 0 ? (
            <div className="text-center py-8 px-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
              <p className="text-xs text-slate-500 font-medium">No custom content pages available</p>
              <button
                type="button"
                onClick={() => { setSidebarOpen(false); setIsAddModalOpen(true); }}
                className="text-xs text-blue-600 font-bold underline mt-1.5 block mx-auto cursor-pointer"
              >
                Create initial page
              </button>
            </div>
          ) : (
            <nav className="space-y-1">
              {contentItems.map((item) => {
                const active = selectedContentId === item.id;
                const DynamicIcon = resolvePageIcon(item.title);

                return (
                  <div
                    key={item.id}
                    onClick={() => { setSelectedContentId(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-start justify-between gap-2 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                      active
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-700 hover:bg-slate-100/80"
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <DynamicIcon
                        className={`size-4 mt-0.5 shrink-0 transition-colors ${
                          active ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-bold leading-snug truncate ${active ? "text-white" : "text-slate-900"}`}>
                          {item.title || "Untitled Page"}
                        </p>
                        <p className={`text-[11px] mt-0.5 truncate ${active ? "text-blue-100" : "text-slate-400"}`}>
                          {item.sub_title || "No external description"}
                        </p>
                      </div>
                    </div>

                    {/* Quick Inline Trigger Drop */}
                    <button
                      type="button"
                      title="Permanently remove content record"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteContent(item.id, item.title);
                      }}
                      disabled={isDeleting}
                      className={`p-1 rounded-md transition-opacity opacity-0 group-hover:opacity-100 shrink-0 ${
                        active ? "text-blue-200 hover:text-white hover:bg-blue-700" : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      }`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                );
              })}
            </nav>
          )}
        </aside>

        {/* ── Editor Workspace Engine ── */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-1/3 rounded-lg" />
              <Skeleton className="h-4 w-1/4 rounded-lg" />
              <Skeleton className="h-80 w-full rounded-xl mt-4" />
            </div>
          ) : activeItem ? (
            <div>
              {/* Core Page Attributes Editing Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                      Target Page Identifier Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Enter target page title..."
                      className="w-full bg-transparent text-base font-extrabold text-slate-900 placeholder:text-slate-400 focus:outline-none border-b border-transparent focus:border-slate-300 pb-0.5 transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={handleSaveChanges}
                      disabled={isUpdating}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      {isUpdating ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                    Page Header Description Subtitle
                  </label>
                  <input
                    type="text"
                    value={editSubTitle}
                    onChange={(e) => setEditSubTitle(e.target.value)}
                    placeholder="Enter short contextual overview summary..."
                    className="w-full bg-transparent text-xs text-slate-600 placeholder:text-slate-400 focus:outline-none border-b border-transparent focus:border-slate-300 pb-0.5 transition-colors"
                  />
                </div>
              </div>

              {/* Document Markup Payload Rich Viewport */}
              <RichEditor
                key={activeItem.id} // Enforce total re-initialization on selection switch
                value={editHtmlContent}
                onChange={(html) => setEditHtmlContent(html)}
                rawMode={rawMode}
              />

              {/* Engine Output Modes Toolbar */}
              <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2 bg-slate-200/60 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setRawMode(false)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      !rawMode ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Formatted Layout
                  </button>
                  <button
                    type="button"
                    onClick={() => setRawMode(true)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      rawMode ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Raw Source HTML
                  </button>
                </div>

                <span className="text-[11px] font-semibold text-slate-400">
                  ID: #{activeItem.id}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 px-4">
              <Layers className="size-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">No Content Record Highlighted</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Select an item from the side perspective tree navigation to configure static page components or push new entries directly.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Inline Modal Trigger Creation Form Engine */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs transition-all">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-extrabold text-slate-900">Instantiate New Target Page</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewContent} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Page Title Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Terms of Distribution"
                  className="w-full h-10 border border-slate-200 rounded-xl px-3.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Page Description Subtitle
                </label>
                <input
                  type="text"
                  value={newSubTitle}
                  onChange={(e) => setNewSubTitle(e.target.value)}
                  placeholder="e.g. Mandatory regulatory compliance parameters"
                  className="w-full h-10 border border-slate-200 rounded-xl px-3.5 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Initial HTML Document Payload
                </label>
                <textarea
                  rows={4}
                  value={newHtmlContent}
                  onChange={(e) => setNewHtmlContent(e.target.value)}
                  placeholder="<p>Enter foundational html formatting body...</p>"
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-700 focus:outline-none focus:border-slate-900 resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isAdding && <Loader2 className="size-3.5 animate-spin" />}
                  <span>Push Page Document</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}