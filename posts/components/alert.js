import Container from './container'
import cn from 'classnames'

export default function Alert({ preview }) {
  return (
    <div
      className={cn('border-b', {
        'bg-accent-7 border-accent-7 text-white': preview,
        'bg-accent-1 border-accent-2': !preview,
      })}
    >
      <Container>
        <div className="">
          {preview ? (
            <>
              Это превью страницы.{' '}
              <a
                href="/api/exit-preview"
                className=""
              >
                Нажмите сюда,
              </a>{' '}
              чтобы выйти из режима предварительного просмотра.
            </>
          ) : ''}
        </div>
      </Container>
    </div>
  )
}
