import { NavLink } from 'react-router-dom';
import './MainNavigation.css';
const MainNavigation = () => {
  //   const token = useRouteLoaderData('root');

  return (
    <nav className="nav">
      <ul className="nav_list">
        <li className="nav_listitem">
          <NavLink to="/" className={({ isActive }) => `${isActive ? 'active' : ''} nav_link`} end>
            Home
          </NavLink>
        </li>
        <li className="nav_listitem">
          <NavLink to="/stakeholderlist" className={({ isActive }) => `${isActive ? 'active' : ''} nav_link`}>
            Substakeholder Liste
          </NavLink>
        </li>
        <li className="nav_listitem">
          <NavLink to="/survey" className={({ isActive }) => `${isActive ? 'active' : ''} nav_link`}>
            Stakeholder Befragung
          </NavLink>
        </li>
        {/*  {!token && (
            <li>
              <NavLink to="/auth?mode=login" className={({ isActive }) => `${isActive ? "active" : ""} nav_link`}>
                Authentication
              </NavLink>
            </li>
          )}
          {token && (
            <li>
              <Form action="/logout" method="post">
                <button>Logout</button>
              </Form>
            </li>
          )} */}
      </ul>
    </nav>
  );
};

export default MainNavigation;
