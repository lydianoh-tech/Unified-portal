const categories = [
  {
    name: "Skincare",
    description: "Nourish, hydrate, and reveal your natural glow.",
  },
  {
    name: "Hair Care",
    description: "Healthy hair begins with intentional care.",
  },
  {
    name: "Body Care",
    description: "Simple rituals for beautifully cared-for skin.",
  },
  {
    name: "Wellness",
    description: "Create moments that support your whole self.",
  },
];

export default function FeaturedCategories() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <span className={styles.eyebrow}>
          EXPLORE LOVE LILY
        </span>

        <h2 className={styles.title}>
          Beauty rituals made for you.
        </h2>

        <p className={styles.description}>
          Discover thoughtful beauty and wellness categories designed
          to make self-care feel beautiful, simple, and intentional.
        </p>

        <div className={styles.grid}>
          {categories.map((category) => (
            <article className={styles.card} key={category.name}>
              <h3 className={styles.cardTitle}>
                {category.name}
              </h3>

              <p className={styles.cardDescription}>
                {category.description}
              </p>

              <a
                href="/shop"
                className={styles.cardLink}
              >
                Explore {category.name}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}