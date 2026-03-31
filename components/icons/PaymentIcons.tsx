import React from 'react';

export function VisaIcon({ className = "w-10 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <path d="M20.5 21H18L19.5 11H22L20.5 21ZM16.5 11L14.1 18L13.8 16.5L13 12C13 12 12.9 11 11.5 11H8L8 11.2C8 11.2 9.5 11.5 11.2 12.5L13.5 21H16L21 11H16.5ZM36 21H38.5L36.5 11H34.5C33.3 11 33 12 33 12L29 21H31.5L32 19.5H35L35.3 21H36ZM32.8 17.5L34 14L34.7 17.5H32.8ZM29 13L29.3 11.2C29.3 11.2 28 11 26.5 11C25 11 22 11.7 22 14.5C22 17 25.5 17 25.5 18.5C25.5 20 22.5 19.5 21.2 18.7L20.9 20.5C20.9 20.5 22.2 21 24 21C25.8 21 29 20 29 17.5C29 15 25.5 14.7 25.5 13.5C25.5 12.3 27.5 12.5 29 13Z" fill="white" />
    </svg>
  );
}

export function MastercardIcon({ className = "w-10 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="#252525" />
      <circle cx="19" cy="16" r="8" fill="#EB001B" />
      <circle cx="29" cy="16" r="8" fill="#F79E1B" />
      <path d="M24 10.3C25.8 11.7 27 13.7 27 16C27 18.3 25.8 20.3 24 21.7C22.2 20.3 21 18.3 21 16C21 13.7 22.2 11.7 24 10.3Z" fill="#FF5F00" />
    </svg>
  );
}

export function AmexIcon({ className = "w-10 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="#006FCF" />
      <path d="M8 16L10 11H13L15 16M10.5 14.5H14.5" stroke="white" strokeWidth="1.5" />
      <text x="16" y="18" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">AMEX</text>
    </svg>
  );
}

export function ApplePayIcon({ className = "w-10 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="#000000" />
      <text x="7" y="20" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">Pay</text>
      <circle cx="38" cy="16" r="5" stroke="white" strokeWidth="1.5" fill="none" />
      <path d="M36 16H40M38 14V18" stroke="white" strokeWidth="1" />
    </svg>
  );
}

export function ContactlessIcon({ className = "w-10 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="#333333" />
      <path d="M20 20C22 18 22 14 20 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M24 22C27.3 19 27.3 13 24 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M28 24C32.5 20 32.5 12 28 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
