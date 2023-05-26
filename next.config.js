/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    BASE_URL: process.env.BASE_URL,
    // ...
  },
  
  
}

module.exports = {
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  }
}


module.exports = nextConfig

module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

}

