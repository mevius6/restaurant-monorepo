import Author from './author'
import Date from './date'
import CoverImage from './cover-image'
import Link from 'next/link'

export default function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}) {
  return (
    <section className="hero">
      <CoverImage
        title={title}
        responsiveImage={coverImage.responsiveImage}
        slug={slug}
      />
      <div className="hero__text">
        <div>
          <h3 className="headline">
            <Link as={`/posts/${slug}`} href="/posts/[slug]">
              <a className="">{title}</a>
            </Link>
          </h3>
          <div className="dateline">
            <Date dateString={date} />
          </div>
        </div>
        <div>
          <p className="excerpt">{excerpt}</p>
          <Author name={author.name} picture={author.picture} />
        </div>
      </div>
    </section>
  )
}
