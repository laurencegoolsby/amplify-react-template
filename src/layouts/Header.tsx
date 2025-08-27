import '../styles/header.css';

export default function Header() {
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
      </div>
    </header>
  );
}