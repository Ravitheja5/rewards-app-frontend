import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { rewardsCatalog } from '../data/rewardsCatalog';

export default function StorePage() {
  const [filter, setFilter] = useState('ALL');
  const [points, setPoints] = useState(750);
  const [selectedReward, setSelectedReward] = useState(null);
  const [msg, setMsg] = useState('');

  const filteredItems = filter === 'ALL'
    ? rewardsCatalog
    : rewardsCatalog.filter(item => item.type === filter || item.category === filter);

  const handleRedeem = (item) => {
    if (points < item.cost) {
      setMsg(`Points సరిపోవు! You need ${item.cost - points} more points.`);
      return;
    }
    setPoints(prev => prev - item.cost);
    setMsg(`🎉 Successful! ${item.title} redeemed successfully.`);
    setSelectedReward(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 pb-24">
      <Head>
        <title>Store & Rewards | RewardRush</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        {/* Header & Balance */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Rewards Hub
            </h1>
            <p className="text-xs text-slate-400">Swiggy, Zomato, Jio & Airtel Vouchers</p>
          </div>
          <div className="bg-slate-900 border border-amber-500/30 px-4 py-2 rounded-xl text-right">
            <span className="text-xs text-slate-400 block">Balance</span>
            <span className="text-lg font-bold text-amber-400">⚡ {points} Pts</span>
          </div>
        </div>

        {msg && (
          <div className="mb-4 p-3 bg-indigo-950/80 border border-indigo-500/50 rounded-xl text-sm text-center">
            {msg}
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {['ALL', 'swiggy', 'zomato', 'jio', 'airtel'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                filter === tab
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{item.image}</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{item.title}</h3>
                  <span className="text-xs text-amber-400 font-semibold">{item.cost} Points</span>
                </div>
              </div>
              <button
                onClick={() => handleRedeem(item)}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-lg hover:opacity-90 transition"
              >
                Claim
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
