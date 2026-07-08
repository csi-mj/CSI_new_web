'use client';

import React, { useRef, useState } from 'react';

export function Button({
  children,
  variant = 'primary',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  const styles = {
    primary: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-white/10 hover:bg-white/20 text-white',
    danger: 'bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10'
  } as const;
  return (
    <button
      {...props}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${styles[variant]} ${props.className || ''}`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-400">{label}</span>
      {children}
    </label>
  );
}

export const inputCls =
  'w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none';

export function Modal({
  title,
  onClose,
  children
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-16 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white text-xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Uploads a file to /api/admin/upload and calls onUploaded with the public URL. */
export function FileUpload({
  folder,
  accept,
  label,
  currentUrl,
  onUploaded
}: {
  folder: string;
  accept: string;
  label: string;
  currentUrl?: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setBusy(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(json.error || 'Upload failed');
      return;
    }
    onUploaded(json.url);
  };

  const isImage = accept.includes('image');

  return (
    <div>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-400">{label}</span>
      <div className="flex items-center gap-3">
        {currentUrl && isImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentUrl} alt="preview" className="h-14 w-14 rounded-lg object-cover border border-white/10" />
        )}
        {currentUrl && !isImage && (
          <span className="max-w-[140px] truncate text-xs text-green-400">uploaded ✓</span>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 disabled:opacity-50"
        >
          {busy ? 'Uploading…' : currentUrl ? 'Replace file' : 'Upload file'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = '';
          }}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export async function api(path: string, method: string, body?: unknown) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}

/** Styled replacement for window.confirm(). Usage:
 *  const { confirmDlg, dialog } = useConfirm();
 *  if (!(await confirmDlg('Are you sure?'))) return;  ... and render {dialog} */
export function useConfirm() {
  const [state, setState] = useState<{ message: string; resolve: (v: boolean) => void } | null>(null);

  const confirmDlg = (message: string) =>
    new Promise<boolean>((resolve) => setState({ message, resolve }));

  const close = (value: boolean) => {
    state?.resolve(value);
    setState(null);
  };

  const dialog = state ? (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => close(false)}>
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-2 text-lg font-bold text-white">Are you sure?</h3>
        <p className="mb-6 text-sm text-neutral-300">{state.message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => close(false)}>Cancel</Button>
          <Button onClick={() => close(true)}>Confirm</Button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirmDlg, dialog };
}
