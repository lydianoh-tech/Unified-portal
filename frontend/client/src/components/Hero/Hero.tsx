import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>
            BEAUTY, REDEFINED
          </span>

          <h1 className={styles.title}>
            Luxury Beauty,
            <span>Naturally.</span>
          </h1>

          <p className={styles.description}>
            Discover a beautiful space where self-care, confidence,
            connection, and natural beauty come together.
          </p>

          <div className={styles.actions}>
            <a href="/services" className={styles.primaryButton}>
              Explore LoveLily
            </a>

            <a href="/about" className={styles.secondaryButton}>
              Discover More
            </a>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.imageFrame}>
            <div className={styles.imagePlaceholder}>
              LoveLily
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}