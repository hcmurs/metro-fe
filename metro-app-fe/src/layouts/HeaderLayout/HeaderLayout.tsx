import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';

export default function HeaderLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex min-h-0">
        <Outlet />
      </main>
    </div>
  );
}