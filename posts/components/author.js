export default function Author({ name, picture }) {
  return (
    <div className="byline">
      <img
        src={picture.url}
        className="byline__image"
        alt={name}
      />
      <div className="byline__text">{name}</div>
    </div>
  )
}
