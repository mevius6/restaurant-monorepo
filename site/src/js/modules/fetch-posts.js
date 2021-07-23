// ? https://dmitripavlutin.com/javascript-fetch-async-await/#4-canceling-a-fetch-request

const responsiveImageFragment = `
  fragment responsiveImageFragment on ResponsiveImage {
    srcSet
    webpSrcSet
    sizes
    src
    width
    height
    aspectRatio
    alt
    title
    bgColor
    base64
  }
`;

const fetchAPI = async (query) => {
  const res = await fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.DATOCMS_API_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  if (json.errors) {
    // console.error(json.errors)
    throw new Error('Не удалось получить API');
  }

  return json.data;
};

export const getAllPostsForHome = async () => {
  const data = await fetchAPI(`
    {
      allPosts(first: 3, orderBy: date_DESC) {
        title
        excerpt
        date
        slug
        coverImage {
          responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 500, h: 500 }) {
            ...responsiveImageFragment
          }
        }
      }
    }
    ${responsiveImageFragment}
  `);

  return data?.allPosts;
};
