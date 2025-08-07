import React from 'react';
import styles from './Sidebar.module.scss';

export interface SidebarProps {
    children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
    return (
        <div className={styles.Sidebar}>
            {children}
        </div>
    );
}
