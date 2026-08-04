import { useEffect, useState } from "react";
import { api } from "../services/api";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../hooks/useAuth";

const stageLabel = {
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  ON_THE_WAY: "On the way",
  ARRIVED: "Arrived",
  STARTED: "Started",
  MIDWAY: "Midway",
  FINISHED: "Finished",
};

export default function BookingsPage() {
  const now = new Date();
  const defaultTo = now.toISOString().slice(0, 10);
  const defaultFrom = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const { user } = useAuth();
  const isProvider = user?.role === "USER" || user?.role === "ADMIN";
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [openBookings, setOpenBookings] = useState([]);
  const [providerBookings, setProviderBookings] = useState([]);
  const [providerSummary, setProviderSummary] = useState(null);
  const [payoutReport, setPayoutReport] = useState(null);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutError, setPayoutError] = useState("");
  const [dateFrom, setDateFrom] = useState(defaultFrom);
  const [dateTo, setDateTo] = useState(defaultTo);
  const [commissionRate, setCommissionRate] = useState(20);
  const [downloadingWeeklyStatement, setDownloadingWeeklyStatement] =
    useState(false);
  const [downloadingCustomStatement, setDownloadingCustomStatement] =
    useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [serviceReviews, setServiceReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [selectedTrackingBookingId, setSelectedTrackingBookingId] =
    useState("");
  const [trackingBooking, setTrackingBooking] = useState(null);
  const [trackingError, setTrackingError] = useState("");
  const [stage, setStage] = useState("ON_THE_WAY");
  const [stageNote, setStageNote] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [trackingBusy, setTrackingBusy] = useState(false);

  const loadBookingsData = async () => {
    const requests = [api.services(), api.bookings()];
    if (isProvider) {
      requests.push(
        api.openBookings(),
        api.providerBookings(),
        api.providerEarnings(),
      );
    }

    const [
      servicesResponse,
      bookingsResponse,
      openResponse,
      providerResponse,
      earningsResponse,
    ] = await Promise.all(requests);

    setServices(servicesResponse.services);
    setBookings(bookingsResponse.bookings);
    setOpenBookings(isProvider ? openResponse.bookings : []);
    setProviderBookings(isProvider ? providerResponse.bookings : []);
    setProviderSummary(isProvider ? earningsResponse : null);
  };

  useEffect(() => {
    loadBookingsData().catch(() => {
      setTrackingError("Failed to load booking data.");
    });
  }, []);

  const loadPayoutReport = async (fromDate, toDate, commission) => {
    if (!isProvider) return;

    const fromIso = `${fromDate}T00:00:00.000Z`;
    const toIso = `${toDate}T23:59:59.999Z`;

    setPayoutLoading(true);
    setPayoutError("");
    try {
      const report = await api.providerPayoutReport({
        from: fromIso,
        to: toIso,
        commissionRate: commission,
      });
      setPayoutReport(report);
    } catch (err) {
      setPayoutReport(null);
      setPayoutError(
        err instanceof Error ? err.message : "Failed to load payout report",
      );
    } finally {
      setPayoutLoading(false);
    }
  };

  useEffect(() => {
    loadPayoutReport(defaultFrom, defaultTo, 20).catch(() => {
      setPayoutError("Failed to load payout report");
    });
  }, []);

  useEffect(() => {
    if (!selectedServiceId) {
      setServiceReviews([]);
      return;
    }

    api
      .serviceReviews(selectedServiceId)
      .then((data) => setServiceReviews(data.reviews))
      .catch(() => setServiceReviews([]));
  }, [selectedServiceId]);

  useEffect(() => {
    if (!selectedTrackingBookingId) {
      setTrackingBooking(null);
      return;
    }

    api
      .bookingTracking(selectedTrackingBookingId)
      .then((data) => {
        setTrackingBooking(data.booking);
        setTrackingError("");
      })
      .catch((err) => {
        setTrackingBooking(null);
        setTrackingError(
          err instanceof Error
            ? err.message
            : "Failed to load tracking timeline",
        );
      });
  }, [selectedTrackingBookingId]);

  const submitReview = async (event) => {
    event.preventDefault();
    setReviewError("");
    if (!selectedServiceId) {
      setReviewError("Choose a service before posting a review.");
      return;
    }

    try {
      await api.createServiceReview(selectedServiceId, {
        rating: Number(rating),
        comment: comment.trim() || undefined,
      });
      const [reviewsResponse, servicesResponse] = await Promise.all([
        api.serviceReviews(selectedServiceId),
        api.services(),
      ]);
      setServiceReviews(reviewsResponse.reviews);
      setServices(servicesResponse.services);
      setComment("");
      setRating(5);
    } catch (err) {
      setReviewError(
        err instanceof Error ? err.message : "Failed to save review",
      );
    }
  };

  const acceptBooking = async (bookingId) => {
    try {
      await api.acceptBooking(bookingId);
      await loadBookingsData();
      setSelectedTrackingBookingId(bookingId);
    } catch (err) {
      setTrackingError(
        err instanceof Error ? err.message : "Failed to accept booking",
      );
    }
  };

  const rejectBooking = async (bookingId) => {
    const reason = window.prompt("Reason for rejection (optional):") ?? "";
    try {
      await api.rejectBooking(bookingId, { reason: reason || undefined });
      await loadBookingsData();
      setSelectedTrackingBookingId(bookingId);
    } catch (err) {
      setTrackingError(
        err instanceof Error ? err.message : "Failed to reject booking",
      );
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setTrackingError("Geolocation is not available on this device/browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
      },
      () => setTrackingError("Unable to read your current location."),
    );
  };

  const submitTrackingUpdate = async (event) => {
    event.preventDefault();
    if (!trackingBooking) return;

    setTrackingBusy(true);
    setTrackingError("");
    try {
      const evidenceUrls = await Promise.all(
        Array.from(evidenceFiles).map(async (file) => {
          const response = await api.uploadMedia(file);
          return response.media.url;
        }),
      );

      await api.updateBookingTracking(trackingBooking.id, {
        stage,
        note: stageNote.trim() || undefined,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        evidenceUrls,
      });

      const [trackingResponse] = await Promise.all([
        api.bookingTracking(trackingBooking.id),
        loadBookingsData(),
      ]);

      setTrackingBooking(trackingResponse.booking);
      setStageNote("");
      setEvidenceFiles([]);
    } catch (err) {
      setTrackingError(
        err instanceof Error ? err.message : "Failed to update tracking",
      );
    } finally {
      setTrackingBusy(false);
    }
  };

  const isProviderForTracking =
    trackingBooking && user && trackingBooking.providerId === user.id;

  const applyPayoutFilters = async (event) => {
    event.preventDefault();
    await loadPayoutReport(dateFrom, dateTo, Number(commissionRate));
  };

  const downloadWeeklyStatement = async () => {
    setDownloadingWeeklyStatement(true);
    setPayoutError("");
    try {
      await api.downloadProviderWeeklyStatement({
        weekStart: `${dateFrom}T00:00:00.000Z`,
        commissionRate: Number(commissionRate),
        filename: `weekly-statement-${dateFrom}.csv`,
      });
    } catch (err) {
      setPayoutError(
        err instanceof Error ? err.message : "Failed to download statement",
      );
    } finally {
      setDownloadingWeeklyStatement(false);
    }
  };

  const downloadCustomStatement = async () => {
    setDownloadingCustomStatement(true);
    setPayoutError("");
    try {
      await api.downloadProviderCustomStatement({
        from: `${dateFrom}T00:00:00.000Z`,
        to: `${dateTo}T23:59:59.999Z`,
        commissionRate: Number(commissionRate),
        filename: `payout-statement-${dateFrom}-to-${dateTo}.csv`,
      });
    } catch (err) {
      setPayoutError(
        err instanceof Error ? err.message : "Failed to download statement",
      );
    } finally {
      setDownloadingCustomStatement(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Service Bookings"
        description={
          isProvider
            ? "Accept rides, manage active trips, and monitor earnings like a driver app."
            : "Browse available services and view your reservations."
        }
      />
      {isProvider && providerSummary ? (
        <div className="card-grid" style={{ marginBottom: "1.5rem" }}>
          <article className="card">
            <h3>Today Earnings</h3>
            <p className="value">
              ${providerSummary.earnings.today.toFixed(2)}
            </p>
          </article>
          <article className="card">
            <h3>This Week</h3>
            <p className="value">${providerSummary.earnings.week.toFixed(2)}</p>
          </article>
          <article className="card">
            <h3>This Month</h3>
            <p className="value">
              ${providerSummary.earnings.month.toFixed(2)}
            </p>
          </article>
          <article className="card">
            <h3>All-time Earnings</h3>
            <p className="value">
              ${providerSummary.earnings.allTime.toFixed(2)}
            </p>
          </article>
          <article className="card">
            <h3>Completed Trips</h3>
            <p className="value">{providerSummary.trips.completed}</p>
          </article>
          <article className="card">
            <h3>Active Trips</h3>
            <p className="value">{providerSummary.trips.active}</p>
          </article>
        </div>
      ) : null}
      {isProvider ? (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginTop: 0 }}>Payout Reporting</h3>
          <form
            className="form-stack"
            onSubmit={applyPayoutFilters}
            style={{ marginBottom: "1rem" }}
          >
            <label>
              From date
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                required
              />
            </label>
            <label>
              To date
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                required
              />
            </label>
            <label>
              Commission rate (%)
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
              />
            </label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={payoutLoading}
              >
                {payoutLoading ? "Refreshing..." : "Apply filters"}
              </button>
              <button
                className="btn"
                type="button"
                disabled={downloadingWeeklyStatement}
                onClick={downloadWeeklyStatement}
              >
                {downloadingWeeklyStatement
                  ? "Preparing statement..."
                  : "Download weekly statement (CSV)"}
              </button>
              <button
                className="btn"
                type="button"
                disabled={downloadingCustomStatement}
                onClick={downloadCustomStatement}
              >
                {downloadingCustomStatement
                  ? "Preparing custom export..."
                  : "Export custom date range (CSV)"}
              </button>
            </div>
          </form>
          {payoutError ? <p className="error-text">{payoutError}</p> : null}

          {payoutReport ? (
            <>
              <div className="card-grid" style={{ marginBottom: "1rem" }}>
                <article className="card">
                  <h3>Gross Earnings</h3>
                  <p className="value">
                    ${payoutReport.totals.gross.toFixed(2)}
                  </p>
                </article>
                <article className="card">
                  <h3>Commission</h3>
                  <p className="value">
                    -${payoutReport.totals.commission.toFixed(2)}
                  </p>
                </article>
                <article className="card">
                  <h3>Net Payout</h3>
                  <p className="value">${payoutReport.totals.net.toFixed(2)}</p>
                </article>
                <article className="card">
                  <h3>Trips In Range</h3>
                  <p className="value">{payoutReport.totals.trips}</p>
                </article>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Completed At</th>
                      <th>Service</th>
                      <th>Customer</th>
                      <th>Gross</th>
                      <th>Commission</th>
                      <th>Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payoutReport.trips.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ color: "#94a3b8" }}>
                          No completed trips found in this date range.
                        </td>
                      </tr>
                    ) : (
                      payoutReport.trips.map((trip) => (
                        <tr key={trip.id}>
                          <td>{new Date(trip.completedAt).toLocaleString()}</td>
                          <td>{trip.serviceName}</td>
                          <td>{trip.customerName}</td>
                          <td>${Number(trip.gross).toFixed(2)}</td>
                          <td>-${Number(trip.commission).toFixed(2)}</td>
                          <td style={{ color: "#6ee7b7", fontWeight: 700 }}>
                            ${Number(trip.net).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
      <div className="card-grid" style={{ marginBottom: "2rem" }}>
        {services.map((service) => (
          <article key={service.id} className="card">
            <h3>{service.name}</h3>
            <p style={{ color: "#cbd5e1" }}>{service.description}</p>
            <p className="value">${Number(service.price).toFixed(2)}</p>
            <p style={{ color: "#94a3b8", marginBottom: 0 }}>
              Rating: {service.ratingAverage ?? "No ratings yet"}
              {service.reviewCount
                ? ` (${service.reviewCount} review${service.reviewCount === 1 ? "" : "s"})`
                : ""}
            </p>
            <button
              className="btn"
              type="button"
              style={{ marginTop: "0.75rem" }}
              onClick={() => setSelectedServiceId(service.id)}
            >
              View reviews
            </button>
          </article>
        ))}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Your customer bookings</th>
              <th>Status</th>
              <th>Tracking</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.service.name}</td>
                <td>{stageLabel[booking.currentStage] ?? booking.status}</td>
                <td>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => setSelectedTrackingBookingId(booking.id)}
                  >
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isProvider ? (
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h3 style={{ marginTop: 0 }}>Open Service Requests</h3>
          {openBookings.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>
              No open bookings are waiting for provider acceptance.
            </p>
          ) : (
            openBookings.map((booking) => (
              <article
                key={booking.id}
                style={{
                  borderTop: "1px solid #1e293b",
                  paddingTop: "0.75rem",
                }}
              >
                <p style={{ margin: 0, fontWeight: 600 }}>
                  {booking.service.name} for {booking.customer.name}
                </p>
                <p style={{ margin: "0.25rem 0 0.5rem", color: "#94a3b8" }}>
                  Scheduled: {new Date(booking.scheduledAt).toLocaleString()}
                </p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => acceptBooking(booking.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => rejectBooking(booking.id)}
                  >
                    Reject
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      ) : null}

      {isProvider ? (
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h3 style={{ marginTop: 0 }}>My Provider Jobs</h3>
          {providerBookings.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No jobs assigned to you yet.</p>
          ) : (
            providerBookings.map((booking) => (
              <article
                key={booking.id}
                style={{
                  borderTop: "1px solid #1e293b",
                  paddingTop: "0.75rem",
                }}
              >
                <p style={{ margin: 0, fontWeight: 600 }}>
                  {booking.service.name} for {booking.customer.name}
                </p>
                <p style={{ margin: "0.25rem 0 0.5rem", color: "#94a3b8" }}>
                  Current stage:{" "}
                  {stageLabel[booking.currentStage] ?? booking.status}
                </p>
                <button
                  className="btn"
                  type="button"
                  onClick={() => setSelectedTrackingBookingId(booking.id)}
                >
                  Open tracking
                </button>
              </article>
            ))
          )}
        </div>
      ) : null}

      {isProvider && providerSummary ? (
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h3 style={{ marginTop: 0 }}>Recent Completed Trips</h3>
          {providerSummary.recentTrips.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No completed trips yet.</p>
          ) : (
            providerSummary.recentTrips.map((trip) => (
              <article
                key={trip.id}
                style={{
                  borderTop: "1px solid #1e293b",
                  paddingTop: "0.75rem",
                }}
              >
                <p style={{ margin: 0, fontWeight: 600 }}>{trip.serviceName}</p>
                <p style={{ margin: "0.25rem 0", color: "#94a3b8" }}>
                  Completed: {new Date(trip.completedAt).toLocaleString()}
                </p>
                <p style={{ margin: 0, color: "#6ee7b7", fontWeight: 700 }}>
                  +${Number(trip.fare).toFixed(2)}
                </p>
              </article>
            ))
          )}
        </div>
      ) : null}

      <div className="card" style={{ marginTop: "1.5rem" }}>
        <h3 style={{ marginTop: 0 }}>Live Booking Tracking</h3>
        {trackingError ? <p className="error-text">{trackingError}</p> : null}
        {!trackingBooking ? (
          <p style={{ color: "#94a3b8" }}>
            Select a booking to view full progress timeline.
          </p>
        ) : (
          <>
            <p style={{ color: "#cbd5e1" }}>
              {trackingBooking.service.name} | Customer:{" "}
              {trackingBooking.customer.name} | Provider:{" "}
              {trackingBooking.provider?.name ?? "Pending"}
            </p>
            <p style={{ color: "#94a3b8" }}>
              Current stage:{" "}
              {stageLabel[trackingBooking.currentStage] ??
                trackingBooking.status}
            </p>
            {trackingBooking.currentLat && trackingBooking.currentLng ? (
              <p style={{ color: "#94a3b8" }}>
                Last location: {trackingBooking.currentLat},{" "}
                {trackingBooking.currentLng}
              </p>
            ) : null}

            {trackingBooking.progressUpdates.length === 0 ? (
              <p style={{ color: "#94a3b8" }}>No updates yet.</p>
            ) : (
              trackingBooking.progressUpdates.map((update) => (
                <article
                  key={update.id}
                  style={{
                    borderTop: "1px solid #1e293b",
                    paddingTop: "0.75rem",
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    {stageLabel[update.stage]} by {update.actor.name}
                  </p>
                  <p style={{ margin: "0.25rem 0", color: "#94a3b8" }}>
                    {new Date(update.createdAt).toLocaleString()}
                  </p>
                  {update.note ? (
                    <p style={{ marginTop: 0 }}>{update.note}</p>
                  ) : null}
                  {update.latitude && update.longitude ? (
                    <p style={{ marginTop: 0, color: "#94a3b8" }}>
                      GPS: {update.latitude}, {update.longitude}
                    </p>
                  ) : null}
                  {update.evidenceUrls.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      {update.evidenceUrls.map((url) => (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Evidence
                        </a>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))
            )}

            {isProviderForTracking ? (
              <form
                className="form-stack"
                onSubmit={submitTrackingUpdate}
                style={{ marginTop: "1rem" }}
              >
                <label>
                  Stage
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                  >
                    <option value="ON_THE_WAY">On the way</option>
                    <option value="ARRIVED">Arrived</option>
                    <option value="STARTED">Started</option>
                    <option value="MIDWAY">Midway</option>
                    <option value="FINISHED">Finished</option>
                  </select>
                </label>
                <label>
                  Update note
                  <textarea
                    value={stageNote}
                    onChange={(e) => setStageNote(e.target.value)}
                    rows={3}
                    placeholder="Optional update for customer"
                  />
                </label>
                <label>
                  Latitude
                  <input
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="-1.292066"
                  />
                </label>
                <label>
                  Longitude
                  <input
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="36.821945"
                  />
                </label>
                <button
                  className="btn"
                  type="button"
                  onClick={useCurrentLocation}
                >
                  Use current GPS
                </button>
                <label>
                  Evidence photos/videos
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) => setEvidenceFiles(e.target.files ?? [])}
                  />
                </label>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={trackingBusy}
                >
                  {trackingBusy ? "Saving update..." : "Post tracking update"}
                </button>
              </form>
            ) : null}
          </>
        )}
      </div>
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <h3 style={{ marginTop: 0 }}>Service Reviews</h3>
        {selectedServiceId ? (
          <>
            {serviceReviews.length === 0 ? (
              <p style={{ color: "#94a3b8" }}>
                No reviews yet for this service.
              </p>
            ) : (
              serviceReviews.map((review) => (
                <article
                  key={review.id}
                  style={{
                    borderTop: "1px solid #1e293b",
                    paddingTop: "0.75rem",
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

            <form
              className="form-stack"
              onSubmit={submitReview}
              style={{ marginTop: "1rem" }}
            >
              <label>
                Rating
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
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
                  placeholder="Share your service experience"
                />
              </label>
              {reviewError ? <p className="error-text">{reviewError}</p> : null}
              <button className="btn btn-primary" type="submit">
                Submit review
              </button>
            </form>
          </>
        ) : (
          <p style={{ color: "#94a3b8" }}>
            Choose a service to read or write reviews.
          </p>
        )}
      </div>
    </>
  );
}
