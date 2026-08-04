import { useEffect, useState } from "react";
import { api } from "../services/api";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../hooks/useAuth";

const departments = [
  {
    value: "ALL",
    label: "All Departments",
    blurb: "General showcase for every department",
  },
  {
    value: "HAIRSTYLIST",
    label: "Hairstylist",
    blurb: "Hair tools, extensions, color and care",
  },
  {
    value: "NAILS",
    label: "Nails",
    blurb: "Nail kits, gel polish, lamps and care",
  },
  {
    value: "EYEBROWS",
    label: "Eyebrows",
    blurb: "Brow shaping, tinting and lamination supplies",
  },
  {
    value: "DRESSING",
    label: "Dressing",
    blurb: "Wardrobe finishing and styling accessories",
  },
  {
    value: "DESIGNER",
    label: "Designer",
    blurb: "Designer materials, tools and premium pieces",
  },
  {
    value: "STYLIST",
    label: "Stylist",
    blurb: "Professional styling tools and retail products",
  },
];

const initialListingForm = {
  title: "",
  description: "",
  department: "HAIRSTYLIST",
  category: "",
  tags: "",
  imageUrl: "",
  price: "",
};

export default function MarketplacePage() {
  const { user } = useAuth();
  const isProvider = user?.role === "USER" || user?.role === "ADMIN";
  const [listings, setListings] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  const [selectedListingId, setSelectedListingId] = useState("");
  const [listingReviews, setListingReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [listingForm, setListingForm] = useState(initialListingForm);
  const [listingError, setListingError] = useState("");
  const [busy, setBusy] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const selectedDepartmentMeta = departments.find(
    (department) => department.value === selectedDepartment,
  );

  const selectedListing = listings.find(
    (item) => item.id === selectedListingId,
  );

  const loadListings = async (department = selectedDepartment) => {
    const response = await api.listings(
      department === "ALL" ? undefined : department,
    );
    setListings(response.listings);
  };

  useEffect(() => {
    loadListings().catch(() => {
      setListingError("Failed to load marketplace listings.");
    });
  }, [selectedDepartment]);

  useEffect(() => {
    if (!isProvider) return;
    api
      .marketplaceOrders()
      .then((data) => setOrders(data.orders))
      .catch(() => {});
  }, [isProvider]);

  useEffect(() => {
    if (!selectedListingId) {
      setListingReviews([]);
      return;
    }

    api
      .listingReviews(selectedListingId)
      .then((data) => setListingReviews(data.reviews))
      .catch(() => setListingReviews([]));
  }, [selectedListingId]);

  const submitReview = async (event) => {
    event.preventDefault();
    setReviewError("");
    if (!selectedListingId) {
      setReviewError("Choose a listing before posting a review.");
      return;
    }

    try {
      await api.createListingReview(selectedListingId, {
        rating: Number(rating),
        comment: comment.trim() || undefined,
      });
      const [reviewsResponse, listingsResponse] = await Promise.all([
        api.listingReviews(selectedListingId),
        api.listings(
          selectedDepartment === "ALL" ? undefined : selectedDepartment,
        ),
      ]);
      setListingReviews(reviewsResponse.reviews);
      setListings(listingsResponse.listings);
      setComment("");
      setRating(5);
    } catch (err) {
      setReviewError(
        err instanceof Error ? err.message : "Failed to save review",
      );
    }
  };

  const updateListingField = (field, value) => {
    setListingForm((prev) => ({ ...prev, [field]: value }));
  };

  const uploadListingImage = async () => {
    if (!selectedImageFile) {
      setListingError("Choose an image file before uploading.");
      return;
    }

    setUploadingImage(true);
    setListingError("");
    try {
      const response = await api.uploadMedia(selectedImageFile);
      updateListingField("imageUrl", response.media.url);
    } catch (err) {
      setListingError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const submitListing = async (event) => {
    event.preventDefault();
    setBusy(true);
    setListingError("");
    try {
      await api.createListing({
        title: listingForm.title.trim(),
        description: listingForm.description.trim(),
        department: listingForm.department,
        category: listingForm.category.trim() || undefined,
        tags: listingForm.tags
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        imageUrl: listingForm.imageUrl.trim() || undefined,
        price: Number(listingForm.price),
      });
      setListingForm(initialListingForm);
      setSelectedImageFile(null);
      await loadListings(listingForm.department);
      setSelectedDepartment(listingForm.department);
    } catch (err) {
      setListingError(
        err instanceof Error ? err.message : "Failed to create listing",
      );
    } finally {
      setBusy(false);
    }
  };

  const buyListing = async (listingId) => {
    setListingError("");
    try {
      await api.purchaseListing(listingId);
      if (isProvider) {
        const data = await api.marketplaceOrders();
        setOrders(data.orders);
      }
    } catch (err) {
      setListingError(err instanceof Error ? err.message : "Purchase failed");
    }
  };

  return (
    <>
      <PageHeader
        title="Marketplace"
        description="Browse products by department, or manage department-based retail listings for your services."
      />

      <section
        className="card"
        style={{
          marginBottom: "1.5rem",
          background:
            "linear-gradient(145deg, rgba(17,24,39,0.9), rgba(12,42,36,0.74))",
          border: "1px solid rgba(16, 185, 129, 0.25)",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <div style={{ gridColumn: "1 / -1" }}>
            <p
              style={{
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontSize: "0.75rem",
                color: "#6ee7b7",
                fontWeight: 700,
              }}
            >
              Department Marketplace
            </p>
            <h2 style={{ margin: "0.35rem 0 0.5rem", fontSize: "1.5rem" }}>
              {selectedDepartmentMeta?.label} Spotlight
            </h2>
            <p style={{ margin: 0, color: "#d1d5db", maxWidth: "60ch" }}>
              {selectedDepartmentMeta?.blurb}
            </p>
          </div>

          <article
            style={{
              background: "rgba(2, 6, 23, 0.42)",
              border: "1px solid rgba(148,163,184,0.25)",
              borderRadius: "0.7rem",
              padding: "0.85rem",
            }}
          >
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.85rem" }}>
              Listings shown
            </p>
            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: "1.4rem",
                fontWeight: 700,
              }}
            >
              {listings.length}
            </p>
          </article>
          <article
            style={{
              background: "rgba(2, 6, 23, 0.42)",
              border: "1px solid rgba(148,163,184,0.25)",
              borderRadius: "0.7rem",
              padding: "0.85rem",
            }}
          >
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.85rem" }}>
              Active reviews
            </p>
            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: "1.4rem",
                fontWeight: 700,
              }}
            >
              {listingReviews.length}
            </p>
          </article>
          <article
            style={{
              background: "rgba(2, 6, 23, 0.42)",
              border: "1px solid rgba(148,163,184,0.25)",
              borderRadius: "0.7rem",
              padding: "0.85rem",
            }}
          >
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.85rem" }}>
              Department filters
            </p>
            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: "1.4rem",
                fontWeight: 700,
              }}
            >
              {departments.length - 1}
            </p>
          </article>
        </div>
      </section>

      <section className="card" style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ marginTop: 0 }}>Browse by Department</h3>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {departments.map((department) => {
            const active = selectedDepartment === department.value;
            return (
              <button
                key={department.value}
                className={`btn${active ? " btn-primary" : " btn-secondary"}`}
                type="button"
                onClick={() => setSelectedDepartment(department.value)}
                style={{
                  border: active
                    ? "1px solid rgba(110, 231, 183, 0.55)"
                    : "1px solid rgba(148, 163, 184, 0.25)",
                }}
              >
                {department.label}
              </button>
            );
          })}
        </div>
      </section>

      {isProvider ? (
        <section className="card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginTop: 0 }}>Create Department Product Listing</h3>
          {listingError ? <p className="error-text">{listingError}</p> : null}
          <form className="form-stack" onSubmit={submitListing}>
            <label>
              Department
              <select
                value={listingForm.department}
                onChange={(e) =>
                  updateListingField("department", e.target.value)
                }
              >
                {departments
                  .filter((department) => department.value !== "ALL")
                  .map((department) => (
                    <option key={department.value} value={department.value}>
                      {department.label}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Product Title
              <input
                value={listingForm.title}
                onChange={(e) => updateListingField("title", e.target.value)}
                required
              />
            </label>
            <label>
              Description
              <textarea
                value={listingForm.description}
                onChange={(e) =>
                  updateListingField("description", e.target.value)
                }
                rows={4}
                required
              />
            </label>
            <label>
              Category
              <input
                value={listingForm.category}
                onChange={(e) => updateListingField("category", e.target.value)}
                placeholder="Hair Care, Nail Tools, Brow Kits"
              />
            </label>
            <label>
              Tags
              <input
                value={listingForm.tags}
                onChange={(e) => updateListingField("tags", e.target.value)}
                placeholder="retail, salon, pro-use"
              />
            </label>
            <label>
              Image URL
              <input
                value={listingForm.imageUrl}
                onChange={(e) => updateListingField("imageUrl", e.target.value)}
                placeholder="/uploads/product.jpg"
              />
            </label>
            <label>
              Upload Product Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSelectedImageFile(e.target.files?.[0] ?? null)
                }
              />
            </label>
            <button
              className="btn"
              type="button"
              onClick={uploadListingImage}
              disabled={uploadingImage || !selectedImageFile}
            >
              {uploadingImage ? "Uploading image..." : "Upload image"}
            </button>
            <label>
              Price (USD)
              <input
                type="number"
                min="1"
                step="0.01"
                value={listingForm.price}
                onChange={(e) => updateListingField("price", e.target.value)}
                required
              />
            </label>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? "Saving listing..." : "Create Product Listing"}
            </button>
          </form>
        </section>
      ) : null}

      {listings.length === 0 ? (
        <div className="card">
          <p style={{ margin: 0, color: "#94a3b8" }}>
            No listings yet in this department.
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {listings.map((item) => (
            <article
              key={item.id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                background:
                  selectedListingId === item.id
                    ? "linear-gradient(180deg, rgba(15,23,42,0.95), rgba(16,56,47,0.78))"
                    : "rgba(15, 23, 42, 0.85)",
                border:
                  selectedListingId === item.id
                    ? "1px solid rgba(16, 185, 129, 0.45)"
                    : "1px solid rgba(148, 163, 184, 0.15)",
              }}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "0.75rem",
                    marginBottom: "0.25rem",
                  }}
                />
              ) : null}
              <h3
                style={{
                  color: "#e2e8f0",
                  fontSize: "1.05rem",
                  marginBottom: 0,
                }}
              >
                {item.title}
              </h3>
              <p style={{ color: "#cbd5e1" }}>{item.description}</p>
              <p style={{ color: "#94a3b8", margin: "0 0 0.35rem" }}>
                Department: {item.department ?? "General"}
                {item.category ? ` | Category: ${item.category}` : ""}
              </p>
              <p style={{ color: "#94a3b8", marginTop: 0 }}>
                {item.tags?.length
                  ? `Tags: ${item.tags.join(", ")}`
                  : "No tags"}
              </p>
              <p className="value">${Number(item.price).toFixed(2)}</p>
              <p style={{ color: "#94a3b8", marginBottom: 0 }}>
                Rating: {item.ratingAverage ?? "No ratings yet"}
                {item.reviewCount
                  ? ` (${item.reviewCount} review${item.reviewCount === 1 ? "" : "s"})`
                  : ""}
              </p>
              <button
                className="btn"
                type="button"
                style={{ marginTop: "0.35rem" }}
                onClick={() => setSelectedListingId(item.id)}
              >
                {selectedListingId === item.id
                  ? "Viewing reviews"
                  : "View reviews"}
              </button>
              {user ? (
                <button
                  className="btn btn-primary"
                  type="button"
                  style={{ marginTop: "0.2rem" }}
                  onClick={() => buyListing(item.id)}
                >
                  Buy product
                </button>
              ) : null}
            </article>
          ))}
        </div>
      )}

      {isProvider ? (
        <section className="card" style={{ marginTop: "1.5rem" }}>
          <h3 style={{ marginTop: 0 }}>Marketplace Orders</h3>
          {orders.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No product orders yet.</p>
          ) : (
            orders.map((order) => (
              <article
                key={order.id}
                style={{
                  borderTop: "1px solid #1e293b",
                  paddingTop: "0.75rem",
                }}
              >
                <p style={{ margin: 0, fontWeight: 600 }}>
                  {order.listing.title}
                </p>
                <p style={{ margin: "0.25rem 0 0", color: "#94a3b8" }}>
                  {order.buyerId === user?.id ? "Purchased" : "Sold"} | $
                  {Number(order.total).toFixed(2)}
                </p>
              </article>
            ))
          )}
        </section>
      ) : null}

      <section className="card" style={{ marginTop: "1.5rem" }}>
        <h3 style={{ marginTop: 0 }}>Review Workspace</h3>
        {selectedListingId ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            <div
              style={{
                border: "1px solid rgba(148, 163, 184, 0.15)",
                borderRadius: "0.75rem",
                padding: "0.9rem",
                background: "rgba(2, 6, 23, 0.35)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#6ee7b7",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontSize: "0.75rem",
                }}
              >
                Selected listing
              </p>
              <p
                style={{
                  margin: "0.35rem 0 0",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                {selectedListing?.title ?? "Listing"}
              </p>

              {listingReviews.length === 0 ? (
                <p style={{ color: "#94a3b8", marginBottom: 0 }}>
                  No reviews yet for this listing.
                </p>
              ) : (
                listingReviews.map((review) => (
                  <article
                    key={review.id}
                    style={{
                      borderTop: "1px solid #1e293b",
                      paddingTop: "0.75rem",
                      marginTop: "0.75rem",
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 600 }}>
                      {review.author.name} · {review.rating}/5
                    </p>
                    {review.comment ? (
                      <p style={{ marginBottom: 0 }}>{review.comment}</p>
                    ) : null}
                  </article>
                ))
              )}
            </div>

            <form
              className="form-stack"
              onSubmit={submitReview}
              style={{
                border: "1px solid rgba(148, 163, 184, 0.15)",
                borderRadius: "0.75rem",
                padding: "0.9rem",
                background: "rgba(2, 6, 23, 0.35)",
              }}
            >
              <label>
                Rating
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </label>
              <label>
                Comment
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Share your experience"
                />
              </label>
              {reviewError ? <p className="error-text">{reviewError}</p> : null}
              <button className="btn btn-primary" type="submit">
                Submit review
              </button>
            </form>
          </div>
        ) : (
          <p style={{ color: "#94a3b8" }}>
            Choose a listing to read or write reviews.
          </p>
        )}
      </section>
    </>
  );
}
