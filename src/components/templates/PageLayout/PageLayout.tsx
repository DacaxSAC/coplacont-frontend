import React from "react";
import styles from "./PageLayout.module.scss";
import { Text, Divider } from "@/components";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className={styles.pageLayout}>
      <div className={styles.header}>
        <Text as="p" size="2xl" color="neutral-primary">
          {title}
        </Text>
        {subtitle && (
          <Text as="p" size="md" color="neutral-secondary">
            {subtitle}
          </Text>
        )}
      </div>
      <Divider />
      <div className={styles.content}>{children}</div>
    </div>
  );
};
