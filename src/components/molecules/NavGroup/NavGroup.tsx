import React from 'react';
import styles from './NavGroup.module.scss';

export interface NavGroupProps {
    children: React.ReactNode;
}

export const NavGroup: React.FC<NavGroupProps> = ({ children }) => {
    return (
        <div className={styles.NavGroup}>
            <div className={styles.NavGroupHeader}>
                {children}
            </div>
            <div className={styles.NavGroupBody}>
                {children}
            </div>
        </div>
    );
}
