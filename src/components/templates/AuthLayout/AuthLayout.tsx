import styles from './AuthLayout.module.scss';

export type AuthLayoutProps = {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({children}) => {
  return (
    <div className={styles.AuthLayout}>
      <p className={styles.AuthLayout__title}>Coplacont</p>
      <div className={styles.AuthLayout__content}>
        <div className={styles.AuthLayout__content__inner}>
          {children}   
        </div>
      </div>
    </div>
  );
};