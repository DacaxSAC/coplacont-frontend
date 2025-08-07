import React from 'react';
import styles from './NavItem.module.scss';

export interface NavItemProps {
    children: React.ReactNode;
}

export const NavItem: React.FC<NavItemProps> = ({ children }) => {
    return (
        <div className={styles.NavItem}>
            {children}
        </div>
    );
}
