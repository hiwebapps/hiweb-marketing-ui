import type { SiteIdentity } from '../../lib/site-identity';

export function ContactBanner({
  title,
  subtitle,
  site,
}: {
  title: string;
  subtitle?: string;
  site: SiteIdentity;
}) {
  return (
    <div className="contact-banner">
      <h1>
        {title}
        {subtitle ? (
          <>
            <br />
            {subtitle}
          </>
        ) : null}
      </h1>
      <div className="contact-banner__links">
        <a className="contact-banner__link" href={`mailto:${site.email}`}>
          <span className="contact-banner__icon" aria-hidden="true">
            <MailIcon />
          </span>
          {site.email}
        </a>
        <a className="contact-banner__link" href={site.phoneHref}>
          <span className="contact-banner__icon" aria-hidden="true">
            <PhoneIcon />
          </span>
          {site.phone}
        </a>
        {site.whatsapp ? (
          <a
            className="contact-banner__link"
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact-banner__icon" aria-hidden="true">
              <WhatsAppIcon />
            </span>
            WhatsApp
          </a>
        ) : null}
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.6 7.9A5.6 5.6 0 0 1 8 13.5c-.9 0-1.8-.2-2.6-.6L2.5 13.5l.7-2.8A5.6 5.6 0 1 1 13.6 7.9Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M6 5.5c.2-.4.4-.4.6-.4h.4c.2 0 .4.1.5.3.3.3.7.9.8 1.1.1.2.1.3 0 .5-.1.1-.2.2-.3.3-.1.1-.2.2-.1.3.3.6.7 1.1 1.2 1.5.2.2.3.2.4.1l.3-.3c.2-.2.3-.2.5-.1.2.1.9.4 1 .5.2.1.2.3.2.4 0 .3-.2.9-.7 1.1-.5.2-1 .2-2-.2-1.3-.6-2.3-1.5-3-2.6-.6-1-.6-1.7-.3-2.2.2-.3.5-.5.8-.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.2 4.4 8 8.6l5.8-4.2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6.2 2.6c.3-.7 1.2-.9 1.8-.4l1.1 1c.4.4.5 1 .2 1.5L8.6 6.2a8.2 8.2 0 0 0 1.2 1.2l1.5-.7c.5-.3 1.1-.2 1.5.2l1 1.1c.5.6.3 1.5-.4 1.8l-1.2.5c-.8.3-1.7.2-2.6-.3a11 11 0 0 1-3.4-3.4c-.5-.9-.6-1.8-.3-2.6l.5-1.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
