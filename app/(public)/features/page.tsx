"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import nextDynamic from "next/dynamic";
import {
  ArrowRight,
  Check,
  Sparkles,
  Zap,
  BarChart3,
  MessageSquare,
  Users,
  Shield,
  Package,
  Play,
} from "lucide-react";

// Dynamic import for Header to prevent SSR issues
const Header = nextDynamic(() => import("@/components/layout/header").then((mod) => mod.Header));
const Footer = nextDynamic(() => import("@/components/layout/footer").then((mod) => mod.Footer));

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Scroll-triggered animation hook
function useInView(ref: React.RefObject<HTMLDivElement | null>, options = {}) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, ...options }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref, options]);

  return isInView;
}

// Skeleton SVG Components for App UI Previews
const SkeletonOrderIntake = () => (
  <svg
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-auto w-full"
  >
    {/* Window frame */}
    <rect x="0" y="0" width="400" height="300" rx="12" fill="currentColor" fillOpacity="0.05" />
    <rect
      x="0"
      y="0"
      width="400"
      height="300"
      rx="12"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.1"
    />

    {/* Header */}
    <rect x="0" y="0" width="400" height="48" rx="12" fill="currentColor" fillOpacity="0.03" />
    <rect x="0" y="48" width="400" height="1" fill="currentColor" fillOpacity="0.05" />

    {/* Title area */}
    <rect x="24" y="20" width="200" height="12" rx="4" fill="currentColor" fillOpacity="0.15" />

    {/* Form fields */}
    <rect x="24" y="72" width="352" height="44" rx="8" fill="currentColor" fillOpacity="0.08" />
    <rect x="24" y="76" width="80" height="10" rx="3" fill="currentColor" fillOpacity="0.2" />
    <rect x="24" y="140" width="352" height="44" rx="8" fill="currentColor" fillOpacity="0.08" />
    <rect x="24" y="144" width="60" height="10" rx="3" fill="currentColor" fillOpacity="0.2" />
    <rect x="24" y="208" width="170" height="44" rx="8" fill="currentColor" fillOpacity="0.08" />
    <rect x="206" y="208" width="170" height="44" rx="8" fill="currentColor" fillOpacity="0.08" />

    {/* Select dropdown indicators */}
    <circle cx="370" cy="94" r="4" fill="currentColor" fillOpacity="0.2" />
    <circle cx="370" cy="162" r="4" fill="currentColor" fillOpacity="0.2" />

    {/* Progress indicator */}
    <rect x="24" y="272" width="80" height="8" rx="4" fill="currentColor" fillOpacity="0.15" />
    <rect x="114" y="272" width="80" height="8" rx="4" fill="currentColor" fillOpacity="0.08" />
    <rect x="204" y="272" width="80" height="8" rx="4" fill="currentColor" fillOpacity="0.08" />
  </svg>
);

