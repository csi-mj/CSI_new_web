'use client';

import { useState } from 'react';
import { BookOpen, CheckCircle2, Download, Eye, HelpCircle, Lightbulb, Mail, Pencil, Users, Wrench, X } from 'lucide-react';

/* =====================================================================
 * E-Certificate "How to Use" guide.
 * Glowing button (top-left, beside the sidebar) mounted once in
 * app/admin/ecert/layout.tsx → available on EVERY e-certificate page.
 * Opens a large popup with a section index + detailed, simple, example-rich
 * explanations of the whole feature.
 * ===================================================================== */

interface Section {
  id: string;
  label: string;
  icon: 'book' | 'pencil' | 'people' | 'eye' | 'mail' | 'check' | 'download' | 'wrench' | 'lightbulb';
  blocks: Array<
    | { type: 'p'; text: string }
    | { type: 'h'; text: string }
    | { type: 'steps'; items: string[] }
    | { type: 'bullets'; items: string[] }
    | { type: 'code'; code: string; caption?: string }
    | { type: 'note'; tone: 'info' | 'warn' | 'tip'; text: string }
    | { type: 'table'; headers: string[]; rows: string[][] }
  >;
}

const SECTIONS: Section[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: 'book',
    blocks: [
      { type: 'p', text: 'The E-Certificate feature lets you design one certificate, personalize it for every participant automatically, check every copy, and email them all — without any external designer or manual emailing.' },
      { type: 'h', text: 'The whole flow in one line' },
      { type: 'steps', items: [
        'Create → choose the event, upload the certificate design (the background).',
        'Design → place text, logos and variables on the interactive canvas.',
        'Save as template & proceed → recipients are imported and previews are generated.',
        'Review → check every participant\'s certificate; fix any single one if needed.',
        'Send → email individually, or in bulk after a double confirmation.',
        'Verify → see real Brevo delivery results; download the certificates as PDF/JPG or ZIP.'
      ]},
      { type: 'h', text: 'Where everything lives' },
      { type: 'table', headers: ['Page', 'What you do there'], rows: [
        ['E-Certificates (the grid)', 'See all your templates; open details; start "Create New and Send".'],
        ['/ecert → new (wizard)', 'Pick the event + upload the certificate background.'],
        ['Designer', 'The canvas: add/edit/move text, images and variables.'],
        ['Send page', 'Import recipients, review previews, write the email, send & verify.'],
        ['Edit design', 'Re-open the designer for a saved template any time.']
      ]},
      { type: 'note', tone: 'tip', text: 'Everything you create is saved in the database instantly (drafts included). Closing the tab never loses your work — reopen the template from the grid and continue.' }
    ]
  },
  {
    id: 'create',
    label: 'Creating a template',
    icon: 'pencil',
    blocks: [
      { type: 'p', text: 'Click the red "Create New and Send" button at the top of the E-Certificates page. A 3-step wizard opens.' },
      { type: 'h', text: 'Step 1 — Choose the event' },
      { type: 'p', text: 'Pick the event this certificate belongs to from the dropdown. Each event shows its poster thumbnail and name, newest first. The template remembers the event title even if the event is deleted later.' },
      { type: 'h', text: 'Step 2 — Upload the certificate' },
      { type: 'bullets', items: [
        'Accepted: PDF, PNG, JPG, JPEG.',
        'A PDF uses its first page and is converted to an image for you automatically (multi-page PDFs are fine — page 1 becomes the certificate).',
        'Large images are shrunk in YOUR browser (longest side ≈ 2200px) before uploading — a small, sharp background is what you\'ll get; nothing over ±3 MB ever travels to the server.',
        'The preview shown after processing is exactly what will be used.'
      ]},
      { type: 'h', text: 'Step 3 — Confirm' },
      { type: 'p', text: 'A summary card confirms the event, name and background size. On confirm, the template is saved immediately as a draft and the designer opens. You can leave at any point — the draft stays in the grid with a "Continue" path.' },
      { type: 'note', tone: 'info', text: '"Output format" (PDF/JPG/JPEG) is chosen later, on the Send page — it controls the file every participant receives attached to their email.' }
    ]
  },
  {
    id: 'design',
    label: 'Designing (canvas)',
    icon: 'pencil',
    blocks: [
      { type: 'p', text: 'The designer is a live canvas over your certificate. Drag with the mouse, resize with corner handles, rotate with the top/bottom handles, and double-click constant text to type directly on it.' },
      { type: 'h', text: '"Add Text/Component"' },
      { type: 'steps', items: [
        'The popup first asks Constant or Variable.',
        'Constant → appears identically on EVERYONE\'s certificate (a title, the event name, a date, a logo).',
        'Variable → is filled per participant from a column of your spreadsheet (most commonly the participant\'s name).',
        'Then pick Text (typed) or Upload image (PNG/JPG/JPEG/PDF — a PDF becomes its first page as an image).'
      ]},
      { type: 'h', text: 'Text editing' },
      { type: 'bullets', items: [
        'Font: 40 hand-picked Google fonts — visible live in the dropdown, loaded instantly when selected (no manual setup).',
        'Size, color, bold / italic / underline, alignment, line height, letter spacing and opacity.',
        'Effects: Shadow (with blur slider) and Outline (with width).',
        'Auto-fit is ON by default: the text can never overflow its box — if content (or a very long participant name) wouldn\'t fit, the font shrinks automatically instead of breaking the layout.',
        'Elements can never be dragged off the certificate.'
      ]},
      { type: 'h', text: 'Variables on the canvas' },
      { type: 'p', text: 'While designing, a variable shows as {name} (single braces = canvas placeholders). At render time, {name} becomes the participant\'s actual value from that column of your uploaded spreadsheet.' },
      { type: 'code', code: 'Canvas shows: {name}\nParticipant "Affan Ahmed" receives: "Affan Ahmed"', caption: 'Single brace = canvas only. Double brace {{...}} = email only. They never mix.' },
      { type: 'h', text: 'Elements list (right panel)' },
      { type: 'bullets', items: [
        'Bottom → top order; use the arrows to change stacking (who draws over whom).',
        'Duplicate any element, or delete it — the canvas removes it instantly.',
        'Click a row to select it on the canvas; everything you change updates live and saves automatically.'
      ]},
      { type: 'note', tone: 'warn', text: 'Editing the design after sending re-renders any not-yet-sent certificates. People who already received a certificate are unaffected (history kept) — resend them explicitly if you want them to get the updated copy.' }
    ]
  },
  {
    id: 'recipients',
    label: 'Recipients & spreadsheets',
    icon: 'people',
    blocks: [
      { type: 'p', text: 'On the Send page, import who should receive certificates. Two ways:' },
      { type: 'h', text: 'Way 1 — Upload CSV / XLSX' },
      { type: 'code', code: 'Name,Email,College,Year\nAffan Ahmed,affan@example.com,MJCET,3rd Year\nPasha,pasha@example.com,MJCET,1st Year', caption: 'Example spreadsheet — the HEADER row becomes the list of variables. The email column is mandatory.' },
      { type: 'bullets', items: [
        '.csv / .xlsx / .xls — processed in your browser (fast, private).',
        'Every column becomes a variable both for the canvas and for the email.',
        'Mark which column is the participant\'s NAME (the blue chip in the report) — from then on the sheet must contain an email column (checked before import and again before sending).',
        'You get a full report before anything is saved: invalid emails, duplicates, empty rows — with the spreadsheet row number of each problem.',
        'Up to 1000 recipients per template.'
      ]},
      { type: 'h', text: 'Way 2 — Load from event participants' },
      { type: 'p', text: 'Pulls the CONFIRMED registrations of the linked event (name + email + everything registered on the form) into the same list — one click, no spreadsheet needed. The columns "participant_name" and "participant_email" become available for emails.' },
      { type: 'h', text: 'Good to know' },
      { type: 'bullets', items: [
        'Re-uploading the same sheet never duplicates people — rows are matched and updated in place.',
        'Importing again later (more rows added) only imports the genuinely new/changed ones.',
        '"Change / re-import list" lets you redo the list at any time.'
      ]},
      { type: 'note', tone: 'tip', text: 'Keep your spreadsheet columns exactly as you want them to appear — the header "Name" is what participants\' names will be read from if you bind it on the canvas.' }
    ]
  },
  {
    id: 'review',
    label: 'Reviewing & fixing',
    icon: 'eye',
    blocks: [
      { type: 'p', text: 'Every recipient gets their own rendered certificate preview in the list. This is the moment to check everything before any email goes out.' },
      { type: 'h', text: 'What the list shows' },
      { type: 'table', headers: ['Sign', 'Meaning'], rows: [
        ['"pending" chip', 'Not rendered / emailed yet — normal before a send.'],
        ['"Render pending/outdated"', 'The design changed since this copy was rendered — it will re-render automatically at send.'],
        ['"No value for {col}"', 'This row has an empty cell for a variable you used on the canvas. Fix the row or send anyway if it\'s intentional.'],
        ['"sent" / "sent ×2"', 'Emailed (×N = how many times).'],
        ['red "Render failed: …"', 'Something failed while building this copy — retry it; the exact reason is shown.']
      ]},
      { type: 'h', text: 'Fixing ONE participant\'s certificate' },
      { type: 'steps', items: [
        'Click the eye icon on their row → the full-size preview opens.',
        'Change any variable value just for them (e.g. fix a spelling of one name) — this is a per-certificate override and doesn\'t touch anyone else.',
        '"Save & re-render" → their preview refreshes immediately with the new value; the row thumbnail updates too.'
      ]},
      { type: 'note', tone: 'tip', text: 'Overriding text for one person never changes the template — other participants keep rendering from the shared design.' }
    ]
  },
  {
    id: 'send',
    label: 'Writing & sending emails',
    icon: 'mail',
    blocks: [
      { type: 'h', text: 'Output format' },
      { type: 'p', text: 'Choose PDF, JPG or JPEG at the top. That is the file each participant gets attached. Changing the format re-renders the not-yet-sent copies in the new format automatically at send time.' },
      { type: 'h', text: 'Writing the email — just type normally' },
      { type: 'bullets', items: [
        'Type text, press Enter, leave blank lines, add emojis — all of it appears EXACTLY like that in the delivered email. No HTML knowledge needed.',
        'Use {{placeholder}} to personalize — click a chip to insert it.',
        'Standard placeholders: participant_name, participant_email, certificate_url (direct link to their copy) — plus any extra columns from your sheet.',
        'The "Live sample preview" shows the exact final email with the first recipient\'s data.',
        'Unknown placeholders are warned about BEFORE sending (they would come out empty).'
      ]},
      { type: 'code', code: 'Dear {{participant_name}},\n\nCongratulations! 🎉 We are pleased to share your e-certificate — it is attached to this email.\n\nWarm regards,\nCSI MJCET Student Chapter', caption: 'A complete, perfectly good email — typed plainly.' },
      { type: 'h', text: 'Official letterhead' },
      { type: 'p', text: 'When ON (default), your message is wrapped in the branded shell like the registration emails: centered CSI logo header + contact footer. The footer identity comes from Admin → Settings. Toggle OFF to send simple bare emails.' },
      { type: 'h', text: 'Sending ONE email' },
      { type: 'p', text: 'The "Email" button on a row sends only that participant\'s certificate. If they already received one, a confirmation asks first — and tells you exactly how many times it has been sent to that address.' },
      { type: 'h', text: 'Sending ALL (bulk)' },
      { type: 'steps', items: [
        'Click "Email all (N)".',
        'First confirmation: summary of how many + which format.',
        'Second confirmation: type the count (e.g. 128) — no accidental mass emails.',
        'The run proceeds one person at a time with rate-limit protection; a live progress panel shows who is being emailed, with a Stop button.',
        'Skips people already emailed; failures never block the rest.'
      ]},
      { type: 'note', tone: 'info', text: 'Closed the browser mid-run? No problem — the run state lives in the database. Reopen the send page and continue; already-sent people are never emailed twice.' }
    ]
  },
  {
    id: 'after',
    label: 'After sending (delivery log)',
    icon: 'check',
    blocks: [
      { type: 'p', text: 'Click "Check delivery status with Brevo" to see the REAL outcome of each email — Brevo accepts sends instantly but can reject them at delivery time, and this surfaces exactly that.' },
      { type: 'table', headers: ['Status', 'Meaning'], rows: [
        ['delivered', 'Provider confirmed the email reached the inbox.'],
        ['in transit', 'Still making its way — typical within a minute of sending.'],
        ['failed + reason', 'Rejected/bounced with the exact reason (e.g. sender not verified).'],
        ['unknown', 'Brevo lookup didn\'t answer — try again shortly.']
      ]},
      { type: 'note', tone: 'warn', text: '"Sending has been rejected because the sender … is not valid. Validate your sender or authenticate your domain" → verify the From address inside Brevo: Transactional → Senders & IP → add + confirm through the emailed link (or authenticate the domain). This setting governs every email the site sends.' },
      { type: 'h', text: 'Resending' },
      { type: 'bullets', items: [
        'Failed rows keep their delivered/undelivered truth and can be resent any time with the row\'s Email button.',
        'The confirmation always shows the count of previous sends so you can\'t accidentally spam someone.'
      ]}
    ]
  },
  {
    id: 'downloads',
    label: 'Downloads',
    icon: 'download',
    blocks: [
      { type: 'h', text: 'One certificate' },
      { type: 'p', text: 'The download icon on each row saves that participant\'s certificate (in the selected format). If it wasn\'t rendered yet, it renders first — downloads always match what would be emailed.' },
      { type: 'h', text: 'All certificates (ZIP)' },
      { type: 'bullets', items: [
        '"Download all (ZIP)" packs everyone\'s certificate into a zip named after the template.',
        'Files are named per participant (ECertificate-<Name>.pdf/jpg).',
        'For big lists the ZIP is delivered in parts (~80 certificates each) so your browser never runs out of memory — just save each part when prompted.',
        'Missing renders are rendered during packing; failed rows are listed at the end instead of silently skipped.'
      ]}
    ]
  },
  {
    id: 'troubleshooting',
    label: 'Troubleshooting & FAQ',
    icon: 'wrench',
    blocks: [
      { type: 'h', text: 'Common situations' },
      { type: 'table', headers: ['Situation', 'What to do'], rows: [
        ['"Render failed: …" on a row', 'Read the reason, fix the row if it\'s a data issue, then click Email — it renders and sends in one go.'],
        ['Emails show as sent but nobody received them', 'Run "Check delivery status" → the reason appears per person. Overwhelmingly the cause: sender not verified in Brevo (see the After-sending section).'],
        ['A participant\'s name is wrong/spelled differently', 'Eye icon → edit → "Save & re-render" — only their copy changes.'],
        ['Want a different certificate for the same event', 'Create New and Send again — multiple templates per event are fine; they show as separate cards.'],
        ['Fonts not loading (blocked network)', 'The canvas falls back and warns you at the top — refresh once internet is back; the design re-applies itself.'],
        ['Left the wizard halfway', 'The draft is in the grid — click "Prepare & Send" (or Edit) to continue.']
      ]},
      { type: 'h', text: 'Limits to remember' },
      { type: 'bullets', items: [
        '1000 recipients per template · each certificate is optimized to stay small (±1–2 MB) so Gmail/Brevo limits are never hit.',
        'One send per minute window is protected by rate-limit backoff — a bulk of 500 takes a few minutes by design.',
        'Every admin API of this feature is strictly authenticated like the rest of the admin portal.'
      ]}
    ]
  },
  {
    id: 'quickref',
    label: 'Quick reference',
    icon: 'lightbulb',
    blocks: [
      { type: 'h', text: 'Cheat sheet' },
      { type: 'table', headers: ['You want to…', 'Do this'], rows: [
        ['Design the certificate', 'Grid → Create New and Send (or Edit design on a card)'],
        ['Add the participant\'s name on the canvas', 'Add Text/Component → Variable → upload sheet → pick the name column'],
        ['Use any other detail (college, year…)', 'Same as above — pick that column; render/bind on canvas or {{column}} in email'],
        ['Fix one person\'s copy', 'Send page → eye icon → edit value → Save & re-render'],
        ['Email one person', 'Row → Email button'],
        ['Email everyone', 'Email all → two confirmations → live progress'],
        ['See who actually received', '"Check delivery status with Brevo"'],
        ['Get the files', 'Row download icon, or "Download all (ZIP)"']
      ]},
      { type: 'h', text: 'The two placeholder types' },
      { type: 'code', code: '{name}            ← canvas artwork (single braces)\n{{participant_name}} ← email subject/body (double braces)\n{{column}}        ← any sheet column, in the email' },
      { type: 'note', tone: 'tip', text: 'Golden rule: design with single-brace variables, email with double-brace ones. The composer sidebar offers exactly what is valid — insert with a click and you can\'t go wrong.' }
    ]
  }
];

