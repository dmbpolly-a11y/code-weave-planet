/**
 * paymentService.js - Code Weave Planet Payment Integration
 * Supports MTN Mobile Money (Uganda), Airtel Money (Uganda), and Bank Account Transfers
 */

export const CWP_BANK_ACCOUNTS = [
  {
    bankName: "Stanbic Bank Uganda",
    accountName: "Code Weave Planet Ltd",
    accountNumber: "9030018492015",
    branch: "Mbarara Main Branch",
    currency: "UGX",
    swiftCode: "SBICUGKX",
  },
  {
    bankName: "Centenary Bank",
    accountName: "Code Weave Planet Ltd",
    accountNumber: "3100084729",
    branch: "Mbarara High Street",
    currency: "UGX",
    swiftCode: "CERBUGKX",
  }
];

export const CWP_MERCHANT_DETAILS = {
  mtn: {
    merchantName: "Code Weave Planet Ltd",
    momoPayCode: "750937",
    phone: "0770937506",
    network: "MTN Uganda",
  },
  airtel: {
    merchantName: "Code Weave Planet Ltd",
    merchantCode: "439201",
    phone: "0750937506",
    network: "Airtel Uganda",
  }
};

const PAYMENTS_STORAGE_KEY = 'codeweave_payment_history';

/**
 * Validate Ugandan phone numbers by network
 */
export function validateUgandaPhone(phone, network) {
  if (!phone) return { valid: false, error: "Phone number is required." };
  
  // Clean phone number (remove spaces, dashes)
  const cleaned = phone.replace(/[\s-]/g, '');
  
  if (network === 'MTN') {
    // Valid MTN prefixes: 077, 078, 076, +25677, +25678, +25676
    const mtnRegex = /^(?:\+256|256|0)?(77|78|76)\d{7}$/;
    if (!mtnRegex.test(cleaned)) {
      return {
        valid: false,
        error: "Please enter a valid MTN Uganda phone number (e.g., 077X XXX XXX or 078X XXX XXX)."
      };
    }
    return { valid: true, formatted: cleaned };
  }

  if (network === 'AIRTEL') {
    // Valid Airtel prefixes: 070, 075, 074, +25670, +25675, +25674
    const airtelRegex = /^(?:\+256|256|0)?(70|75|74)\d{7}$/;
    if (!airtelRegex.test(cleaned)) {
      return {
        valid: false,
        error: "Please enter a valid Airtel Uganda phone number (e.g., 070X XXX XXX or 075X XXX XXX)."
      };
    }
    return { valid: true, formatted: cleaned };
  }

  return { valid: true, formatted: cleaned };
}

/**
 * Get all stored payments
 */
export function getPaymentHistory() {
  try {
    const raw = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Error reading payments:", err);
    return [];
  }
}

/**
 * Save payment transaction
 */
export function savePaymentRecord(payment) {
  try {
    const history = getPaymentHistory();
    const updated = [payment, ...history];
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(updated));
    return payment;
  } catch (err) {
    console.error("Error saving payment:", err);
    return payment;
  }
}

/**
 * Generate unique transaction reference code
 */
export function generateTransactionRef(method) {
  const prefix = method === 'MTN' ? 'CWP-MTN' : method === 'AIRTEL' ? 'CWP-AIR' : 'CWP-BNK';
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomNum}`;
}

/**
 * Initiate Payment (MTN, Airtel, or Bank)
 * Returns a Promise that resolves with transaction confirmation
 */
export async function initiatePayment({
  method,
  amount,
  courseName,
  payerName,
  payerPhone,
  payerEmail,
  bankName,
  bankRefNumber,
}) {
  const txRef = generateTransactionRef(method);
  const timestamp = new Date().toISOString();

  // Create base payment object
  const paymentRecord = {
    id: txRef,
    method,
    amount,
    courseName: courseName || "Tuition / Course Fee",
    payerName: payerName || "Student",
    payerPhone: payerPhone || "",
    payerEmail: payerEmail || "",
    bankName: bankName || "",
    bankRefNumber: bankRefNumber || "",
    status: 'COMPLETED',
    createdAt: timestamp,
    receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
  };

  // Save to localStorage history
  savePaymentRecord(paymentRecord);

  // Auto enroll in user registered courses if logged in
  try {
    const enrolledRaw = localStorage.getItem('codeweave_enrolled_courses');
    const enrolled = enrolledRaw ? JSON.parse(enrolledRaw) : [];
    if (courseName && !enrolled.some(c => c.name === courseName)) {
      enrolled.push({
        id: `course-${Date.now()}`,
        name: courseName,
        enrolledAt: timestamp,
        status: 'PAID',
        txRef
      });
      localStorage.setItem('codeweave_enrolled_courses', JSON.stringify(enrolled));
    }
  } catch (e) {
    console.error("Auto enrollment update error:", e);
  }

  return paymentRecord;
}
