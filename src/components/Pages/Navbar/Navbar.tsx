import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="nav">
      <ul className="nav_list">
        <li className="nav_listitem">
          <a className="nav_link" href="/">
            Home
          </a>
        </li>
        <li className="nav_listitem">
          <a className="nav_link" href="/">
            Wesentlichkeit
          </a>
        </li>
      </ul>
    </nav>
  );
}
