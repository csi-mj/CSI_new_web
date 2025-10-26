// components/CursorWrapper.tsx
'use client';

import TargetCursor from "../TargetCursor";



export function CursorWrapper() {
  return (
    <TargetCursor
      spinDuration={4}
      hideDefaultCursor={false}
    />
  );
}