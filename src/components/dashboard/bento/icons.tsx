/**
 * Unified Icon System for Bento Dashboard
 *
 * All icons have consistent:
 * - 24x24 viewBox
 * - 1.5 stroke width
 * - Round caps and joins
 * - Current color inheritance
 */

export interface IconProps {
  className?: string;
}

// Lightning/Activity Icon
export function LightningIcon({ className = "size-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Clock/Time Icon
export function ClockIcon({ className = "size-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 8V12L15 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Chart/Graph Icon
export function ChartIcon({ className = "size-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22V2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 7H12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 12H12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 17H12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Check/Completed Icon
export function CheckIcon({ className = "size-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 6L9 17L4 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// List/Menu Icon
export function ListIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 6H21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12H21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 18H21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Plus/Add Icon
export function PlusIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5V19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Cube/Box Icon (for orders/kits)
export function CubeIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12V21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12L20 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12L4 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Progress/Activity Icon
export function ActivityIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 12H18L15 21L9 3L6 12H2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Support/Help Icon
export function SupportIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 17V16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 13C12 11.3431 13.3431 10 15 10C16.6569 10 18 11.3431 18 13C18 14.6569 16.6569 16 15 16H12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Settings Icon
export function SettingsIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M19.4 15C19.2669 15.3016 19.2272 15.6342 19.2755 15.9584C19.3238 16.2826 19.4583 16.5877 19.6653 16.8428C19.8723 17.0979 20.1438 17.2936 20.4526 17.4106C20.7615 17.5276 21.0959 17.5614 21.4217 17.5087C21.7476 17.4561 22.0535 17.319 22.3095 17.1113C22.5654 16.9036 22.7624 16.6333 22.8824 16.327C23.0025 16.0207 23.0416 15.6896 22.9957 15.3652C22.9499 15.0407 22.8207 14.7356 22.6184 14.4768C22.4161 14.218 22.1482 14.0149 21.8423 13.8896C21.5365 13.7642 21.2035 13.7211 20.8753 13.7646C20.547 13.8082 20.2357 13.9377 19.973 14.1405L19.4 15ZM19.4 9.00003C19.6569 9.19736 19.9659 9.31479 20.2876 9.33854C20.6094 9.36229 20.9312 9.29134 21.2148 9.13409C21.4985 8.97684 21.7317 8.74038 21.8874 8.45173C22.0431 8.16308 22.1142 7.83417 22.0926 7.50783C22.071 7.18148 21.9581 6.87091 21.7643 6.60952C21.5706 6.34813 21.3043 6.14693 20.9976 6.02954C20.6909 5.91216 20.3564 5.88327 20.0336 5.94655C19.7108 6.00983 19.4125 6.16269 19.173 6.38803L18.6 7.00003"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 12C15 13.0609 14.5786 14.0783 13.8284 14.8284C13.0783 15.5786 12.0609 16 11 16C9.93913 16 8.92172 15.5786 8.17157 14.8284C7.42143 14.0783 7 13.0609 7 12C7 10.9391 7.42143 9.92172 8.17157 9.17157C8.92172 8.42143 9.93913 8 11 8C12.0609 8 13.0783 8.42143 13.8284 9.17157C14.5786 9.92172 15 10.9391 15 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.6 15L5.173 14.1405C5.4125 13.9152 5.71077 13.7623 6.03357 13.699C6.35637 13.6358 6.69088 13.6646 6.99759 13.782C7.30429 13.8994 7.57056 14.1006 7.76435 14.362C7.95813 14.6234 8.07104 14.934 8.09261 15.2603C8.11418 15.5866 8.0431 15.9156 7.8874 16.2042C7.7317 16.4929 7.49846 16.7293 7.21483 16.8866C6.9312 17.0438 6.60939 17.1148 6.28764 17.0911C5.96588 17.0673 5.65693 16.9499 5.4 16.7525L4.6 15ZM4.6 9.00003L5.4 7.00003C5.65693 6.8027 5.96588 6.68526 6.28764 6.66151C6.60939 6.63777 6.9312 6.70871 7.21483 6.86596C7.49846 7.02322 7.7317 7.25967 7.8874 7.54833C8.0431 7.83698 8.11418 8.16588 8.09261 8.49223C8.07104 8.81857 7.95813 9.12915 7.76435 9.39054C7.57056 9.65193 7.30429 9.85313 6.99759 9.97051C6.69088 10.0879 6.35637 10.1168 6.03357 10.0535C5.71077 9.99023 5.4125 9.83736 5.173 9.61203L4.6 9.00003"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Right Arrow Icon
export function ArrowRightIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5L19 12L12 19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
