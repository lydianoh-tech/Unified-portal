import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { api } from "../services/api";

const departments = [
  { value: "HAIRSTYLIST", label: "Hairstylist" },
  { value: "NAILS", label: "Nails" },
  { value: "EYEBROWS", label: "Eyebrows" },
  { value: "DRESSING", label: "Dressing" },
  { value: "DESIGNER", label: "Designer" },
  { value: "STYLIST", label: "Stylist" },
];

const initialForm = {
  name: "",
  description: "",
  category: "",
  department: "HAIRSTYLIST",
  tags: "",
  imageUrl: "",
  price: "",
  durationMin: "60",
};

export default function ProviderServicesPage() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [error, setError] = useState("");

  const activeCount = useMemo(
    () => services.filter((service) => service.active).length,
    [services],
  );

  async function loadProviderServices() {
    const response = await api.providerServices();
    setServices(response.services);
  }

  useEffect(() => {
    loadProviderServices().catch((err) => {
      setError(err instanceof Error ? err.message : "Failed to load services");
    });
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function beginEdit(service) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description,
      category: service.category ?? "",
      department: service.department ?? "HAIRSTYLIST",
      tags: (service.tags ?? []).join(", "),
      imageUrl: service.imageUrl ?? "",
      price: String(service.price),
      durationMin: String(service.durationMin),
    });
    setSelectedImageFile(null);
    setError("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(initialForm);
    setSelectedImageFile(null);
  }

  async function uploadListingImage() {
    if (!selectedImageFile) {
      setError("Choose an image file before uploading.");
      return;
    }

    setUploadingImage(true);
    setError("");
    try {
      const response = await api.uploadMedia(selectedImageFile);
      updateField("imageUrl", response.media.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  }

  async function submitService(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim() || undefined,
      department: form.department,
      tags: form.tags
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      imageUrl: form.imageUrl.trim() || undefined,
      price: Number(form.price),
      durationMin: Number(form.durationMin),
    };

    try {
      if (editingId) {
        await api.updateProviderService(editingId, payload);
      } else {
        await api.createProviderService(payload);
      }
      await loadProviderServices();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save service");
    } finally {
      setBusy(false);
    }
  }

  async function archiveService(serviceId) {
    setBusy(true);
    setError("");
    try {
      await api.archiveProviderService(serviceId);
      await loadProviderServices();
      if (editingId === serviceId) {
        resetForm();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to archive service",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Seller Services"
        description="Manage your service catalog like a seller dashboard."
      />

      <div className="card-grid" style={{ marginBottom: "1rem" }}>
        <article className="card">
          <h3>Total Services</h3>
          <p className="value">{services.length}</p>
        </article>
        <article className="card">
          <h3>Active Listings</h3>
          <p className="value">{activeCount}</p>
        </article>
      </div>

      <div className="card" style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ marginTop: 0 }}>
          {editingId ? "Edit Service Listing" : "Create Service Listing"}
        </h3>
        {error ? <p className="error-text">{error}</p> : null}
        <form className="form-stack" onSubmit={submitService}>
          <label>
            Service Name
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={4}
              required
            />
          </label>
          <label>
            Department
            <select
              value={form.department}
              onChange={(event) =>
                updateField("department", event.target.value)
              }
            >
              {departments.map((department) => (
                <option key={department.value} value={department.value}>
                  {department.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Category
            <input
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
              placeholder="Beauty, Home Repair, Tech Support"
            />
          </label>
          <label>
            Tags (comma-separated)
            <input
              value={form.tags}
              onChange={(event) => updateField("tags", event.target.value)}
              placeholder="lashes, mobile, same-day"
            />
          </label>
          <label>
            Listing Image URL
            <input
              value={form.imageUrl}
              onChange={(event) => updateField("imageUrl", event.target.value)}
              placeholder="/uploads/example.jpg"
            />
          </label>
          <label>
            Upload Listing Image
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setSelectedImageFile(event.target.files?.[0] ?? null)
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
          {form.imageUrl ? (
            <img
              src={form.imageUrl}
              alt="Listing preview"
              style={{
                width: "100%",
                maxWidth: "240px",
                borderRadius: "0.6rem",
              }}
            />
          ) : null}
          <label>
            Price (USD)
            <input
              type="number"
              min="1"
              step="0.01"
              value={form.price}
              onChange={(event) => updateField("price", event.target.value)}
              required
            />
          </label>
          <label>
            Duration (minutes)
            <input
              type="number"
              min="15"
              max="480"
              step="15"
              value={form.durationMin}
              onChange={(event) =>
                updateField("durationMin", event.target.value)
              }
              required
            />
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy
                ? "Saving..."
                : editingId
                  ? "Update Listing"
                  : "Create Listing"}
            </button>
            {editingId ? (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={resetForm}
                disabled={busy}
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Department</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Status</th>
              <th>Bookings</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.6rem",
                      alignItems: "center",
                    }}
                  >
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        style={{
                          width: "44px",
                          height: "44px",
                          objectFit: "cover",
                          borderRadius: "0.45rem",
                        }}
                      />
                    ) : null}
                    <span>{service.name}</span>
                  </div>
                </td>
                <td>${Number(service.price).toFixed(2)}</td>
                <td>{service.durationMin} min</td>
                <td>{service.department ?? "-"}</td>
                <td>{service.category ?? "-"}</td>
                <td>{service.tags?.length ? service.tags.join(", ") : "-"}</td>
                <td>{service.active ? "Active" : "Archived"}</td>
                <td>{service.bookingCount ?? 0}</td>
                <td>
                  {service.ratingAverage ?? "-"}
                  {service.reviewCount ? ` (${service.reviewCount})` : ""}
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn"
                      type="button"
                      onClick={() => beginEdit(service)}
                      disabled={busy}
                    >
                      Edit
                    </button>
                    {service.active ? (
                      <button
                        className="btn"
                        type="button"
                        onClick={() => archiveService(service.id)}
                        disabled={busy}
                      >
                        Archive
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
