import { NavLink } from 'react-router-dom';
import classes from './MainNavigation.module.css';
const MainNavigation = () => {
  //   const token = useRouteLoaderData('root');

  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? classes.active : undefined)} end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/stakeholderlist" className={({ isActive }) => (isActive ? classes.active : undefined)}>
              Stakeholder List
            </NavLink>
          </li>
          {/* <li>
            <NavLink to="/newsletter" className={({ isActive }) => (isActive ? classes.active : undefined)}>
              Newsletter
            </NavLink>
          </li>
          {!token && (
            <li>
              <NavLink to="/auth?mode=login" className={({ isActive }) => (isActive ? classes.active : undefined)}>
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
    </header>
  );
};

export default MainNavigation;
