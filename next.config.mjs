/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  async headers(){
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://www.google.com",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline' https:",
      "font-src 'self' data: https:",
      "frame-src https://www.googletagmanager.com https://www.google.com https://recaptcha.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ]
      }
    ];
  }
};

export default nextConfig;
