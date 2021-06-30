import Author from './author'
import Date from './date'
import CoverImage from './cover-image'
import PostTitle from './post-title'

export default function PostHeader({ title, coverImage, date, author }) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="hidden">
        <Author name={author.name} picture={author.picture} />
      </div>
      <CoverImage
        title={title}
        responsiveImage={coverImage.responsiveImage}
      />
      <div className="">
        <div className="byline">
          <Author name={author.name} picture={author.picture} />
        </div>
        <div className="dateline">
          <Date dateString={date} />
        </div>
      </div>
    </>
  )
}
