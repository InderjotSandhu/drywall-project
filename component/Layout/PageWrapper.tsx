'use client';

import styles from './PageWrapper.module.css';

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className={styles.root}>
      <div className={styles.grid}  aria-hidden="true" />
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}