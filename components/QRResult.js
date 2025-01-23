export default function QRResult({ qrData }) {
  return (
    <div>
      <h2>Generated QR Code</h2>
      <img src={`data:image/png;base64,${qrData}`} alt="QR Code" />
    </div>
  );
}