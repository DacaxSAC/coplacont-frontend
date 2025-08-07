import styles from './AuthLayout.module.scss';

export const AuthLayout= ({children}: {children: React.ReactNode}) => {
  return (
    <div className={styles.AuthLayout}>
      <p>Coplacont</p>
      <div className={styles.AuthLayout__content}>
        {children}
      </div>
      
    </div>
  );
};