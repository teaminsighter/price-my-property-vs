import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#3B9FE5',
          borderRadius: '22%',
        }}
      >
        <svg
          viewBox="0 0 50 50"
          fill="none"
          width="140"
          height="140"
        >
          <path d="M25 10L15 20H20V35H30V20H35L25 10Z" fill="white" />
          <path d="M38 22C38 22 40 24 40 28C40 32 38 34 38 34" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
