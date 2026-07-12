import {
  ref,
  get,
  set,
  push,
  update,
  onValue,
} from 'firebase/database';
import { database } from './config';
import type { Offer, Transaction, BrandingConfig, AppNotification, PersonalDetails, AddressDetails, PayoutAccounts } from '../types';
import { generateReferralCode } from '../utils';

export async function loadOffers(): Promise<Offer[]> {
  const offersSnap = await get(ref(database, 'offers'));
  if (offersSnap.exists()) {
    const offersData = offersSnap.val();
    return Object.keys(offersData).map((key) => ({ id: key, ...offersData[key] }));
  }
  // Seed default offers
  const defaultOffers: Omit<Offer, 'id'>[] = [];
  for (let i = 1; i <= 25; i++) {
    defaultOffers.push({
      title: `Watch Ad #${i}`,
      description: 'Earn 1 spin by watching this ad',
      rewardSpins: 1,
    });
  }
  for (const offer of defaultOffers) {
    const newRef = push(ref(database, 'offers'));
    await set(newRef, offer);
  }
  return loadOffers();
}

export async function loadTransactions(uid: string): Promise<Transaction[]> {
  const txSnap = await get(ref(database, 'transactions'));
  if (!txSnap.exists()) return [];
  const allTx = txSnap.val();
  const userTx = Object.keys(allTx)
    .filter((key) => allTx[key].uid === uid)
    .map((key) => ({ id: key, ...allTx[key] })) as Transaction[];
  userTx.sort((a, b) => b.timestamp - a.timestamp);
  return userTx;
}

export async function createNewUser(
  uid: string,
  email: string,
  displayName: string | null,
  photoURL: string | null,
  referralCodeInput: string
) {
  const newCode = generateReferralCode();
  const newUserData: Record<string, unknown> = {
    personalDetails: {
      fullName: displayName || 'Member Node',
      email,
      phone: '',
      avatarUrl: photoURL || '',
    },
    addressDetails: { line: '', state: '' },
    payoutDetails: { upiId: '', redeemEmail: '' },
    balance: 0,
    referralCode: newCode,
    referredBy: '',
    referrals: [],
    referralEarnings: 0,
    spinsRemaining: 0,
    offersCompleted: 0,
    lastClaimedDay: 0,
    lastClaimTimestamp: 0,
    lastOfferTimestamp: 0,
    createdAt: Date.now(),
  };

  if (referralCodeInput) {
    const usersSnap = await get(ref(database, 'users'));
    const users = usersSnap.val() as Record<string, Record<string, unknown>>;
    let referrerUid: string | null = null;
    for (const id in users) {
      if (users[id].referralCode === referralCodeInput.toUpperCase()) {
        referrerUid = id;
        break;
      }
    }
    if (referrerUid) {
      const referrerRef = ref(database, 'users/' + referrerUid);
      const referrerSnap = await get(referrerRef);
      const referrerData = referrerSnap.val() as Record<string, unknown>;
      if (referrerData) {
        const newBalance = ((referrerData.balance as number) || 0) + 1;
        const newEarnings = ((referrerData.referralEarnings as number) || 0) + 1;
        const referrals = ((referrerData.referrals as string[]) || []).concat(uid);
        await update(referrerRef, { balance: newBalance, referralEarnings: newEarnings, referrals });
        const txRef = push(ref(database, 'transactions'));
        await set(txRef, {
          uid: referrerUid,
          amount: 1,
          type: 'REFERRAL',
          description: `Referral bonus for ${email}`,
          timestamp: Date.now(),
          status: 'SUCCESS',
        });
      }
      newUserData.referredBy = referrerUid;
    }
  }

  await set(ref(database, 'users/' + uid), newUserData);
  return { newCode, newUserData };
}

export async function triggerWithdrawalDb(
  uid: string,
  walletBalance: number,
  amount: number,
  withdrawalMethod: string
): Promise<number> {
  const userRef = ref(database, 'users/' + uid);
  const newBalance = walletBalance - amount;
  await update(userRef, { balance: newBalance });
  const txRef = push(ref(database, 'transactions'));
  await set(txRef, {
    uid,
    amount: -amount,
    type: 'WITHDRAWAL',
    description: `Withdrawal via ${withdrawalMethod}`,
    timestamp: Date.now(),
    status: 'PENDING',
  });
  return newBalance;
}

