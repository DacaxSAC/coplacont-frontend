import React from 'react';
import styles from './Icon.module.scss';

export interface IconProps {
    children: React.ReactNode;
}

export const Icon: React.FC<IconProps> = ({ children }) => {
    return (
        <div className={styles.Icon}>
            {children}
        </div>
    );
}
