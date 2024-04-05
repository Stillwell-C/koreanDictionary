import styles from "./blogLayout.module.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className={styles.container}>
      <div className={styles.contentWrapper}>
        <h2>꼬박꼬박 Blog</h2>
        {children}
      </div>
    </section>
  );
}