export async function completeOfferDb(uid: string, offerId: string, currentData: Record<string, unknown>) {
  const now = Date.now();
  const newSpins = ((currentData.spinsRemaining as number) || 0) + 1;
  const newOffersCompleted = ((currentData.offersCompleted as number) || 0) + 1;
  const userRef = ref(database, 'users/' + uid);
  await update(userRef, {
    spinsRemaining: newSpins,
    offersCompleted: newOffersCompleted,
    lastOfferTimestamp: now,
  });
  const txRef = push(ref(database, 'transactions'));
  await set(txRef, {
    uid,
    amount: 0,
    type: 'OFFER_COMPLETE',
    description: `Completed offer: ${offerId}`,
    timestamp: now,
    status: 'SUCCESS',
  });
  return { newSpins, newOffersCompleted, now };
}

export async function creditSpinDb(uid: string, walletBalance: number, amount: number): Promise<number> {
  const userRef = ref(database, 'users/' + uid);
  const newBalance = (walletBalance || 0) + amount;
  await update(userRef, { balance: newBalance });
  const txRef = push(ref(database, 'transactions'));
  await set(txRef, {
    uid,
    amount,
    type: 'SPIN_REWARD',
    description: `Spin wheel reward - ${amount}`,
    timestamp: Date.now(),
    status: 'SUCCESS',
  });
  return newBalance;
}

export async function updateSpinsDb(uid: string, delta: number) {
  const userRef = ref(database, 'users/' + uid);
  const snap = await get(userRef);
  const data = snap.val() as Record<string, unknown>;
  const newSpins = ((data.spinsRemaining as number) || 0) + delta;
  await update(userRef, { spinsRemaining: newSpins });
}

export async function claimDailyRewardDb(
  uid: string,
  walletBalance: number,
  dayNum: number,
  rewardAmt: number
) {
  const now = Date.now();
  const userRef = ref(database, 'users/' + uid);
  const newBalance = walletBalance + rewardAmt;
  await update(userRef, { balance: newBalance, lastClaimedDay: dayNum, lastClaimTimestamp: now });
  const txRef = push(ref(database, 'transactions'));
  await set(txRef, {
    uid,
    amount: rewardAmt,
    type: 'DAILY_CHECKIN',
    description: `Daily Check-In Reward Day ${dayNum}`,
    timestamp: now,
    status: 'SUCCESS',
  });
  return { newBalance, now };
}

export async function saveProfileDb(
  uid: string,
  type: 'PERSONAL' | 'ADDRESS' | 'PAYOUT',
  personalDetails: PersonalDetails,
  payload: Record<string, unknown>
) {
  const updatePath: Record<string, unknown> = {};
  if (type === 'PERSONAL') {
    const p = payload as { fullName: string; phone: string; avatarUrl: string; email: string };
    updatePath.personalDetails = { ...personalDetails, fullName: p.fullName, phone: p.phone, avatarUrl: p.avatarUrl };
  }
  if (type === 'ADDRESS') {
    updatePath.addressDetails = payload;
  }
  if (type === 'PAYOUT') {
    const p = payload as { fullName: string; phone: string; payout: PayoutAccounts };
    updatePath.payoutDetails = p.payout;
    updatePath.personalDetails = { ...personalDetails, fullName: p.fullName, phone: p.phone };
  }
  await update(ref(database, 'users/' + uid), updatePath);
}

export function subscribeToBranding(cb: (data: BrandingConfig) => void) {
  return onValue(ref(database, 'branding'), (snap) => {
    const data = snap.val() || {};
    cb(data);
  });
}

export function subscribeToNotifications(cb: (data: AppNotification[]) => void) {
  return onValue(ref(database, 'notifications'), (snap) => {
    const data = snap.val();
    if (data) {
      const list = Object.keys(data).map((k) => ({ id: k, ...data[k] })) as AppNotification[];
      list.sort((a, b) => b.createdAt - a.createdAt);
      cb(list);
    } else {
      cb([]);
    }
  });
}

export async function getUserData(uid: string) {
  const snap = await get(ref(database, 'users/' + uid));
  return snap.exists() ? snap.val() : null;
}
