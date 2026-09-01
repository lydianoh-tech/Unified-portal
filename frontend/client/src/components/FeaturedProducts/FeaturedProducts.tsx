import styles from "./FeaturedProducts.module.css";

const products = [
  {
    name: "Radiance Face Oil",
    description: "A nourishing botanical oil for soft, luminous skin.",
    price: "$42.00",
  },
  {
    name: "Velvet Glow Moisturizer",
    description: "A rich, lightweight moisturizer for everyday hydration.",
    price: "$36.00",
  },
  {
    name: "Lavender Facial Serum",
    description: "A calming serum designed to support a healthy glow.",
    price: "$48.00",
  },
  {
    name: "Silk Body Cream",
    description: "A luxurious body cream that leaves skin beautifully soft.",
    price: "$32.00",
  },
];

export default function FeaturedProducts() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <span className={styles.eyebrow}>
          CURATED FOR YOU
        </span>

        <h2 className={styles.title}>
          Featured beauty essentials.
        </h2>

        <p className={styles.description}>
          Discover carefully selected beauty essentials designed
          to make every self-care ritual feel special.
        </p>

        <div className={styles.grid}>
          {products.map((product) => (
            <article className={styles.card} key={product.name}>
              <div className={styles.imagePlaceholder}>
                Beauty
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.productName}>
                  {product.name}
                </h3>

                <p className={styles.productDescription}>
                  {product.description}
                </p>

                <div className={styles.productFooter}>
                  <span className={styles.price}>
                    {product.price}
                  </span>

                  <button
                    type="button"
                    className={styles.viewButton}
                  >
                    View Product
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <a href="/marketplace" className={styles.shopLink}>
          View All Products
        </a>
      </div>
    </section>
  );
}