import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-[#222222] p-4">
      <ul className="flex items-center justify-center gap-4">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-[#FFD700]" : "text-white"
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/track"
            className={({ isActive }) =>
              isActive ? "text-[#FFD700]" : "text-white"
            }
          >
            Track
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
