export async function generateQR({ apiKey, apiServer, bankAccount, bankCode, amount }) {
  const requestData = {
    bank_account: bankAccount,
    bank_code: bankCode,
    amount: amount
  };

  const response = await fetch(apiServer, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`, // Thay đổi header và sử dụng Bearer Token
    },
    body: JSON.stringify(requestData)
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.qrImage; // Giả sử API trả về { qrImage: "base64_encoded_image" }
}