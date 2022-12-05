export default function Dashboard() {
  return (
    <div id="user-dashboard" className="grid">
      <div id="welcome">Welcome, User.</div>
      <div>Chapters read</div>
      {/* Admin */}
      <div id="admin-pane">
        <ul>
          <li>Characters</li>
          <li>Worlds</li>
          <li>Other</li>
          <li>Stuff</li>
          <li>Characters</li>
        </ul>
      </div>
    </div>
  );
}
