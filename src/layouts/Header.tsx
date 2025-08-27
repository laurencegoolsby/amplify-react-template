import '../styles/header.css';

interface HeaderProps {
  onSignOut: () => void;
}

export default function Header({ onSignOut }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-banner">
        <div className="header-banner-content">
          An Unofficial Pennsylvania Government Website
        </div>
      </div>
      <div className="header-main">
        <div className="header-brand">
          <div className="header-logo">PA</div>
          <div>
            <h1 className="header-title">Department of Human Services</h1>
            <p className="header-subtitle">Document Processing Portal</p>
          </div>
        </div>
        <button onClick={onSignOut} className="sign-out-btn">
          Sign Out
        </button>
      </div>
    </header>
  );
}