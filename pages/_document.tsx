import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import createCache from '@emotion/cache'
import Document, { Html, Head, Main, NextScript } from 'next/document'


const getCache = () => {
  const cache = createCache({ key: 'css' })
  cache.compat = true
  return cache
}

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const cache = getCache()
    const { extractCritical } = createEmotionServer(cache)

    const initialProps = await Document.getInitialProps({
      ...ctx,
      renderPage: () =>
        ctx.renderPage({
          enhanceApp: (App: any) => (props) =>
            (
              <CacheProvider value={cache}>
                <App {...props} />
              </CacheProvider>
            ),
        }),
    })

    const emotionStyles = extractCritical(initialProps.html)
    initialProps.html = emotionStyles.html
    initialProps.head.push(
      <style
        key="emotion-css"
        data-emotion={`css ${emotionStyles.ids.join(' ')}`}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: emotionStyles.css }}
      />
    )
    return initialProps
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
