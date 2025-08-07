import React from 'react';
import styles from './MainLayout.module.scss';

export interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className={styles.MainLayout}>
            {children}
        </div>
    );
}
