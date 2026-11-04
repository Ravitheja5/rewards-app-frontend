import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Wallet, CheckCircle2, AlertCircle, Clock, ShieldCheck, RefreshCw } from 'lucide-react';

const REWARD_CATALOG = [
  // --- JIO DATA PACKS ---
  { id: 'jio_19', type: 'DATA', category: 'JIO', brand: 'Jio', title: 'Jio 1GB Data Pack', amount: 19, points: 190, tag: '₹19 Recharge', icon: '📶', desc: 'Direct recharge to your Jio mobile' },
  { id: 'jio_29', type: 'DATA', category: 'JIO', brand: 'Jio', title: 'Jio 2GB Data Pack', amount: 29, points: 290, tag: '₹29 Recharge', icon: '📶', desc: 'Direct recharge to your Jio mobile' },
  { id: 'jio_69', type: 'DATA', category: 'JIO', brand: 'Jio', title: 'Jio 6GB High-Speed Data', amount: 69, points: 690, tag: '₹69 Recharge', icon: '🚀', desc: 'Direct recharge to your Jio mobile' },

  // --- AIRTEL DATA PACKS ---
  { id: 'airtel_19', type: 'DATA', category: 'AIRTEL', brand: 'Airtel', title: 'Airtel 1GB Data Booster', amount: 19, points: 190, tag: '₹19 Recharge', icon: '📶', desc: 'Direct recharge to your Airtel mobile' },
  { id: 'airtel_29', type: 'DATA', category: 'AIRTEL', brand: 'Airtel', title: 'Airtel 2GB Data Booster', amount: 29, points: 290, tag: '₹29 Recharge', icon: '📶', desc: 'Direct recharge to your Airtel mobile' },
  { id: 'airtel_65', type: 'DATA', category: 'AIRTEL', brand: 'Airtel', title: 'Airtel 4GB Data Booster', amount: 65, points: 650, tag: '₹65 Recharge', icon: '🚀', desc: 'Direct recharge to your Airtel mobile' },

  // --- SWIGGY MONEY VOUCHERS ---
  { id: 'swiggy_mv_50', type: 'MONEY_VOUCHER', category: 'SWIGGY', brand: 'Swiggy', title: '₹50 Swiggy Money Voucher', amount: 50, points: 500, tag: 'Wallet Cash', icon: '💳', desc: 'Direct wallet balance (No min order)' },
  { id: 'swiggy_mv_100', type: 'MONEY_VOUCHER', category: 'SWIGGY', brand: 'Swiggy', title: '₹100 Swiggy Money Voucher', amount: 100, points: 1000, tag: 'Wallet Cash', icon: '💳', desc: 'Direct wallet balance (No min order)' },
  { id: 'swiggy_mv_250', type: 'MONEY_VOUCHER', category: 'SWIGGY', brand: 'Swiggy', title: '₹250 Swiggy Money Voucher', amount: 250, points: 2500, tag: 'Wallet Cash', icon: '💳', desc: 'Direct wallet balance (No min order)' },

  // --- SWIGGY PROMO COUPONS ---
  { id: 'swiggy_cp_40', type: 'COUPON', category: 'SWIGGY', brand: 'Swiggy', title: 'Swiggy ₹40 OFF Promo Code', amount: 40, points: 200, tag: 'Discount Coupon', icon: '🎟️', desc: 'Flat ₹40 OFF on food orders > ₹149' },
  { id: 'swiggy_cp_75', type: 'COUPON', category: 'SWIGGY', brand: 'Swiggy', title: 'Swiggy ₹75 OFF Promo Code', amount: 75, points: 400, tag: 'Discount Coupon', icon: '🎟️', desc: 'Flat ₹75 OFF on food orders > ₹249' },

  // --- ZOMATO MONEY VOUCHERS ---
  { id: 'zomato_mv_50', type: 'MONEY_VOUCHER', category: 'ZOMATO', brand: 'Zomato', title: '₹50 Zomato Gift Voucher', amount: 50, points: 500, tag: 'Wallet Cash', icon: '💳', desc: 'Direct wallet balance (No min order)' },
  { id: 'zomato_mv_100', type: 'MONEY_VOUCHER', category: 'ZOMATO', brand: 'Zomato', title: '₹100 Zomato Gift Voucher', amount: 100, points: 1000, tag: 'Wallet Cash', icon: '💳', desc: 'Direct wallet balance (No min order)' },
  { id: 'zomato_mv_250', type: 'MONEY_VOUCHER', category: 'ZOMATO', brand: 'Zomato', title: '₹250 Zomato Gift Voucher', amount: 250, points: 2500, tag: 'Wallet Cash', icon: '💳', desc: 'Direct wallet balance (No min order)' },

  // --- ZOMATO PROMO COUPONS ---
  { id: 'zomato_cp_40', type: 'COUPON', category: 'ZOMATO', brand: 'Zomato', title: 'Zomato ₹40 OFF Promo Code', amount: 40, points: 200, tag: 'Discount Coupon', icon: '🎟️', desc: 'Flat ₹40 OFF on orders > ₹159' },
  { id: 'zomato_cp_80', type: 'COUPON', category: 'ZOMATO', brand: 'Zomato', title: 'Zomato ₹80 OFF Promo Code', amount: 80, points: 450, tag: 'Discount Coupon', icon: '🎟️', desc: 'Flat ₹80 OFF on orders > ₹299' },
];

