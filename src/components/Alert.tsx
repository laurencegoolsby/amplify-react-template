interface AlertProps {
  show: boolean;
  message: string;
  type: 'success' | 'error';
  fading: boolean;
  onClose: () => void;
}

export default function Alert({ show, message, type, fading, onClose }: AlertProps) {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      backgroundColor: type === 'success' ? '#d4edda' : '#f8d7da',
      color: type === 'success' ? '#155724' : '#721c24',
      border: `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
      borderRadius: '8px',
      padding: '12px 24px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '500',
      animation: fading ? 'fadeOut 0.3s ease-out' : 'slideDown 0.3s ease-out',
      opacity: fading ? 0 : 1
    }}>
      <span style={{ fontSize: '16px', marginRight: '4px' }}>
        {type === 'success' ? '✓' : '✕'}
      </span>
      {message}
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          fontSize: '16px',
          cursor: 'pointer',
          marginLeft: '8px',
          padding: '0 4px'
        }}
      >
        ×
      </button>
    </div>
  );
}