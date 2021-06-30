import { Image } from 'react-datocms'
// import cn from 'classnames'
import Link from 'next/link'

export default function CoverImage({ title, responsiveImage, slug }) {
  const image = (
    <Image
      data={{
        ...responsiveImage,
        alt: `Обложка для ${title}`,
      }}
      className="image"
    />
  )
  return (
    <div className="image-wrapper">
      {slug ? (
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <a aria-label={title}>{image}</a>
        </Link>
      ) : (
        image
      )}
    </div>
  )
}
