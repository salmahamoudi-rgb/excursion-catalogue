function Navbar({ user, onLogout, onLoginClick }) {
  return (
    <header className="navbar">
      <h1>Excursion Catalogue</h1>

      <nav className="nav-links">
        <a href="#about">About</a>
        <a href="#contact">Contact</a>

        {user ? (
          <>
            <span>Hello, {user.name}{user.role === 'admin' && ' (admin)'}</span>
            <button className="outline" onClick={onLogout}>Log out</button>
          </>
        ) : (
          <button className="outline" onClick={onLoginClick}>Login</button>
        )}
      </nav>
    </header>
  );
}

export default Navbar;