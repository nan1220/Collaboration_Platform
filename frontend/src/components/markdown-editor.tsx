"use client";

import { useRef, useState, type ComponentType } from "react";
import {
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Table as TableIcon,
  Pencil,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";

interface ToolbarAction {
  icon: ComponentType<{ className?: string }>;
  label: string;
  apply: (value: string, start: number, end: number) => { next: string; selectionStart: number; selectionEnd: number };
}

function wrapSelection(marker: string) {
  return (value: string, start: number, end: number) => {
    const selected = value.slice(start, end);
    const next = value.slice(0, start) + marker + selected + marker + value.slice(end);
    return { next, selectionStart: start + marker.length, selectionEnd: start + marker.length + selected.length };
  };
}

function linePrefix(prefix: string) {
  return (value: string, start: number) => {
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    const pos = start + prefix.length;
    return { next, selectionStart: pos, selectionEnd: pos };
  };
}

const TOOLBAR: ToolbarAction[] = [
  { icon: Bold, label: "Bold", apply: wrapSelection("**") },
  { icon: Italic, label: "Italic", apply: wrapSelection("*") },
  { icon: Heading2, label: "Heading", apply: linePrefix("## ") },
  { icon: List, label: "Bulleted list", apply: linePrefix("- ") },
  { icon: ListOrdered, label: "Numbered list", apply: linePrefix("1. ") },
  { icon: Quote, label: "Quote", apply: linePrefix("> ") },
  {
    icon: LinkIcon,
    label: "Link",
    apply: (value, start, end) => {
      const selected = value.slice(start, end) || "text";
      const insert = `[${selected}](https://)`;
      const next = value.slice(0, start) + insert + value.slice(end);
      return { next, selectionStart: start + selected.length + 3, selectionEnd: start + selected.length + 3 + 8 };
    },
  },
  {
    icon: TableIcon,
    label: "Table",
    apply: (value, start) => {
      const insert = "\n| Column | Column |\n| --- | --- |\n| Cell | Cell |\n";
      const next = value.slice(0, start) + insert + value.slice(start);
      return { next, selectionStart: start + insert.length, selectionEnd: start + insert.length };
    },
  },
];

export function MarkdownEditor({
  id,
  value,
  onChange,
  rows = 6,
  placeholder,
  className,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState("write");

  function runAction(action: ToolbarAction) {
    const el = textareaRef.current;
    if (!el) return;
    const { next, selectionStart, selectionEnd } = action.apply(value, el.selectionStart, el.selectionEnd);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selectionStart, selectionEnd);
    });
  }

  return (
    <Tabs value={tab} onValueChange={(v) => v && setTab(v)} className={cn("gap-0", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-lg border border-b-0 bg-muted/40 px-1.5 py-1">
        <div className="flex items-center gap-0.5">
          {TOOLBAR.map((action) => (
            <Button
              key={action.label}
              type="button"
              variant="ghost"
              size="icon-sm"
              title={action.label}
              aria-label={action.label}
              disabled={tab === "preview"}
              onClick={() => runAction(action)}
            >
              <action.icon className="size-3.5" />
            </Button>
          ))}
        </div>
        <TabsList variant="line">
          <TabsTrigger value="write" className="gap-1 text-xs">
            <Pencil className="size-3" />
            Write
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-1 text-xs">
            <Eye className="size-3" />
            Preview
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="write" className="mt-0">
        <Textarea
          ref={textareaRef}
          id={id}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-t-none border-t-0 font-mono text-sm focus-visible:ring-0"
        />
      </TabsContent>
      <TabsContent
        value="preview"
        className="mt-0 overflow-y-auto rounded-b-lg border border-t-0 px-3 py-2"
        style={{ minHeight: `${rows * 1.6}rem` }}
      >
        {value.trim() ? (
          <Markdown content={value} />
        ) : (
          <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
        )}
      </TabsContent>
    </Tabs>
  );
}
