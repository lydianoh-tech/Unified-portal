import PageHeader from '../components/PageHeader';

export default function MediaPage() {
  return (
    <>
      <PageHeader
        title="Media Library"
        description="Upload photos and videos securely. Files are stored with access control per user."
      />
      <div className="card">
        <p style={{ margin: 0, color: '#94a3b8' }}>
          Use <code>POST /api/media/upload</code> with multipart form data to upload files.
          The UI upload widget can be added in the next iteration.
        </p>
      </div>
    </>
  );
}