const SkeletonAI = () => (
  <svg
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-auto w-full"
  >
    <rect x="0" y="0" width="400" height="300" rx="12" fill="currentColor" fillOpacity="0.05" />
    <rect
      x="0"
      y="0"
      width="400"
      height="300"
      rx="12"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.1"
    />

    {/* AI Panel header */}
    <rect x="0" y="0" width="400" height="48" rx="12" fill="currentColor" fillOpacity="0.03" />
    <rect x="0" y="48" width="400" height="1" fill="currentColor" fillOpacity="0.05" />

    {/* Sparkle icon */}
    <g opacity="0.3">
      <path d="M36 28L38 32L42 34L38 36L36 40L34 36L30 34L34 32L36 28Z" fill="currentColor" />
    </g>
    <rect x="52" y="24" width="120" height="12" rx="4" fill="currentColor" fillOpacity="0.15" />

    {/* Price suggestion card */}
    <rect x="24" y="72" width="352" height="120" rx="12" fill="currentColor" fillOpacity="0.08" />
    <rect
      x="24"
      y="72"
      width="352"
      height="120"
      rx="12"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.1"
    />

    {/* Large price */}
    <text x="48" y="120" fill="currentColor" fillOpacity="0.3" fontSize="32" fontWeight="bold">
      $450
    </text>
    <rect x="48" y="136" width="140" height="8" rx="4" fill="currentColor" fillOpacity="0.15" />

    {/* Confidence badge */}
    <rect x="300" y="88" width="56" height="20" rx="10" fill="currentColor" fillOpacity="0.15" />
    <rect x="310" y="96" width="36" height="4" rx="2" fill="currentColor" fillOpacity="0.3" />

    {/* Breakdown */}
    <rect x="48" y="164" width="60" height="6" rx="3" fill="currentColor" fillOpacity="0.12" />
    <rect x="312" y="164" width="40" height="6" rx="3" fill="currentColor" fillOpacity="0.12" />
    <rect x="48" y="178" width="60" height="6" rx="3" fill="currentColor" fillOpacity="0.12" />
    <rect x="312" y="178" width="40" height="6" rx="3" fill="currentColor" fillOpacity="0.12" />

    {/* Action buttons */}
    <rect x="24" y="216" width="168" height="44" rx="8" fill="currentColor" fillOpacity="0.15" />
    <rect x="208" y="216" width="168" height="44" rx="8" fill="currentColor" fillOpacity="0.08" />
    <rect
      x="24"
      y="216"
      width="168"
      height="44"
      rx="8"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.1"
    />

    {/* Adjust slider */}
    <rect x="24" y="280" width="352" height="4" rx="2" fill="currentColor" fillOpacity="0.08" />
    <circle cx="200" cy="282" r="8" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

const SkeletonProgress = () => (
  <svg
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-auto w-full"
  >
    <rect x="0" y="0" width="400" height="300" rx="12" fill="currentColor" fillOpacity="0.05" />
    <rect
      x="0"
      y="0"
      width="400"
      height="300"
      rx="12"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.1"
    />

    {/* Timeline vertical line */}
    <line
      x1="48"
      y1="48"
      x2="48"
      y2="272"
      stroke="currentColor"
      strokeWidth="2"
      strokeOpacity="0.1"
    />

    {/* Milestone 1 - Complete */}
    <circle cx="48" cy="64" r="12" fill="currentColor" fillOpacity="0.15" />
    <rect x="72" y="52" width="280" height="24" rx="6" fill="currentColor" fillOpacity="0.08" />
    <rect
      x="72"
      y="52"
      width="280"
      height="24"
      rx="6"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.1"
    />
    <circle cx="48" cy="64" r="5" fill="currentColor" fillOpacity="0.4" />

    {/* Milestone 2 - Complete */}
    <circle cx="48" cy="116" r="12" fill="currentColor" fillOpacity="0.15" />
    <rect x="72" y="104" width="280" height="24" rx="6" fill="currentColor" fillOpacity="0.08" />
    <circle cx="48" cy="116" r="5" fill="currentColor" fillOpacity="0.4" />

    {/* Milestone 3 - In Progress */}
    <circle cx="48" cy="168" r="12" fill="currentColor" fillOpacity="0.2" />
    <rect x="72" y="152" width="280" height="32" rx="8" fill="currentColor" fillOpacity="0.12" />
    <rect
      x="72"
      y="152"
      width="280"
      height="32"
      rx="8"
      stroke="currentColor"
      strokeWidth="2"
      strokeOpacity="0.2"
    />
    <circle cx="48" cy="168" r="5" fill="currentColor" fillOpacity="0.6" />
    <rect x="88" y="164" width="60" height="8" rx="4" fill="currentColor" fillOpacity="0.2" />

    {/* Milestone 4 - Pending */}
    <circle
      cx="48"
      cy="220"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      strokeOpacity="0.2"
      fill="none"
    />
    <rect x="72" y="208" width="200" height="24" rx="6" fill="currentColor" fillOpacity="0.05" />

    {/* Upload photo indicator */}
    <rect x="72" y="248" width="80" height="24" rx="6" fill="currentColor" fillOpacity="0.08" />
  </svg>
);

const SkeletonAnalytics = () => (
  <svg
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-auto w-full"
  >
    <rect x="0" y="0" width="400" height="300" rx="12" fill="currentColor" fillOpacity="0.05" />
    <rect
      x="0"
      y="0"
      width="400"
      height="300"
      rx="12"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.1"
    />

    {/* Header */}
    <rect x="0" y="0" width="400" height="48" rx="12" fill="currentColor" fillOpacity="0.03" />
    <rect x="24" y="20" width="100" height="12" rx="4" fill="currentColor" fillOpacity="0.15" />

    {/* Stats row */}
    <rect x="24" y="64" width="92" height="60" rx="8" fill="currentColor" fillOpacity="0.08" />
    <rect x="128" y="64" width="92" height="60" rx="8" fill="currentColor" fillOpacity="0.08" />
    <rect x="232" y="64" width="92" height="60" rx="8" fill="currentColor" fillOpacity="0.08" />
    <rect x="336" y="64" width="40" height="60" rx="8" fill="currentColor" fillOpacity="0.05" />

    {/* Chart area */}
    <rect x="24" y="140" width="352" height="120" rx="8" fill="currentColor" fillOpacity="0.05" />
    <rect
      x="24"
      y="140"
      width="352"
      height="120"
      rx="8"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.08"
    />

    {/* Chart bars */}
    <rect x="36" y="200" width="20" height="44" rx="4" fill="currentColor" fillOpacity="0.15" />
    <rect x="68" y="180" width="20" height="64" rx="4" fill="currentColor" fillOpacity="0.15" />
    <rect x="100" y="220" width="20" height="24" rx="4" fill="currentColor" fillOpacity="0.15" />
    <rect x="132" y="190" width="20" height="54" rx="4" fill="currentColor" fillOpacity="0.2" />
    <rect x="164" y="170" width="20" height="74" rx="4" fill="currentColor" fillOpacity="0.2" />
    <rect x="196" y="210" width="20" height="34" rx="4" fill="currentColor" fillOpacity="0.15" />
    <rect x="228" y="160" width="20" height="84" rx="4" fill="currentColor" fillOpacity="0.25" />
    <rect x="260" y="185" width="20" height="59" rx="4" fill="currentColor" fillOpacity="0.2" />
    <rect x="292" y="175" width="20" height="69" rx="4" fill="currentColor" fillOpacity="0.22" />
    <rect x="324" y="195" width="20" height="49" rx="4" fill="currentColor" fillOpacity="0.18" />
    <rect x="356" y="205" width="20" height="39" rx="4" fill="currentColor" fillOpacity="0.15" />

    {/* Chart line overlay */}
    <polyline
      points="46,200 78,180 110,220 142,190 174,170 206,210 238,160 270,185 302,175 334,195 366,205"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeOpacity="0.3"
    />

    {/* X-axis labels */}
    <rect x="36" y="276" width="16" height="4" rx="2" fill="currentColor" fillOpacity="0.1" />
    <rect x="100" y="276" width="16" height="4" rx="2" fill="currentColor" fillOpacity="0.1" />
    <rect x="164" y="276" width="16" height="4" rx="2" fill="currentColor" fillOpacity="0.1" />
    <rect x="228" y="276" width="16" height="4" rx="2" fill="currentColor" fillOpacity="0.1" />
    <rect x="292" y="276" width="16" height="4" rx="2" fill="currentColor" fillOpacity="0.1" />
    <rect x="356" y="276" width="16" height="4" rx="2" fill="currentColor" fillOpacity="0.1" />
  </svg>
);

const SkeletonMessages = () => (
  <svg
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-auto w-full"
  >
    <rect x="0" y="0" width="400" height="300" rx="12" fill="currentColor" fillOpacity="0.05" />
    <rect
      x="0"
      y="0"
      width="400"
      height="300"
      rx="12"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.1"
    />

    {/* Header */}
    <rect x="0" y="0" width="400" height="56" rx="12" fill="currentColor" fillOpacity="0.03" />
    <rect x="0" y="56" width="400" height="1" fill="currentColor" fillOpacity="0.05" />

    {/* Avatar */}
    <circle cx="40" cy="28" r="16" fill="currentColor" fillOpacity="0.15" />
    <rect x="68" y="20" width="100" height="8" rx="4" fill="currentColor" fillOpacity="0.15" />
    <rect x="68" y="32" width="60" height="6" rx="3" fill="currentColor" fillOpacity="0.1" />

    {/* Message from client - using path for asymmetric rounded corners */}
    <path
      d="M28 80 H188 A12 12 0 0 1 200 92 V116 A12 12 0 0 1 188 128 H36 A4 4 0 0 1 32 124 V92 A4 4 0 0 1 36 88 Z"
      fill="currentColor"
      fillOpacity="0.08"
    />
    <rect x="36" y="92" width="100" height="8" rx="4" fill="currentColor" fillOpacity="0.15" />
    <rect x="36" y="104" width="140" height="8" rx="4" fill="currentColor" fillOpacity="0.12" />

    {/* Message from builder - using path for asymmetric rounded corners */}
    <path
      d="M196 144 H364 A4 4 0 0 1 368 148 V196 A4 4 0 0 1 364 200 H212 A12 12 0 0 1 200 188 V164 A12 12 0 0 1 212 152 H364 Z"
      fill="currentColor"
      fillOpacity="0.15"
    />
    <rect x="208" y="156" width="120" height="8" rx="4" fill="currentColor" fillOpacity="0.25" />
    <rect x="208" y="168" width="150" height="8" rx="4" fill="currentColor" fillOpacity="0.2" />
    <rect x="208" y="180" width="80" height="8" rx="4" fill="currentColor" fillOpacity="0.18" />

    {/* Photo attachment indicator */}
    <rect x="208" y="192" width="48" height="8" rx="4" fill="currentColor" fillOpacity="0.15" />

    {/* Message from client 2 - using path for asymmetric rounded corners */}
    <path
      d="M28 224 H228 A12 12 0 0 1 240 236 V248 A12 12 0 0 1 228 260 H36 A4 4 0 0 1 32 256 V236 A4 4 0 0 1 36 232 Z"
      fill="currentColor"
      fillOpacity="0.08"
    />
    <rect x="36" y="236" width="140" height="8" rx="4" fill="currentColor" fillOpacity="0.15" />
    <rect x="36" y="248" width="100" height="8" rx="4" fill="currentColor" fillOpacity="0.12" />

    {/* Input area */}
    <rect x="24" y="276" width="300" height="16" rx="8" fill="currentColor" fillOpacity="0.06" />
    <circle cx="348" cy="284" r="12" fill="currentColor" fillOpacity="0.15" />
  </svg>
);

const SkeletonTeam = () => (
  <svg
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-auto w-full"
  >
    <rect x="0" y="0" width="400" height="300" rx="12" fill="currentColor" fillOpacity="0.05" />
    <rect
      x="0"
      y="0"
      width="400"
      height="300"
      rx="12"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.1"
    />

    {/* Team member 1 */}
    <rect x="24" y="24" width="352" height="56" rx="10" fill="currentColor" fillOpacity="0.06" />
    <circle cx="56" cy="52" r="16" fill="currentColor" fillOpacity="0.15" />
    <rect x="84" y="40" width="100" height="10" rx="4" fill="currentColor" fillOpacity="0.18" />
    <rect x="84" y="56" width="60" height="6" rx="3" fill="currentColor" fillOpacity="0.12" />
    <rect x="300" y="42" width="64" height="20" rx="6" fill="currentColor" fillOpacity="0.1" />

    {/* Team member 2 */}
    <rect x="24" y="92" width="352" height="56" rx="10" fill="currentColor" fillOpacity="0.06" />
    <circle cx="56" cy="120" r="16" fill="currentColor" fillOpacity="0.15" />
    <rect x="84" y="108" width="90" height="10" rx="4" fill="currentColor" fillOpacity="0.18" />
    <rect x="84" y="124" width="70" height="6" rx="3" fill="currentColor" fillOpacity="0.12" />
    <rect x="300" y="110" width="64" height="20" rx="6" fill="currentColor" fillOpacity="0.1" />

    {/* Team member 3 */}
    <rect x="24" y="160" width="352" height="56" rx="10" fill="currentColor" fillOpacity="0.06" />
    <circle cx="56" cy="188" r="16" fill="currentColor" fillOpacity="0.15" />
    <rect x="84" y="176" width="110" height="10" rx="4" fill="currentColor" fillOpacity="0.18" />
    <rect x="84" y="192" width="55" height="6" rx="3" fill="currentColor" fillOpacity="0.12" />
    <rect x="300" y="178" width="64" height="20" rx="6" fill="currentColor" fillOpacity="0.1" />

    {/* Add member button */}
    <rect
      x="24"
      y="228"
      width="352"
      height="48"
      rx="10"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.2"
      fill="none"
      strokeDasharray="4 4"
    />
    <circle
      cx="56"
      cy="252"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      strokeOpacity="0.3"
      fill="none"
    />
    <line
      x1="56"
      y1="246"
      x2="56"
      y2="258"
      stroke="currentColor"
      strokeWidth="2"
      strokeOpacity="0.3"
    />
    <line
      x1="50"
      y1="252"
      x2="62"
      y2="252"
      stroke="currentColor"
      strokeWidth="2"
      strokeOpacity="0.3"
    />
    <rect x="84" y="244" width="120" height="8" rx="4" fill="currentColor" fillOpacity="0.1" />
  </svg>
);

const SkeletonPayments = () => (
  <svg
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-auto w-full"
  >
    <rect x="0" y="0" width="400" height="300" rx="12" fill="currentColor" fillOpacity="0.05" />
    <rect
      x="0"
      y="0"
      width="400"
      height="300"
      rx="12"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.1"
    />

    {/* Invoice card */}
    <rect x="24" y="24" width="352" height="120" rx="10" fill="currentColor" fillOpacity="0.08" />
    <rect
      x="24"
      y="24"
      width="352"
      height="120"
      rx="10"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.1"
    />

    {/* Invoice header */}
    <rect x="48" y="48" width="80" height="10" rx="4" fill="currentColor" fillOpacity="0.15" />
    <rect x="320" y="48" width="32" height="10" rx="4" fill="currentColor" fillOpacity="0.1" />

    {/* Invoice details */}
    <rect x="48" y="72" width="120" height="8" rx="4" fill="currentColor" fillOpacity="0.12" />
    <rect x="48" y="88" width="100" height="8" rx="4" fill="currentColor" fillOpacity="0.12" />
    <rect x="48" y="104" width="80" height="8" rx="4" fill="currentColor" fillOpacity="0.12" />

    {/* Total */}
    <rect x="240" y="104" width="100" height="20" rx="6" fill="currentColor" fillOpacity="0.15" />

    {/* Payment status */}
    <rect x="48" y="128" width="64" height="8" rx="4" fill="currentColor" fillOpacity="0.1" />

    {/* Payment method */}
    <rect x="24" y="168" width="352" height="64" rx="10" fill="currentColor" fillOpacity="0.06" />
    <rect x="48" y="192" width="100" height="8" rx="4" fill="currentColor" fillOpacity="0.15" />
    <rect x="48" y="208" width="140" height="8" rx="4" fill="currentColor" fillOpacity="0.12" />

    {/* Card icon */}
    <rect x="320" y="188" width="32" height="20" rx="4" fill="currentColor" fillOpacity="0.15" />
    <rect x="324" y="192" width="20" height="4" rx="2" fill="currentColor" fillOpacity="0.25" />
    <rect x="324" y="200" width="12" height="4" rx="2" fill="currentColor" fillOpacity="0.2" />

    {/* History */}
    <rect x="24" y="256" width="352" height="32" rx="8" fill="currentColor" fillOpacity="0.04" />
    <rect x="48" y="268" width="60" height="6" rx="3" fill="currentColor" fillOpacity="0.1" />
    <rect x="312" y="268" width="48" height="6" rx="3" fill="currentColor" fillOpacity="0.1" />
  </svg>
);

const SkeletonInventory = () => (
  <svg
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-auto w-full"
  >
    <rect x="0" y="0" width="400" height="300" rx="12" fill="currentColor" fillOpacity="0.05" />
    <rect
      x="0"
      y="0"
      width="400"
      height="300"
      rx="12"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.1"
    />

    {/* Header with search */}
    <rect x="0" y="0" width="400" height="56" rx="12" fill="currentColor" fillOpacity="0.03" />
    <rect x="0" y="56" width="400" height="1" fill="currentColor" fillOpacity="0.05" />
    <rect x="24" y="20" width="60" height="12" rx="4" fill="currentColor" fillOpacity="0.15" />
    <rect x="248" y="16" width="128" height="28" rx="8" fill="currentColor" fillOpacity="0.06" />

    {/* Category tabs */}
    <rect x="24" y="72" width="60" height="24" rx="6" fill="currentColor" fillOpacity="0.12" />
    <rect x="92" y="72" width="60" height="24" rx="6" fill="currentColor" fillOpacity="0.06" />
    <rect x="160" y="72" width="60" height="24" rx="6" fill="currentColor" fillOpacity="0.06" />
    <rect x="228" y="72" width="60" height="24" rx="6" fill="currentColor" fillOpacity="0.06" />

    {/* Inventory item 1 - Low stock warning */}
    <rect x="24" y="112" width="352" height="48" rx="8" fill="currentColor" fillOpacity="0.06" />
    <rect x="40" y="124" width="80" height="8" rx="4" fill="currentColor" fillOpacity="0.15" />
    <rect x="40" y="140" width="50" height="6" rx="3" fill="currentColor" fillOpacity="0.1" />
    <rect x="300" y="124" width="48" height="20" rx="6" fill="currentColor" fillOpacity="0.08" />
    <rect
      x="300"
      y="124"
      width="48"
      height="20"
      rx="6"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.2"
      fill="none"
    />
    <circle cx="348" cy="136" r="4" fill="currentColor" fillOpacity="0.3" />

    {/* Inventory item 2 */}
    <rect x="24" y="172" width="352" height="48" rx="8" fill="currentColor" fillOpacity="0.06" />
    <rect x="40" y="184" width="70" height="8" rx="4" fill="currentColor" fillOpacity="0.15" />
    <rect x="40" y="200" width="45" height="6" rx="3" fill="currentColor" fillOpacity="0.1" />
    <rect x="300" y="184" width="48" height="20" rx="6" fill="currentColor" fillOpacity="0.1" />

    {/* Inventory item 3 */}
    <rect x="24" y="232" width="352" height="48" rx="8" fill="currentColor" fillOpacity="0.06" />
    <rect x="40" y="244" width="90" height="8" rx="4" fill="currentColor" fillOpacity="0.15" />
    <rect x="40" y="260" width="55" height="6" rx="3" fill="currentColor" fillOpacity="0.1" />
    <rect x="300" y="244" width="48" height="20" rx="6" fill="currentColor" fillOpacity="0.1" />
  </svg>
);

// ClipboardList icon component
const ClipboardList = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M9 14h6" />
    <path d="M9 10h6" />
    <path d="M9 18h6" />
  </svg>
);

