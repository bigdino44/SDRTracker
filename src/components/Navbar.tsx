import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Users, GraduationCap, LayoutDashboard, Calendar, ClipboardList } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">SDR Quest</span>
          </Link>
          
          <div className="flex space-x-8">
            <NavLink to="/" icon={<LayoutDashboard />} text="Dashboard" active={location.pathname === '/'} />
            <NavLink to="/qualify" icon={<Users />} text="Qualify" active={location.pathname === '/qualify'} />
            <NavLink to="/leads" icon={<ClipboardList />} text="Leads" active={location.pathname === '/leads'} />
            <NavLink to="/calendar" icon={<Calendar />} text="Calendar" active={location.pathname === '/calendar'} />
            <NavLink to="/leaderboard" icon={<Trophy />} text="Leaderboard" active={location.pathname === '/leaderboard'} />
            <NavLink to="/training" icon={<GraduationCap />} text="Training" active={location.pathname === '/training'} />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-semibold">JS</span>
              </div>
              <span className="text-gray-700">John Smith</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, text, active }: { to: string; icon: React.ReactNode; text: string; active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-1 transition-colors ${
      active ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
    }`}
  >
    {React.cloneElement(icon as React.ReactElement, { className: 'h-5 w-5' })}
    <span>{text}</span>
  </Link>
);

export default Navbar;