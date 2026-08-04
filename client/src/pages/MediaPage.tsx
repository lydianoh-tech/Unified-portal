export default function MediaPage() {
  return (
    <>
      <header className="page-header">
        <h1>Media Library</h1>
        <p>Upload photos and videos securely. Files are stored with access control per user.</p>
      </header>
      <div className="card">
        <p style={{ margin: 0, color: '#94a3b8' }}>
          Use <code>POST /api/media/upload</code> with multipart form data to upload files.
          The UI upload widget can be added in the next iteration.
        </p>
      </div>
    </>
  );
}
