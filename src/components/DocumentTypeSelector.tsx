interface DocumentTypeSelectorProps {
  documentType: string;
  onDocumentTypeChange: (type: string) => void;
}

export default function DocumentTypeSelector({ documentType, onDocumentTypeChange }: DocumentTypeSelectorProps) {
  return (
    <div className="document-type-selector">
      <h3 className="selector-title">Document Type:</h3>
      <div className="radio-group">
        <label className="radio-option">
          <input
            type="radio"
            name="documentType"
            value="Paystub"
            checked={documentType === 'Paystub'}
            onChange={(e) => onDocumentTypeChange(e.target.value)}
          />
          <span>Paystub</span>
        </label>
        <label className="radio-option">
          <input
            type="radio"
            name="documentType"
            value="Other"
            checked={documentType === 'Other'}
            onChange={(e) => onDocumentTypeChange(e.target.value)}
          />
          <span>Other</span>
        </label>
      </div>
    </div>
  );
}