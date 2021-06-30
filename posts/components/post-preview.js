import Author from './author'
import Date from './date'
import CoverImage from './cover-image'
import Link from 'next/link'

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}) {
  return (
    <div className="post post--preview">
      <CoverImage
        slug={slug}
        title={title}
        responsiveImage={coverImage.responsiveImage}
      />
      <section className="text">
        <h3 className="headline">
          <Link as={`/posts/${slug}`} href="/posts/[slug]">
            <a>{title}</a>
          </Link>
        </h3>
        <div className="dateline">
          <Date dateString={date} />
        </div>
        <p className="">{excerpt}</p>
        <Author name={author.name} picture={author.picture} />
      </section>
    </div>
  )
}
