import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

export function PageLayout() {
  return (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