// Feature data
const features = [
  {
    id: 1,
    icon: <ClipboardList className="h-5 w-5" />,
    title: "Smart Order Intake",
    description:
      "Customizable intake forms capture every detail—scale, grade, paint preferences—filtering out noise and saving you valuable time on back-and-forth communications.",
    details: [
      "Drag-and-drop form builder",
      "Custom field validation",
      "Kit database integration",
      "Automatic client notifications",
    ],
    Skeleton: SkeletonOrderIntake,
    gradient: "from-blue-500 to-cyan-400",
    accent: "text-blue-500",
  },
  {
    id: 2,
    icon: <Sparkles className="h-5 w-5" />,
    title: "AI Estimation",
    description:
      "Stop guessing prices. Our AI analyzes kit complexity, part count, paint requirements, and historical data to suggest accurate quotes instantly.",
    details: [
      "Complexity-based pricing",
      "Historical data learning",
      "One-click quote generation",
      "Editable AI suggestions",
    ],
    Skeleton: SkeletonAI,
    gradient: "from-purple-500 to-pink-400",
    accent: "text-purple-500",
  },
  {
    id: 3,
    icon: <Zap className="h-5 w-5" />,
    title: "Progress Tracking",
    description:
      "Keep clients updated with a dedicated uplink portal. Upload WIP photos, mark milestones, and provide transparency that builds trust and reduces anxiety.",
    details: [
      "Visual milestone timeline",
      "Photo upload for each stage",
      "Client notification triggers",
      "Estimated completion dates",
    ],
    Skeleton: SkeletonProgress,
    gradient: "from-orange-500 to-yellow-400",
    accent: "text-orange-500",
  },
  {
    id: 4,
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Analytics Dashboard",
    description:
      "Track revenue, turnaround times, and team productivity with beautiful visualizations that turn your data into actionable insights.",
    details: [
      "Revenue forecasting",
      "Turnaround time analysis",
      "Team performance metrics",
      "Custom report generation",
    ],
    Skeleton: SkeletonAnalytics,
    gradient: "from-emerald-500 to-teal-400",
    accent: "text-emerald-500",
  },
  {
    id: 5,
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Client Communication",
    description:
      "Built-in messaging keeps everyone aligned. Share updates, answer questions, and build lasting relationships with clients who return again and again.",
    details: ["In-app messaging", "File sharing", "Read receipts", "Message templates"],
    Skeleton: SkeletonMessages,
    gradient: "from-indigo-500 to-blue-400",
    accent: "text-indigo-500",
  },
  {
    id: 6,
    icon: <Users className="h-5 w-5" />,
    title: "Team Management",
    description:
      "Scale from solo builder to multi-operator studio. Assign roles, track performance, and manage your growing team with tools designed for creative businesses.",
    details: [
      "Role-based permissions",
      "Task assignment",
      "Performance tracking",
      "Onboarding workflows",
    ],
    Skeleton: SkeletonTeam,
    gradient: "from-rose-500 to-red-400",
    accent: "text-rose-500",
  },
  {
    id: 7,
    icon: <Shield className="h-5 w-5" />,
    title: "Secure Payments",
    description:
      "Professional invoicing and secure payment processing. Get paid on time, every time, with automated reminders and tracking for every transaction.",
    details: [
      "Professional invoices",
      "Multiple payment methods",
      "Automated reminders",
      "Payment history",
    ],
    Skeleton: SkeletonPayments,
    gradient: "from-violet-500 to-purple-400",
    accent: "text-violet-500",
  },
  {
    id: 8,
    icon: <Package className="h-5 w-5" />,
    title: "Inventory Tracking",
    description:
      "Never run out of supplies. Track paints, tools, and kit inventory in one unified system with low-stock alerts and reorder suggestions.",
    details: [
      "Multi-category tracking",
      "Low-stock alerts",
      "Supplier management",
      "Usage analytics",
    ],
    Skeleton: SkeletonInventory,
    gradient: "from-cyan-500 to-blue-400",
    accent: "text-cyan-500",
  },
];

