"use client";

import React, { useState } from 'react';
import styles from './sideNav.module.css';
import {
    HomeIcon,
    UsersIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    FolderIcon,
    ArrowRightCircleIcon
} from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { DashboardData } from '@/types/dashboard';
import ManageUsers from '../Dashboard/ManageUsers/ManageUsers';
import AdminManageCases from '../Dashboard/AdminManageCases/AdminManageCases';
import AdminOverview from '../Dashboard/AdminOverview/AdminOverview';
import StewardCases from '../Dashboard/StewardCases/StewardCases';
import StewardOverview from '../Dashboard/StewardOverview/StewardOverview';

// Props for each tab component
interface TabComponentProps {
    data: DashboardData;
    token: string;
}

// Tab components
const AdminOverviewTab: React.FC<TabComponentProps> = ({ data }) => (
    <AdminOverview data={data.adminOverview} />
);
const OwnerManageUserTab: React.FC<TabComponentProps> = ({ data, token }) => (
    <ManageUsers users={data.ownerUsers} token={token} />
    // <div></div>
);
const AdminManageCasesTab: React.FC<TabComponentProps> = ({ data, token }) => (
    <AdminManageCases token={token} />
    // <div></div>
);
const StewardOverviewTab: React.FC<TabComponentProps> = ({ data }) => (
    <StewardOverview data={data.stewardOverview} />
);
const StewardCasesTab: React.FC<TabComponentProps> = ({ data }) => (
    <StewardCases cases={data.stewardCases} />
);

const tabComponents: { [key: string]: React.FC<TabComponentProps> } = {
    AdminOverviewTab,
    OwnerManageUserTab,
    AdminManageCasesTab,
    StewardOverviewTab,
    StewardCasesTab,
};

const tabNames: { [key: string]: string } = {
    AdminOverviewTab: 'Admin Overview',
    OwnerManageUserTab: 'Manage Users',
    AdminManageCasesTab: 'Manage Cases',
    StewardOverviewTab: 'Overview',
    StewardCasesTab: 'Cases',
};

const tabIcons: { [key: string]: React.ReactNode } = {
    AdminOverviewTab: <HomeIcon className={styles.tabIcon} />,
    OwnerManageUserTab: <UsersIcon className={styles.tabIcon} />,
    AdminManageCasesTab: <ClipboardDocumentListIcon className={styles.tabIcon} />,
    StewardOverviewTab: <ChartBarIcon className={styles.tabIcon} />,
    StewardCasesTab: <FolderIcon className={styles.tabIcon} />,
};

interface SideNavProps {
    tabs: string[];
    data: DashboardData;
    token: string;
}

const SideNav: React.FC<SideNavProps> = ({ tabs, data, token }) => {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    const [activeTab, setActiveTab] = useState(tabs[0]);
    const ActiveComponent = tabComponents[activeTab];

    return (
        <div className={styles.page}>
            <div className={styles.navBar}>
                <ul>
                    {tabs.map((tab) => (
                        <li
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={tab === activeTab ? styles.activeLink : styles.link}
                        >
                            <div className={styles.linkContent}>
                                {tabIcons[tab]}
                                {tabNames[tab] || tab}
                            </div>
                        </li>
                    ))}
                    <li onClick={handleLogout} className={`${styles.link} ${styles.logoutBtn}`}>
                        <div className={styles.linkContent}>
                            <ArrowRightCircleIcon className={styles.tabIcon} />
                            Log Out
                        </div>
                    </li>
                </ul>
            </div>
            <div className={styles.content}>
                <ActiveComponent data={data} token={token} />
            </div>
        </div>
    );
};

export default SideNav;
