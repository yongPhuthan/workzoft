// pages/index.js
import { useRouter } from 'next/router';

export default function Home({ page }:any) {
  const router = useRouter();

  if (!page) {
    return <div>404 Page Not Found</div>;
  }

  return (
    <div>
      <h1>{page.page}</h1>
    </div>
  );
}

export async function getServerSideProps({ req } : any) {
  const parts = req.headers.host.split('.');
  let www = '';

  // Get the protocol and host from the request headers
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  // Construct the base URL
  const baseUrl = `${protocol}://${host}`;

  if (parts.length === 2) {
    // If there are three parts, it means we have a subdomain.
    www = parts[0];

    // If subdomain is 'www', it means we are on the main site.
    if (www === 'www') {
      return {
        props: {
          page: {
            page: 'main',
          },
        },
      };
    }
  } else if (parts.length === 3) {
    const subdomain = parts[1]
    const domain = parts[2]
    const url = `${protocol}://${domain}/api/get-page?page=${subdomain}`;
    console.log('url',url)
    try {
      const res = await fetch(url);
      const data = await res.json();
     console.log('data',data)
     return {
      props: {
        page: {
          page: data.page,
        },
      },
    };
  } catch (error) {
      console.error(error);
      // Handle the error as needed
  }
  
    // If there are two parts, it means we are on the main site.
    
  } else {
    // This handles edge cases, like localhost or IP addresses.
    // Adjust this as needed.
    return {
      props: {
        page: null,
      },
    };
  }

  // For other subdomains, fetch the content based on the subdomain.
  const res = await fetch(`${baseUrl}/api/get-page?page=${www}`);
  
  const data = await res.json();

  if (res.status === 404) {
    // Page not found.
    return {
      props: {
        page: null,
      },
    };
  }

  return {
    props: {
      page: 'data', // You were returning 'data' as a string before.
    },
  };
}
