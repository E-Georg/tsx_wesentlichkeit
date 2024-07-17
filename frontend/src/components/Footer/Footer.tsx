import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <ul className="footer_list">
        <li className="footer_listitem">
          <a className="footer_link" href="#">
            Impressum
          </a>
        </li>
        <li className="footer_listitem">
          <a className="footer_link" href="#">
            Datenschutzerklärung
          </a>
        </li>
      </ul>
    </footer>
  );
}
