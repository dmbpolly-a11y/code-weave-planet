import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import cwLogo from '../../public/images/Cwlogo.png';
import {
  CWP_BANK_ACCOUNTS,
  CWP_MERCHANT_DETAILS,
  validateUgandaPhone,
  initiatePayment
} from '../services/paymentService';

export default function PaymentModal({ isOpen, onClose, initialCourse = null, initialAmount = null }) {
  const [method, setMethod] = useState('MTN'); // 'MTN' | 'AIRTEL' | 'BANK'
  const [step, setStep] = useState('FORM'); // 'FORM' | 'PROMPTING' | 'SUCCESS'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [completedTx, setCompletedTx] = useState(null);

  // Form Fields
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [courseName, setCourseName] = useState(initialCourse ? initialCourse.name : 'AI and Machine Learning');
  const [amount, setAmount] = useState(initialAmount || (initialCourse ? initialCourse.price : '800,000 UGX'));
  
  // Bank fields
  const [selectedBank, setSelectedBank] = useState('Stanbic Bank Uganda');
  const [bankRefNumber, setBankRefNumber] = useState('');

  if (!isOpen) return null;

  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
    setError('');
  };

  const handleStartPayment = async (e) => {
    e.preventDefault();
    setError('');

    if (!payerName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (method === 'MTN' || method === 'AIRTEL') {
      const validation = validateUgandaPhone(payerPhone, method);
      if (!validation.valid) {
        setError(validation.error);
        return;
      }
    } else if (method === 'BANK') {
      if (!bankRefNumber.trim()) {
        setError('Please enter your Bank Deposit Slip or Transfer Reference number.');
        return;
      }
    }

    setLoading(true);

    if (method === 'MTN' || method === 'AIRTEL') {
      // Transition to simulated USSD Prompt screen
      setStep('PROMPTING');
      setLoading(false);
    } else {
      // Bank submission directly creates record
      try {
        const tx = await initiatePayment({
          method: 'BANK',
          amount,
          courseName,
          payerName,
          payerPhone,
          payerEmail,
          bankName: selectedBank,
          bankRefNumber
        });
        setCompletedTx(tx);
        setStep('SUCCESS');
      } catch (err) {
        setError('Failed to record bank payment: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleApproveUssdPrompt = async () => {
    setLoading(true);
    try {
      const tx = await initiatePayment({
        method,
        amount,
        courseName,
        payerName,
        payerPhone,
        payerEmail
      });
      setCompletedTx(tx);
      setStep('SUCCESS');
    } catch (err) {
      setError('Payment authorization failed: ' + err.message);
      setStep('FORM');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    setStep('FORM');
    setError('');
    setCompletedTx(null);
    onClose();
  };

  return (
    <div className="payment-modal-overlay" onClick={handleClose}>
      <style>{`
        .payment-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 17, 40, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 100000;
          animation: modalFadeIn 0.25s ease-out;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        .payment-modal-card {
          background: #FFFFFF;
          border-radius: 20px;
          width: 100%;
          max-width: 540px;
          box-shadow: 0 25px 70px rgba(10, 17, 40, 0.25), 0 0 0 1px rgba(201, 151, 38, 0.2);
          overflow: hidden;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          color: #0A1128;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .payment-header {
          padding: 20px 24px;
          background: #FFFFFF;
          border-bottom: 1px solid #EFECE6;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .payment-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .payment-header-logo {
          width: 42px;
          height: 42px;
          object-fit: contain;
        }

        .payment-header-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 19px;
          font-weight: 700;
          color: #0A1128;
          margin: 0;
        }

        .payment-header-subtitle {
          font-size: 12.5px;
          color: #71717A;
          margin: 0;
        }

        .payment-close-btn {
          background: #F4F4F5;
          border: none;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #52525B;
          transition: all 0.2s;
        }

        .payment-close-btn:hover {
          background: #E4E4E7;
          color: #18181B;
        }

        .payment-body {
          padding: 24px;
          overflow-y: auto;
        }

        /* Payment Method Tabs */
        .payment-method-tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 22px;
        }

        .payment-tab-btn {
          border: 2px solid #E4E4E7;
          border-radius: 12px;
          background: #FFFFFF;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: center;
        }

        .payment-tab-btn:hover {
          border-color: #C99726;
          background: #FFFDF8;
        }

        .payment-tab-btn.active.mtn {
          border-color: #FFCC00;
          background: #FFFDF0;
          box-shadow: 0 4px 14px rgba(255, 204, 0, 0.25);
        }

        .payment-tab-btn.active.airtel {
          border-color: #E60000;
          background: #FFF5F5;
          box-shadow: 0 4px 14px rgba(230, 0, 0, 0.18);
        }

        .payment-tab-btn.active.bank {
          border-color: #0A1128;
          background: #F8F9FC;
          box-shadow: 0 4px 14px rgba(10, 17, 40, 0.15);
        }

        .payment-tab-icon {
          font-size: 24px;
        }

        .payment-tab-title {
          font-size: 13px;
          font-weight: 700;
          color: #0A1128;
        }

        .payment-tab-desc {
          font-size: 10.5px;
          color: #71717A;
        }

        /* Form Inputs */
        .payment-form-group {
          margin-bottom: 16px;
        }

        .payment-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #0A1128;
          margin-bottom: 6px;
        }

        .payment-input, .payment-select {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #D4D4D8;
          border-radius: 10px;
          font-size: 14px;
          color: #0A1128;
          background: #FFFFFF;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .payment-input:focus, .payment-select:focus {
          outline: none;
          border-color: #C99726;
          box-shadow: 0 0 0 3px rgba(201, 151, 38, 0.18);
        }

        .payment-summary-box {
          background: #FAF8F5;
          border: 1px solid rgba(201, 151, 38, 0.3);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .payment-summary-title {
          font-size: 14px;
          font-weight: 600;
          color: #0A1128;
          margin: 0 0 4px 0;
        }

        .payment-summary-sub {
          font-size: 12px;
          color: #71717A;
          margin: 0;
        }

        .payment-summary-amount {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #C99726;
        }

        .payment-submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #FFFFFF;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
        }

        .payment-submit-btn.mtn {
          background: #EAB308;
          color: #000000;
        }
        .payment-submit-btn.mtn:hover {
          background: #CA8A04;
        }

        .payment-submit-btn.airtel {
          background: #DC2626;
          color: #FFFFFF;
        }
        .payment-submit-btn.airtel:hover {
          background: #B91C1C;
        }

        .payment-submit-btn.bank {
          background: #0A1128;
          color: #FFFFFF;
        }
        .payment-submit-btn.bank:hover {
          background: #1E293B;
        }

        .payment-error-alert {
          background: #FEF2F2;
          border: 1px solid #FCA5A5;
          color: #991B1B;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* USSD Prompt Simulation Screen */
        .ussd-screen {
          text-align: center;
          padding: 16px 8px;
        }

        .ussd-phone-mockup {
          background: #0A1128;
          color: #FFFFFF;
          border-radius: 20px;
          padding: 24px;
          margin: 0 auto 20px auto;
          max-width: 380px;
          border: 4px solid #E5E7EB;
          box-shadow: 0 15px 35px rgba(0,0,0,0.25);
          position: relative;
        }

        .ussd-banner {
          background: rgba(255, 255, 255, 0.1);
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12px;
          color: #FACC15;
          font-weight: 600;
          margin-bottom: 16px;
          display: inline-block;
        }

        .ussd-msg {
          font-size: 14.5px;
          line-height: 1.5;
          color: #F8FAFC;
          margin-bottom: 20px;
        }

        .ussd-msg strong {
          color: #FFCC00;
        }

        .ussd-actions {
          display: flex;
          gap: 10px;
        }

        .ussd-btn-approve {
          flex: 1;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: #22C55E;
          color: #FFFFFF;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
        }

        .ussd-btn-cancel {
          padding: 12px 18px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: transparent;
          color: #E2E8F0;
          font-size: 13px;
          cursor: pointer;
        }

        /* Success Receipt */
        .receipt-card {
          border: 2px dashed #C99726;
          border-radius: 16px;
          padding: 24px;
          background: #FFFDF8;
          margin-bottom: 20px;
        }

        .receipt-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #EFECE6;
          padding-bottom: 16px;
          margin-bottom: 16px;
        }

        .receipt-badge {
          background: #DCFCE7;
          color: #166534;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .receipt-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 13.5px;
          border-bottom: 1px solid rgba(0,0,0,0.04);
        }

        .receipt-label {
          color: #71717A;
        }

        .receipt-val {
          font-weight: 600;
          color: #0A1128;
        }

        .receipt-amount-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0 0 0;
          font-size: 17px;
          font-weight: 800;
          color: #C99726;
        }

        .receipt-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .receipt-btn {
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: 1px solid #D4D4D8;
          background: #FFFFFF;
          color: #0A1128;
        }

        .receipt-btn.primary {
          background: #C99726;
          border-color: #C99726;
          color: #FFFFFF;
        }
      `}</style>

      <div className="payment-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="payment-header">
          <div className="payment-header-left">
            <img src={cwLogo} alt="Code Weave Planet" className="payment-header-logo" />
            <div>
              <h2 className="payment-header-title">Code Weave Payment</h2>
              <p className="payment-header-subtitle">Mobile Money &amp; Bank Transfer</p>
            </div>
          </div>
          <button className="payment-close-btn" onClick={handleClose} type="button">✕</button>
        </div>

        <div className="payment-body">
          {error && (
            <div className="payment-error-alert">
              <Icon icon="mdi:alert-circle" width="18" />
              {error}
            </div>
          )}

          {/* STEP 1: PAYMENT FORM */}
          {step === 'FORM' && (
            <form onSubmit={handleStartPayment}>
              {/* Method Selector */}
              <div className="payment-method-tabs">
                <button
                  type="button"
                  className={`payment-tab-btn mtn ${method === 'MTN' ? 'active' : ''}`}
                  onClick={() => handleMethodChange('MTN')}
                >
                  <Icon icon="mdi:cellphone" width="26" color="#EAB308" />
                  <span className="payment-tab-title">MTN MoMo</span>
                  <span className="payment-tab-desc">Instant Push</span>
                </button>

                <button
                  type="button"
                  className={`payment-tab-btn airtel ${method === 'AIRTEL' ? 'active' : ''}`}
                  onClick={() => handleMethodChange('AIRTEL')}
                >
                  <Icon icon="mdi:signal-cellular-alt" width="26" color="#DC2626" />
                  <span className="payment-tab-title">Airtel Money</span>
                  <span className="payment-tab-desc">Instant Push</span>
                </button>

                <button
                  type="button"
                  className={`payment-tab-btn bank ${method === 'BANK' ? 'active' : ''}`}
                  onClick={() => handleMethodChange('BANK')}
                >
                  <Icon icon="mdi:bank" width="26" color="#0A1128" />
                  <span className="payment-tab-title">Bank Transfer</span>
                  <span className="payment-tab-desc">Stanbic / Centenary</span>
                </button>
              </div>

              {/* Course & Amount Summary */}
              <div className="payment-summary-box">
                <div>
                  <h3 className="payment-summary-title">{courseName}</h3>
                  <p className="payment-summary-sub">Official Tuition &amp; Certification</p>
                </div>
                <div className="payment-summary-amount">{amount}</div>
              </div>

              {/* Common Payer Info */}
              <div className="payment-form-group">
                <label className="payment-label">Student / Payer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Kato"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  className="payment-input"
                />
              </div>

              {/* MTN / Airtel Phone Number */}
              {(method === 'MTN' || method === 'AIRTEL') && (
                <div className="payment-form-group">
                  <label className="payment-label">
                    {method === 'MTN' ? 'MTN Mobile Money Number * (077/078/076)' : 'Airtel Money Number * (070/075/074)'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      required
                      placeholder={method === 'MTN' ? '0770 000 000' : '0750 000 000'}
                      value={payerPhone}
                      onChange={(e) => setPayerPhone(e.target.value)}
                      className="payment-input"
                    />
                    <span style={{ position: 'absolute', right: 12, top: 12, fontSize: '11px', color: '#71717A', fontWeight: 600 }}>
                      UGANDA (+256)
                    </span>
                  </div>
                </div>
              )}

              {/* Bank Account Details Display & Input */}
              {method === 'BANK' && (
                <div>
                  <div className="payment-form-group">
                    <label className="payment-label">Select Code Weave Bank Account *</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="payment-select"
                    >
                      {CWP_BANK_ACCOUNTS.map((b, i) => (
                        <option key={i} value={b.bankName}>
                          {b.bankName} - A/C {b.accountNumber} ({b.branch})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ background: '#F8F9FA', borderRadius: '10px', padding: '14px', marginBottom: '16px', fontSize: '13px', border: '1px solid #E4E4E7' }}>
                    <div style={{ fontWeight: 700, marginBottom: '6px', color: '#0A1128' }}>
                      Official Deposit Account:
                    </div>
                    <div>Account Name: <strong>Code Weave Planet Ltd</strong></div>
                    <div>Bank: <strong>{selectedBank}</strong></div>
                    <div>
                      Account Number:{' '}
                      <strong style={{ color: '#C99726', fontSize: '15px' }}>
                        {CWP_BANK_ACCOUNTS.find(b => b.bankName === selectedBank)?.accountNumber}
                      </strong>
                    </div>
                    <div>Branch: <strong>Mbarara Main Branch</strong></div>
                  </div>

                  <div className="payment-form-group">
                    <label className="payment-label">Bank Deposit Slip / Reference Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. STAN-TX-998231 or Slip No."
                      value={bankRefNumber}
                      onChange={(e) => setBankRefNumber(e.target.value)}
                      className="payment-input"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`payment-submit-btn ${method.toLowerCase()}`}
              >
                <Icon icon={method === 'BANK' ? 'mdi:check-circle' : 'mdi:cellphone-wireless'} width="20" />
                {method === 'MTN' && 'Initiate MTN Mobile Money Prompt'}
                {method === 'AIRTEL' && 'Initiate Airtel Money Prompt'}
                {method === 'BANK' && 'Submit Bank Deposit Confirmation'}
              </button>
            </form>
          )}

          {/* STEP 2: USSD PROMPT SIMULATION */}
          {step === 'PROMPTING' && (
            <div className="ussd-screen">
              <div className="ussd-phone-mockup">
                <span className="ussd-banner">
                  {method === 'MTN' ? 'MTN MoMo *165# PUSH' : 'Airtel Money *185# PUSH'}
                </span>
                
                <p className="ussd-msg">
                  Payment Prompt sent to <strong>{payerPhone}</strong>
                  <br /><br />
                  <strong>Code Weave Planet Ltd</strong> requests payment of <strong>{amount}</strong> for {courseName}.
                  <br /><br />
                  <span style={{ fontSize: '13px', color: '#CBD5E1' }}>
                    {method === 'MTN' ? 'Enter your MTN MoMo PIN to authorize' : 'Enter your Airtel Money PIN to authorize'}
                  </span>
                </p>

                <div className="ussd-actions">
                  <button
                    type="button"
                    onClick={handleApproveUssdPrompt}
                    disabled={loading}
                    className="ussd-btn-approve"
                  >
                    {loading ? 'Authorizing...' : '✓ Enter PIN & Approve'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('FORM')}
                    className="ussd-btn-cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#71717A' }}>
                Check your phone screen for the prompt or dial {method === 'MTN' ? '*165#' : '*185#'} to approve.
              </p>
            </div>
          )}

          {/* STEP 3: SUCCESSFUL RECEIPT */}
          {step === 'SUCCESS' && completedTx && (
            <div>
              <div className="receipt-card">
                <div className="receipt-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={cwLogo} alt="Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '15px', color: '#0A1128' }}>CODE WEAVE PLANET</div>
                      <div style={{ fontSize: '11px', color: '#71717A' }}>Payment Official Receipt</div>
                    </div>
                  </div>
                  <span className="receipt-badge">
                    <Icon icon="mdi:check" width="14" /> PAID &amp; VERIFIED
                  </span>
                </div>

                <div className="receipt-row">
                  <span className="receipt-label">Receipt No.</span>
                  <span className="receipt-val">{completedTx.receiptNumber}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Transaction Ref</span>
                  <span className="receipt-val">{completedTx.id}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Student Name</span>
                  <span className="receipt-val">{completedTx.payerName}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Course</span>
                  <span className="receipt-val">{completedTx.courseName}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Payment Method</span>
                  <span className="receipt-val">
                    {completedTx.method === 'MTN' && '🟡 MTN Mobile Money'}
                    {completedTx.method === 'AIRTEL' && '🔴 Airtel Money'}
                    {completedTx.method === 'BANK' && `🏦 ${completedTx.bankName}`}
                  </span>
                </div>
                {completedTx.payerPhone && (
                  <div className="receipt-row">
                    <span className="receipt-label">Phone Account</span>
                    <span className="receipt-val">{completedTx.payerPhone}</span>
                  </div>
                )}
                {completedTx.bankRefNumber && (
                  <div className="receipt-row">
                    <span className="receipt-label">Bank Ref No.</span>
                    <span className="receipt-val">{completedTx.bankRefNumber}</span>
                  </div>
                )}
                <div className="receipt-row">
                  <span className="receipt-label">Date &amp; Time</span>
                  <span className="receipt-val">{new Date(completedTx.createdAt).toLocaleString()}</span>
                </div>

                <div className="receipt-amount-row">
                  <span>Total Amount Paid</span>
                  <span>{completedTx.amount}</span>
                </div>
              </div>

              <div className="receipt-actions">
                <button type="button" onClick={handlePrint} className="receipt-btn">
                  <Icon icon="mdi:printer" width="18" /> Print Receipt
                </button>
                <button type="button" onClick={handleClose} className="receipt-btn primary">
                  <Icon icon="mdi:check-all" width="18" /> Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
