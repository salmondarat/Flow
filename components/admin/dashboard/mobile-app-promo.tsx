"use client";

import { Download, Smartphone } from "lucide-react";

export function MobileAppPromo() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 p-5 text-white">
      {/* Background decoration */}
      <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-emerald-800/50 blur-xl" />
      <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-emerald-700/30 blur-2xl" />

      {/* Icon */}
      <div className="relative z-10 mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800">
        <Smartphone className="h-5 w-5 text-emerald-200" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h4 className="mb-1 text-sm font-semibold">Download our</h4>
        <h3 className="mb-2 text-lg font-bold">Mobile App</h3>
        <p className="mb-4 text-xs text-emerald-200">Get easy in another way</p>

        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-medium transition-colors hover:bg-emerald-500">
          <Download className="h-3.5 w-3.5" />
          Download
        </button>
      </div>
    </div>
  );
}
