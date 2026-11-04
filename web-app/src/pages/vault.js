import React, { useState, useEffect } from 'react';
import AppBar from '../components/common/AppBar';
import BottomTabs from '../components/common/BottomTabs';
import VaultCard from '../components/vault/VaultCard';
import { api } from '../lib/api';

export default function Vault() {
  const [vaultItems, setVaultItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.getUser().then(setUser);
    api.getVault().then(setVaultItems);
  }, []);

  return (
    <div>
      <AppBar points={user ? user.points : 0} />

      <main style={{ padding: '16px 16px 85px 16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '900', color: '#F5F7FF', margin: 0 }}>Encrypted Vault</h2>
        <p style={{ fontSize: '11px', color: '#6B7490', margin: '2px 0 14px 0' }}>Digital vouchers & mobile data pack records</p>

        <div style={{ padding: '10px 12px', borderRadius: '12px', backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)', marginBottom: '16px', fontSize: '11px', color: '#22C55E' }}>
          🛡️ Codes are stored encrypted and only accessible on your authenticated device.
        </div>

        {vaultItems.map((item) => (
          <VaultCard key={item.id} item={item} />
        ))}
      </main>

      <BottomTabs />
    </div>
  );
}
