// Hiện tại component này đang không được sử dụng. 
// Bạn có thể bỏ qua hoặc xóa nó
import { useState } from 'react';

export default function QRForm({ onSubmit }) {
  const [bankAccount, setBankAccount] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ bankAccount, bankCode, amount });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="bankAccount">Bank Account:</label>
        <input
          type="text"
          id="bankAccount"
          value={bankAccount}
          onChange={(e) => setBankAccount(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="bankCode">Bank Code:</label>
        <input
          type="text"
          id="bankCode"
          value={bankCode}
          onChange={(e) => setBankCode(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <button type="submit">Generate QR</button>
    </form>
  );
}