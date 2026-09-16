import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'ElectriCore LLC, licensed electrician in Dunn, North Carolina';

/** Social share card, drawn from the palette sampled out of the logo file. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: '#131927',
          padding: 72,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            backgroundImage:
              'linear-gradient(to right, rgba(5,201,227,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(5,201,227,0.09) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 14, height: 14, background: '#fb8627' }} />
            <div style={{ display: 'flex', fontSize: 24, letterSpacing: 6, color: '#05c9e3' }}>
              {site.tagline.toUpperCase()}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 116,
                fontWeight: 700,
                letterSpacing: -4,
                lineHeight: 1,
                color: '#eaf0f7',
              }}
            >
              Electri<span style={{ color: '#05c9e3' }}>Core</span>
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 26,
                fontSize: 38,
                lineHeight: 1.35,
                maxWidth: 900,
                color: '#b4bfce',
              }}
            >
              Licensed and insured electrical contractor serving Dunn, NC and surrounding areas.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #2b3548',
              paddingTop: 26,
            }}
          >
            <div style={{ display: 'flex', fontSize: 26, letterSpacing: 2, color: '#8b96a8' }}>
              {`${site.experience.label.toUpperCase()} \u00b7 LICENSED & INSURED`}
            </div>
            <div style={{ display: 'flex', fontSize: 30, fontWeight: 600, color: '#eaf0f7' }}>
              {site.phone.display}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
