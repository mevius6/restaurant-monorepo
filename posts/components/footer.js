import Container from './container'

export default function Footer() {
  return (
    <footer className="footer">
      <Container>
        <div className="">
          <h4 className="copy">
            © 2020 «ХочуТорт»
          </h4>
          <ul className="social">
            <li>
              <a
                href="https://vk.com/cake_vn"
                target="_blank" rel="noopener noreferrer"
                className=""
              >
                <span data-icon="vk"></span>
              </a>
            </li>
            <li>
              <a
                href="https://www.tripadvisor.com/Restaurant_Review-g298502-d13389672-Reviews-Cafe_Confectionery_KhochuTort-Veliky_Novgorod_Novgorod_Oblast_Northwestern_Distr.html"
                target="_blank" rel="noopener noreferrer"
                className=""
              >
                <span data-icon="ta"></span>
              </a>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  )
}
