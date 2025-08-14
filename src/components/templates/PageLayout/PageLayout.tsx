import React from "react";
import styles from "./PageLayout.module.scss";
import { Text, Divider } from "@/components";
import { Button } from "@/components";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  button?: boolean;
  textButton?:string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ title, subtitle, className, children, button, textButton }) => {
  return (
    <div className={`${styles.pageLayout} ${className || ''}`.trim()}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Text as="p" size="2xl" color="neutral-primary" weight={600}>{title}</Text>
          {subtitle && <Text as="p" size="md" color="neutral-secondary">{subtitle}</Text>}
        </div>
        {button && <Button >{textButton}</Button>}
        
      </div>
      <Divider />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};