// Individual Feature Card Component
function FeatureCard({
  feature,
  index,
  isLight,
}: {
  feature: (typeof features)[0];
  index: number;
  isLight: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative grid items-center gap-12 py-24 transition-all duration-1000 lg:grid-cols-2 lg:gap-20 ${
        isInView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Content Side */}
      <div className={`space-y-8 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
        {/* Feature badge */}
        <div className="inline-flex items-center gap-2">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${feature.gradient} text-white shadow-lg`}
          >
            {feature.icon}
          </div>
          <span className={`text-sm font-semibold tracking-wider uppercase ${feature.accent}`}>
            Feature {index + 1}
          </span>
        </div>

        {/* Title */}
        <h2
          className={`text-4xl font-bold tracking-tight sm:text-5xl ${isLight ? "text-zinc-900" : "text-white"}`}
        >
          {feature.title}
        </h2>

        {/* Description */}
        <p className={`text-lg leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
          {feature.description}
        </p>

        {/* Feature details list */}
        <ul className="space-y-4">
          {feature.details.map((detail, i) => (
            <li key={i} className="flex items-start gap-3">
              <div
                className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${feature.gradient} text-white`}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </div>
              <span className={`text-base ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>
                {detail}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Skeleton UI Preview Side */}
      <div className={`${isEven ? "lg:order-2" : "lg:order-1"}`}>
        <div
          className={`relative overflow-hidden rounded-3xl border-2 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] ${
            isLight
              ? "border-zinc-900/10 bg-white/50 shadow-zinc-900/10"
              : "border-white/10 bg-zinc-900/50 shadow-white/10"
          }`}
        >
          {/* Gradient glow behind */}
          <div
            className={`absolute -inset-4 bg-linear-to-br ${feature.gradient} opacity-0 blur-3xl`}
          />
          <feature.Skeleton />
        </div>
      </div>

      {/* Decorative line for odd/even rhythm */}
      <div
        className={`absolute inset-0 -z-10 flex items-center justify-center opacity-0 lg:opacity-100 ${
          isEven ? "lg:justify-start" : "lg:justify-end"
        }`}
      >
        <div
          className={`h-px w-32 ${isLight ? "bg-linear-to-r from-transparent via-zinc-200 to-transparent" : "bg-linear-to-r from-transparent via-zinc-800 to-transparent"}`}
        />
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isLight ? "bg-white text-zinc-900" : "bg-zinc-950 text-white"
      }`}
    >
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient mesh */}
          <div className="absolute inset-0 -z-10">
            <div
              className={`absolute top-0 left-1/2 h-200 w-200 -translate-x-1/2 rounded-full blur-3xl ${
                isLight
                  ? "bg-linear-to-br from-blue-100 via-indigo-50 to-transparent opacity-50"
                  : "bg-linear-to-br from-blue-900/20 via-indigo-900/10 to-transparent opacity-50"
              }`}
            />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <div
                className={`mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md transition-colors ${
                  isLight
                    ? "border-zinc-900/10 bg-zinc-900/5 hover:bg-zinc-900/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <Sparkles className={`h-4 w-4 ${isLight ? "text-zinc-600" : "text-zinc-400"}`} />
                <span
                  className={`text-xs font-semibold tracking-wider uppercase ${isLight ? "text-zinc-700" : "text-zinc-300"}`}
                >
                  Powerful Tools
                </span>
              </div>

              {/* Heading */}
              <h1 className="mb-8 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Everything you need to
                <span
                  className={`block bg-linear-to-br bg-clip-text text-transparent ${isLight ? "from-zinc-900 via-zinc-800 to-[#ffcd75]" : "from-white via-white to-[#ffcd75]"}`}
                >
                  manage your studio
                </span>
              </h1>

              {/* Subheading */}
              <p
                className={`mb-12 text-xl leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
              >
                From intake to delivery, Flow provides tools you need to streamline operations,
                communicate clearly, and grow your custom build business.
              </p>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-8">
                {[
                  { value: "8+", label: "Features" },
                  { value: "24/7", label: "Support" },
                  { value: "99%", label: "Uptime" },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span
                      className={`text-3xl font-bold ${isLight ? "text-zinc-900" : "text-white"}`}
                    >
                      {stat.value}
                    </span>
                    <span
                      className={`text-sm font-medium ${isLight ? "text-zinc-500" : "text-zinc-500"}`}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features List */}
        <section className="relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {features.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} isLight={isLight} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden py-32">
          {/* Background */}
          <div className={`absolute inset-0 -z-10 ${isLight ? "bg-zinc-50" : "bg-zinc-900/50"}`} />
          <div
            className={`absolute inset-0 -z-10 bg-linear-to-br ${
              isLight ? "from-blue-50/50 to-purple-50/50" : "from-blue-900/10 to-purple-900/10"
            }`}
          />

          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2
              className={`mb-6 text-4xl font-bold tracking-tight sm:text-5xl ${isLight ? "text-zinc-900" : "text-white"}`}
            >
              Ready to transform your workflow?
            </h2>
            <p className={`mb-10 text-xl ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
              Join hundreds of builders who have already streamlined their custom build operations
              with Flow.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className={`group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
                  isLight
                    ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/25 hover:bg-zinc-800"
                    : "bg-white text-zinc-950 shadow-lg shadow-white/25 hover:bg-zinc-200"
                }`}
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                className={`group inline-flex items-center gap-2 rounded-full border px-8 py-4 text-sm font-semibold transition-all hover:scale-105 ${
                  isLight
                    ? "border-zinc-900/10 bg-zinc-900/5 text-zinc-900 hover:border-zinc-900/20 hover:bg-zinc-900/10"
                    : "border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10"
                }`}
              >
                <Play className="h-4 w-4 fill-current" />
                Watch Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
              {["No credit card required", "14-day free trial", "Cancel anytime"].map((text, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-sm ${isLight ? "text-zinc-500" : "text-zinc-500"}`}
                >
                  <Check className="h-4 w-4 text-green-500" strokeWidth={3} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}
