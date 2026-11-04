import { adminDb } from "@/lib/admin";
import admin from "firebase-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { userId, brand, costPoints } = req.body;

  try {
    const userRef = adminDb.collection("users").doc(userId);
    const result = await adminDb.runTransaction(async (t) => {
      const userDoc = await t.get(userRef);
      if (!userDoc.exists) throw new Error("User record not found");

      const userData = userDoc.data();
      if ((userData.points || 0) < costPoints) throw new Error("Insufficient balance");

      const voucherQuery = await adminDb.collection("vouchers_pool")
        .where("brand", "==", brand)
        .where("is_used", "==", false)
        .limit(1)
        .get();

      if (voucherQuery.empty) throw new Error("OUT_OF_STOCK");

      const voucherDoc = voucherQuery.docs[0];
      const voucherData = voucherDoc.data();

      t.update(userRef, { points: userData.points - costPoints });
      t.update(voucherDoc.ref, {
        is_used: true,
        assigned_to: userId,
        redeemed_at: new Date().toISOString(),
      });

      return voucherData;
    });

    return res.status(200).json({ success: true, voucher: result });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
