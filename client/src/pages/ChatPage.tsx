export default function ChatPage() {
  return (
    <>
      <header className="page-header">
        <h1>Real-time Chat</h1>
        <p>Socket.io powers instant messaging between platform users.</p>
      </header>
      <div className="card">
        <p style={{ margin: 0, color: '#94a3b8' }}>
          Connect with <code>socket.io-client</code> using your JWT access token.
          Conversation UI will be wired up in the next phase.
        </p>
      </div>
    </>
  );
}
