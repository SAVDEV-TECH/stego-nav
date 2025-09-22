"use client";

import { useEffect, useState } from "react";

type Transaction = {
  id: number;
  type: string;
  amount: number;
  balance: number;
  createdAt: string;
};

export default function TransactionsTable({ userId }: { userId: number }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchTransactions = async () => {
      try {
        const res = await fetch(`/api/transaction?userId=${userId}`);
        const data = await res.json();

        if (data.error) {
          console.error(data.error);
          return;
        }

        setTransactions(data.transactions);
      } catch (err) {
        console.error("Failed to load transactions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div className="transactions">
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      <table className="min-w-full border border-gray-300 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Balance After</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="p-2 border">{tx.id}</td>
                <td className="p-2 border">{tx.type}</td>
                <td className="p-2 border">${tx.amount.toFixed(2)}</td>
                <td className="p-2 border">${tx.balance.toFixed(2)}</td>
                <td className="p-2 border">
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-2 border text-center" colSpan={5}>
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
