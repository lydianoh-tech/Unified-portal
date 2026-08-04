import PageHeader from '../components/PageHeader';

export default function ChatPage() {
  return (
    <>
      <PageHeader
        title="Real-time Chat"
        description="Socket.io powers instant messaging between platform users."
      />
      <div className="card">
        <p style={{ margin: 0, color: '#94a3b8' }}>
          Connect with <code>socket.io-client</code> using your JWT access token.
          Conversation UI will be wired up in the next phase.
        </p>
      </div>
    </>
  );
}