export default function RewardStore() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedReward, setSelectedReward] = useState(null);
  const [targetValue, setTargetValue] = useState('');
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchUserData = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/${id}`);
      const data = await res.json();
      setUser(data);
      localStorage.setItem('rewardrush_user', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchHistory = async (id) => {
    setIsSyncing(true);
    try {
      const res = await fetch(`http://localhost:5000/api/redeem/history/${id}`);
      const data = await res.json();
      if (data.success) {
        setHistory(data.history);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem('rewardrush_user');
    if (cached) {
      const parsed = JSON.parse(cached);
      fetchUserData(parsed.id);
      fetchHistory(parsed.id);
      if (parsed.phone) setTargetValue(parsed.phone);

      // 5 Seconds Polling interval - Admin approve cheyagane auto ga reflect avthundi
      const interval = setInterval(() => {
        fetchHistory(parsed.id);
        fetchUserData(parsed.id);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, []);

  const handleClaim = async () => {
    if (!user) {
      setError('Please login first to claim rewards');
      return;
    }
    if (!targetValue.trim()) {
      setError(
        selectedReward.type === 'DATA'
          ? 'Enter your 10-digit mobile number'
          : 'Enter your Mobile Number or Email ID'
      );
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          type: selectedReward.type,
          rewardTitle: selectedReward.title,
          amount: selectedReward.amount,
          pointsCost: selectedReward.points,
          targetValue: targetValue.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setUser(prev => ({ ...prev, points: data.newBalance }));
        setSelectedReward(null);
        fetchHistory(user.id);
      } else {
        setError(data.error || 'Failed to submit reward claim');
      }
    } catch {
      setError('Failed to reach backend server');
    } finally {
      setLoading(false);
    }
  };

  const filteredRewards = activeTab === 'ALL'
    ? REWARD_CATALOG
    : REWARD_CATALOG.filter(r => r.category === activeTab || r.type === activeTab);

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 16px', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Link href="/" style={{ color: '#8f95b2', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={18} /> Back
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#111427', padding: '8px 14px', borderRadius: '12px', border: '1px solid #23284d' }}>
          <Wallet size={16} color="#f59e0b" />
          <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{user ? user.points : 0} PTS</span>
        </div>
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>Redeem Store 🎁</h1>
      <p style={{ color: '#8f95b2', fontSize: '13px', marginBottom: '20px' }}>
        Redeem points for Data Boosters, Food Money Vouchers, or Discount Coupons.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
        {[
          { key: 'ALL', label: 'All Items' },
          { key: 'MONEY_VOUCHER', label: '💳 Money Vouchers' },
          { key: 'COUPON', label: '🎟️ Promo Coupons' },
          { key: 'JIO', label: '📶 Jio Data' },
          { key: 'AIRTEL', label: '📶 Airtel Data' },
          { key: 'SWIGGY', label: '🍔 Swiggy' },
          { key: 'ZOMATO', label: '🍟 Zomato' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: activeTab === tab.key ? '1px solid #f59e0b' : '1px solid #23284d',
              background: activeTab === tab.key ? '#f59e0b' : '#111427',
              color: activeTab === tab.key ? '#000' : '#8f95b2',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {message && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '12px', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <CheckCircle2 size={16} /> {message}
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Rewards Catalog */}
      <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
        {filteredRewards.map(item => {
          const canAfford = user && user.points >= item.points;
          return (
            <div
              key={item.id}
              onClick={() => { setSelectedReward(item); setError(''); setMessage(''); }}
              style={{
                background: selectedReward?.id === item.id ? '#1e2238' : '#111427',
                border: selectedReward?.id === item.id ? '2px solid #f59e0b' : '1px solid #23284d',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: '0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '26px' }}>{item.icon}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '15px' }}>{item.title}</span>
                    <span style={{ 
                      fontSize: '10px', 
                      background: item.type === 'MONEY_VOUCHER' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)', 
                      color: item.type === 'MONEY_VOUCHER' ? '#10b981' : '#60a5fa', 
                      padding: '2px 6px', 
                      borderRadius: '6px', 
                      fontWeight: 'bold' 
                    }}>
                      {item.tag}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#8f95b2', marginTop: '2px' }}>
                    Cost: <strong style={{ color: '#fff' }}>{item.points} Points</strong> &bull; {item.desc}
                  </div>
                </div>
              </div>
              <button
                style={{
                  background: canAfford ? '#f59e0b' : '#23284d',
                  color: canAfford ? '#000' : '#8f95b2',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                  whiteSpace: 'nowrap'
                }}
              >
                {canAfford ? 'Claim' : `${item.points} PTS`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Claim Form Modal */}
      {selectedReward && (
        <div style={{ background: '#111427', border: '1px solid #23284d', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>
            Claim {selectedReward.title}
          </h3>
          <p style={{ fontSize: '12px', color: '#8f95b2', marginBottom: '14px' }}>
            {selectedReward.type === 'DATA'
              ? `Enter your 10-digit ${selectedReward.brand} Prepaid Mobile Number.`
              : `Enter your Mobile Number or Email to receive the ${selectedReward.brand} Code.`}
          </p>

          <input
            type="text"
            placeholder={
              selectedReward.type === 'DATA'
                ? 'Enter 10-digit Mobile Number'
                : 'Enter Mobile Number or Email ID'
            }
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', background: '#0a0b16', border: '1px solid #23284d', borderRadius: '10px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', marginBottom: '14px' }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleClaim}
              disabled={loading}
              style={{ flex: 1, padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
            >
              {loading ? 'Submitting...' : `Confirm & Deduct ${selectedReward.points} PTS`}
            </button>
            <button
              onClick={() => setSelectedReward(null)}
              style={{ padding: '12px 18px', background: '#23284d', color: '#8f95b2', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* History Section With Live Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>
          My Redemptions & Voucher History
        </h3>
        <button
          onClick={() => user && fetchHistory(user.id)}
          style={{ background: 'none', border: 'none', color: '#8f95b2', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <RefreshCw size={12} className={isSyncing ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '13px', background: '#111427', borderRadius: '12px' }}>
          No claimed vouchers yet. Complete tasks to earn points!
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          {history.map(item => (
            <div 
              key={item.id} 
              style={{ 
                background: item.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.05)' : '#111427', 
                border: item.status === 'COMPLETED' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #23284d', 
                borderRadius: '14px', 
                padding: '14px' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>{item.rewardTitle}</div>
                  <div style={{ fontSize: '12px', color: '#8f95b2', marginTop: '2px' }}>
                    Target: <span style={{ color: '#fff' }}>{item.targetValue}</span> &bull; Ref: {item.id}
                  </div>
                </div>
                <div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: item.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' : item.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: item.status === 'COMPLETED' ? '#10b981' : item.status === 'REJECTED' ? '#ef4444' : '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {item.status === 'COMPLETED' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Remarks/Code display if approved by Admin */}
              {item.remarks && (
                <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px dashed #10b981', borderRadius: '8px', fontSize: '12px', color: '#10b981' }}>
                  <strong>Code / Recharge Details:</strong> {item.remarks}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
