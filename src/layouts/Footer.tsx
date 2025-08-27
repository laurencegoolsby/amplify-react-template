import '../styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>Department of Human Services</h3>
            <p>Providing essential services and support to Pennsylvania residents.</p>
          </div>
          <div className="footer-section footer-contact">
            <h4>Contact Information</h4>
            <p>1-800-692-7462</p>
          </div>
        </div>
        <div className="footer-copyright">
          © 2024 Commonwealth of Pennsylvania
        </div>
      </div>
    </footer>
  );
}