type Block = Section['blocks'][number];

export default function HowToGuide() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  const active = SECTIONS.find((s) => s.id === activeId) ?? SECTIONS[0];

  return (
    <>
      {/* glowing button — fixed beside the sidebar on every /admin/ecert page */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open How to Use guide"
        className="fixed left-3 top-16 z-40 flex items-center gap-1.5 rounded-full border border-red-500/60 bg-neutral-900/90 px-3 py-2 text-xs font-bold text-red-300 backdrop-blur transition hover:text-white md:left-[236px] md:top-5"
        style={{ animation: 'ecertGuideGlow 2.2s ease-in-out infinite' }}
      >
        <BookOpen size={14} />
        How to Use
      </button>

      <style>{`
        @keyframes ecertGuideGlow {
          0%, 100% { box-shadow: 0 0 6px rgba(239,68,68,0.55), 0 0 16px rgba(239,68,68,0.30); }
          50% { box-shadow: 0 0 12px rgba(239,68,68,0.9), 0 0 28px rgba(239,68,68,0.5), inset 0 0 8px rgba(239,68,68,0.18); }
        }
      `}</style>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm md:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex h-full max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <BookOpen size={18} className="text-red-400" />
                <div>
                  <h2 className="font-orbitron text-base font-bold text-white">E-Certificate — How to Use</h2>
                  <p className="text-[11px] text-neutral-500">Everything about designing, sending and tracking certificates</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close guide" className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* body: section index + content */}
            <div className="flex min-h-0 flex-1 flex-col md:flex-row">
              {/* section nav */}
              <nav className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-white/10 p-3 md:w-56 md:flex-col md:overflow-y-auto md:border-b-0 md:border-r">
                {SECTIONS.map((s, i) => {
                  const activeS = s.id === activeId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveId(s.id)}
                      className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-left text-xs font-semibold transition md:whitespace-normal ${
                        activeS ? 'bg-red-600 text-white' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <SectionIcon kind={s.icon} />
                      <span className="hidden text-[10px] opacity-50 md:inline">{i + 1}.</span>
                      {s.label}
                    </button>
                  );
                })}
              </nav>

              {/* content */}
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 md:px-7">
                <h3 className="mb-3 font-orbitron text-lg font-bold text-white">{active.label}</h3>
                <div className="space-y-3">
                  {active.blocks.map((b, i) => (
                    <BlockView key={i} block={b} />
                  ))}
                  <div className="flex justify-between pt-4">
                    <button
                      disabled={active.id === SECTIONS[0].id}
                      onClick={() => {
                        const i = SECTIONS.findIndex((s) => s.id === active.id);
                        setActiveId(SECTIONS[Math.max(0, i - 1)].id);
                      }}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-400 hover:text-white disabled:opacity-30"
                    >
                      ← Previous
                    </button>
                    <button
                      disabled={active.id === SECTIONS[SECTIONS.length - 1].id}
                      onClick={() => {
                        const i = SECTIONS.findIndex((s) => s.id === active.id);
                        setActiveId(SECTIONS[Math.min(SECTIONS.length - 1, i + 1)].id);
                      }}
                      className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 disabled:opacity-30"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SectionIcon({ kind }: { kind: Section['icon'] }) {
  const cls = 'shrink-0';
  switch (kind) {
    case 'book': return <BookOpen size={13} className={cls} />;
    case 'pencil': return <Pencil size={13} className={cls} />;
    case 'people': return <Users size={13} className={cls} />;
    case 'eye': return <Eye size={13} className={cls} />;
    case 'mail': return <Mail size={13} className={cls} />;
    case 'check': return <CheckCircle2 size={13} className={cls} />;
    case 'download': return <Download size={13} className={cls} />;
    case 'wrench': return <Wrench size={13} className={cls} />;
    case 'lightbulb': return <Lightbulb size={13} className={cls} />;
    default: return <BookOpen size={13} className={cls} />;
  }
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'h':
      return <h4 className="mt-4 border-b border-white/10 pb-1.5 text-sm font-bold tracking-wide text-white">{block.text}</h4>;
    case 'p':
      return <p className="text-[13px] leading-relaxed text-neutral-300">{block.text}</p>;
    case 'steps':
      return (
        <ol className="ml-1 space-y-1.5">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-neutral-300">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600/20 text-[9px] font-bold text-red-300">{i + 1}</span>
              <span>{it}</span>
            </li>
          ))}
        </ol>
      );
    case 'bullets':
      return (
        <ul className="ml-1 space-y-1.5">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-neutral-300">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-red-400" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case 'code':
      return (
        <div>
          <pre className="overflow-x-auto rounded-lg border border-white/10 bg-neutral-900 px-3.5 py-2.5 font-mono text-[11px] leading-relaxed text-emerald-200">{block.code}</pre>
          {block.caption && <p className="mt-1 text-[10px] text-neutral-500">{block.caption}</p>}
        </div>
      );
    case 'note': {
      const tones = {
        info: 'border-blue-500/30 bg-blue-500/10 text-blue-200',
        warn: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
        tip: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
      } as const;
      const lead = block.tone === 'warn' ? '⚠️ ' : block.tone === 'tip' ? '💡 ' : 'ℹ️ ';
      return (
        <p className={`rounded-lg border px-3 py-2 text-[12px] leading-relaxed ${tones[block.tone]}`}>
          <span className="mr-1">{lead}</span>{block.text}
        </p>
      );
    }
    case 'table':
      return (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-white/10 bg-neutral-900">
                {block.headers.map((h) => (
                  <th key={h} className="whitespace-nowrap px-3 py-2 font-bold text-white">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-white/5 last:border-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className={`px-3 py-2 leading-relaxed ${ci === 0 ? 'font-semibold text-neutral-200' : 'text-neutral-400'}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}