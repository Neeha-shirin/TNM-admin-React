"use client";

import React from 'react';
import { 
  Sidebar as FlowbiteSidebar, 
  SidebarItem, 
  SidebarItemGroup, 
  SidebarItems 
} from "flowbite-react";
import { 
  HiHome,
  HiUserGroup,
  HiUsers,
  HiBookOpen,
  HiCreditCard,
  HiStar,
  HiChatAlt2,
  HiChartBar,
  HiCog,
  HiLogout
} from "react-icons/hi";
import { Link } from "react-router-dom";
function Sidebar() {
  return (
    <FlowbiteSidebar 
      className="h-[100%] bg-white shadow-md border-r border-gray-200"
      aria-label="Admin Sidebar"
    >
      <SidebarItems>
        <SidebarItemGroup className="space-y-1 px-2 py-2 text-sm">
          <SidebarItem as={Link}
            to="/"
            icon={HiBookOpen}
            className="py-3 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            Dashboard
          </SidebarItem>
          <SidebarItem as={Link}
            to="/tutor"
            icon={HiBookOpen}
            className="py-3 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
             Tutors
          </SidebarItem>
          <SidebarItem as={Link}
            to="/student"
            icon={HiBookOpen}
            className="py-3 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            Students / Leads
          </SidebarItem>
          <SidebarItem as={Link}
            to="/course"
            icon={HiBookOpen}
            className="py-3 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            Courses & Categories
          </SidebarItem>

          <SidebarItem as={Link}
            to="/assignment"
            icon={HiBookOpen}
            className="py-3 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            Tutor Assigning
          </SidebarItem>
          <SidebarItem href="#" icon={HiCreditCard} className="py-3 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all">
            Bookings & Payments
          </SidebarItem>
          <SidebarItem as={Link}
              to="/reviews"
              icon={HiStar}
              className="py-3 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
            >
              Reviews & Ratings
          </SidebarItem>
          <SidebarItem href="#" icon={HiChatAlt2} className="py-3 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all">
            Messages / Chat
          </SidebarItem>

          <SidebarItem href="#" icon={HiChartBar} className="py-3 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all">
            Reports & Analytics
          </SidebarItem>
          
          <SidebarItem href="#" icon={HiLogout} className="py-3 px-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all">
            Logout
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </FlowbiteSidebar>
  );
}

export default Sidebar;
