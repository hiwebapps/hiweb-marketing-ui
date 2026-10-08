/** Stroke icons for the navbar. A URL renders an image from the gallery. */
export function NavIcon({ name }: { name: string }) {
  if (name.startsWith('http') || name.startsWith('/')) {
    return <img src={name} alt="" width={20} height={20} />;
  }

  switch (name) {
    case 'activity':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case 'target':
    case 'spark':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v3" />
          <path d="M12 18v3" />
          <path d="M3 12h3" />
          <path d="M18 12h3" />
          <path d="m5.6 5.6 2.1 2.1" />
          <path d="m16.3 16.3 2.1 2.1" />
          <path d="m5.6 18.4 2.1-2.1" />
          <path d="m16.3 7.7 2.1-2.1" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case 'users':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'video':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
          <rect x="2" y="6" width="14" height="12" rx="2" />
        </svg>
      );
    case 'badge':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'focus':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
          <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
          <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
          <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
        </svg>
      );
    case 'code':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case 'box':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16.5 9.4 7.55 4.24" />
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.29 7 12 12 20.71 7" />
          <line x1="12" y1="22" x2="12" y2="12" />
        </svg>
      );
    case 'grid':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      );
    case 'book':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
          <path d="M18 14h-8" />
          <path d="M15 18h-5" />
          <path d="M10 6h8v4h-8V6Z" />
        </svg>
      );
    case 'mail':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case 'factory':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4H2Z" />
        </svg>
      );
    case 'heart':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    case 'building':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <rect width="16" height="20" x="4" y="2" rx="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01" />
          <path d="M16 6h.01" />
          <path d="M12 6h.01" />
          <path d="M12 10h.01" />
          <path d="M12 14h.01" />
          <path d="M16 10h.01" />
          <path d="M16 14h.01" />
          <path d="M8 10h.01" />
          <path d="M8 14h.01" />
        </svg>
      );
    case 'plane':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
      );
    case 'utensils':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      );
    case 'app':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      );
    case 'car':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <path d="M9 17h6" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          <rect width="20" height="14" x="2" y="6" rx="2" />
        </svg>
      );
    case 'cart':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
      );
    case 'search':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case 'headset':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="9" r="2.2" />
          <path d="M8 19.5v-.4A3.1 3.1 0 0 1 11.1 16h1.8A3.1 3.1 0 0 1 16 19.1v.4" />
          <path d="M8.2 9.2a3.8 3.8 0 0 1 7.6 0" />
          <path d="M7.2 9.2v2.6" />
          <path d="M16.8 9.2v2.6" />
          <path d="M16.8 11.8c1.3.5 2.1 1.4 2.1 2.4" />
          <circle cx="19" cy="14.6" r="0.8" />
        </svg>
      );
    case 'brush':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m14.5 4.5 5 5" />
          <path d="M13.2 5.8 7.4 11.6a2.4 2.4 0 0 0 0 3.4 2.4 2.4 0 0 0 3.4 0l5.8-5.8" />
          <path d="m8.2 16.2-1.7 3.3" />
          <path d="M5.2 20.2h2.4" />
        </svg>
      );
    case 'googleads':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4.5 18.5 11 6.5l6.5 12" />
          <path d="M7.8 18.5h6.4" />
          <circle cx="17.8" cy="16.6" r="2.1" />
        </svg>
      );
    case 'meta':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 12c-1.8-2.4-3.6-3.6-5.4-3.6a3.6 3.6 0 1 0 0 7.2c1.8 0 3.6-1.2 5.4-3.6Z" />
          <path d="M12 12c1.8 2.4 3.6 3.6 5.4 3.6a3.6 3.6 0 1 0 0-7.2c-1.8 0-3.6 1.2-5.4 3.6Z" />
        </svg>
      );
    default:
      return null;
  }
}
