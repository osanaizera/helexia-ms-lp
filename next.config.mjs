/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  async headers(){
    const isDev = process.env.NODE_ENV !== 'production'
    const scriptSrc = [
      "'self'",
      "'unsafe-inline'",
      isDev ? "'unsafe-eval'" : null,
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://www.google.com',
      'https://www.gstatic.com',
      'https://connect.facebook.net'
    ].filter(Boolean).join(' ')

    const csp = [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://www.google.com https://vitals.vercel-insights.com https://vitals.vercel-analytics.com https://www.facebook.com https://connect.facebook.net https://mpc2-prod-1-is5qnl632q-uc.a.run.app https://demo-1.conversionsapigateway.com",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline' https:",
      "font-src 'self' data: https:",
      "frame-src https://www.googletagmanager.com https://www.google.com https://recaptcha.google.com https://tagassistant.google.com",
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
