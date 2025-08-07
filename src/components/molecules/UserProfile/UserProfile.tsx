import React from 'react';
import styles from './UserProfile.module.scss';

export interface UserProfileProps {
    children: React.ReactNode;
}

export const UserProfile: React.FC<UserProfileProps> = ({ children }) => {
    return (
        <div className={styles.UserProfile}>
            {children}
        </div>
    );
}
