"use client"
import React from 'react';
import NavbarAdmin from './adminNavbar/page';
import AlertsCard from './AlertCard';
import { Progress } from '@nextui-org/react';
import DailyProgress from './Progress';

const AdminPanelMain = () => {
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 10));
    }, 100);

    // Set loading to false after the progress bar reaches 100
    if (value === 100) {
      clearInterval(interval);
      setTimeout(() => {
        setLoading(false);
      }, 500); // Delay for a smoother transition
    }

    return () => clearInterval(interval);
  }, [value]);

  return (
    <>
      {loading && (
        <>
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black p-3">
            <div className="w-5 h-5 font-bold text-white animate-bounce mr-12">
              InveeSync
            </div>
            <div className="w-5 h-5 font-bold text-white bg-green-400 rounded-full animate-bounce mr-4 ml-4"></div>
            <Progress
              aria-label="Loading..."
              size="md"
              value={value}
              color="success"
              showValueLabel={false}
              className="max-w-md"
            />
          </div>
        </>
      )}
        {!loading && (
        <>
          <NavbarAdmin />
          <AlertsCard />
          <DailyProgress />
        </>
      )}
    </>
  );
};

export default AdminPanelMain;
