"use client";

import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

const ClientScrollbar = ({ children }: { children: React.ReactNode }) => {
  return <PerfectScrollbar>{children}</PerfectScrollbar>;
};

export default ClientScrollbar;
