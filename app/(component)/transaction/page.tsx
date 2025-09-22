 "use client";

import { useState, useEffect } from "react";
import TransactionsTable from "../transactionhistory"


export default function TransactionsPage() {
  const [balance, setBalance] = useState<number>(0);
  const [transactionType, setTransactionType] = useState<string>("balance");
  const [amount, setAmount] = useState<number>(0);
  const [recipient, setRecipient] = useState<string>("");

   const userId = 1; // Simulated logged-in user ID
      const [refreshKey, setRefreshKey] = useState(0);
  
    // const handleDeposit = async () => {
    //   const res = await fetch("/api/deposit", {
    //     method: "POST",
    //     body: JSON.stringify({ userId, amount: 100 }),
    //     headers: { "Content-Type": "application/json" },
    //   });
  
    //   const data = await res.json();
    //   if (data.success) {
    //     // Trigger refresh of transaction table
    //     setRefreshKey((prev) => prev + 1);
    //   } else {
    //     alert(data.error || "Deposit failed");
    //   }
    // };
  // ✅ Fetch balance on page load
  useEffect(() => {
    async function fetchBalance() {
      try {
        const res = await fetch("/api/transaction/balance");
        const data = await res.json();
        setBalance(data.balance);
      } catch (err) {
        console.error("Error fetching balance", err);
      }
    }
    fetchBalance();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch(`/api/transaction/${transactionType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, recipient }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Transaction failed");
        return;
      }

      alert("Transaction successful!");
      if (data.balance !== undefined) {
        setBalance(data.balance); // update balance after transaction
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }

  return ( <div>
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      {/* ✅ Balance at the top */}
      <h2 className="text-2xl font-bold mb-4 text-center">
        Current Balance: ${balance ? balance.toFixed(2) : "0.00"}
      </h2>

      {/* ✅ Dropdown for transaction type */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Transaction Type</label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="balance">Check Balance</option>
            <option value="deposit">Deposit</option>
            <option value="withdraw">Withdraw</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        {/* ✅ Amount field (only for deposit/withdraw/transfer) */}
        {(transactionType === "deposit" ||
          transactionType === "withdraw" ||
          transactionType === "transfer") && (
          <div>
            <label className="block font-semibold mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        )}

        {/* ✅ Recipient field (only for transfer) */}
        {transactionType === "transfer" && (
          <div>
            <label className="block font-semibold mb-1">Recipient Account</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-center">Transaction History</h3>
          <TransactionsTable key={refreshKey} userId={userId} />
    </div>
    </div>
    </div>

  );
}
