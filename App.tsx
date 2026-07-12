import React, { useState, useRef, useEffect } from 'react';

// Firebase
import { onAuthStateChanged } from './firebase/auth';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  logout,
} from './firebase/auth';
import { auth } from './firebase/config';
import {
  loadOffers,
  loadTransactions,
  createNewUser,
  triggerWithdrawalDb,
  completeOfferDb,
  creditSpinDb,
  updateSpinsDb,
  claimDailyRewardDb,
  saveProfileDb,
  subscribeToBranding,
  subscribeToNotifications,
  getUserData,
} from './firebase/database';

// Types
import type {
  BrandingConfig,
  PersonalDetails,
  AddressDetails,
  PayoutAccounts,
  Transaction,
  Offer,
  AppNotification,
} from './types';

// Components
import BottomTabItem from './components/BottomTabItem';
import AnimationOverlay from './components/AnimationOverlay';
import ShareModal from './components/modals/ShareModal';
import WithdrawModal from './components/modals/WithdrawModal';
import TermsModal from './components/modals/TermsModal';

// Screens
import AuthScreen from './screens/AuthScreen';
import DailyCheckInView from './screens/DailyCheckInView';
import OffersTab from './screens/OffersTab';
import TransactionsTab from './screens/TransactionsTab';
import SarvesTab from './screens/SarvesTab';
import SupportTab from './screens/SupportTab';
import ProfileTab from './screens/ProfileTab';
import PersonalDetailsView from './screens/PersonalDetailsView';
import AddressDetailsView from './screens/AddressDetailsView';
import PayoutDetailsView from './screens/PayoutDetailsView';

type Screen = 'AUTH' | 'DASHBOARD';
type TabId = 'CAMPAIGNS' | 'TASKS' | 'OFFERS' | 'TRANSACTIONS' | 'SUPPORT' | 'PROFILE' | 'SARVES';
type ProfileSubView = 'PERSONAL' | 'ADDRESS' | 'PAYOUT' | null;
type AnimationState = 'PROCESSING' | 'SUCCESS' | 'SAVE_SUCCESS' | 'LOGIN_SUCCESS' | null;

const DEFAULT_BRANDING: BrandingConfig = {
  appName: 'Reward Rush',
  primaryColor: '#0f172a',
  accentColor: '#fbbf24',
  logoUrl: '',
  supportEmail: '',
};

const DEFAULT_PERSONAL: PersonalDetails = { fullName: '', email: '', phone: '', avatarUrl: '' };
const DEFAULT_ADDRESS: AddressDetails = { line: '', state: '' };
const DEFAULT_PAYOUT: PayoutAccounts = { upiId: '', redeemEmail: '' };

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('AUTH');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('TASKS');
  const [profileSubView, setProfileSubView] = useState<ProfileSubView>(null);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [animationState, setAnimationState] = useState<AnimationState>(null);

  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [withdrawalMethod, setWithdrawalMethod] = useState('UPI');
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [referralCodeInput, setReferralCodeInput] = useState('');

  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(DEFAULT_PERSONAL);
  const [addressDetails, setAddressDetails] = useState<AddressDetails>(DEFAULT_ADDRESS);
  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccounts>(DEFAULT_PAYOUT);

  const [referralCode, setReferralCode] = useState('');
  const [referralsCount, setReferralsCount] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [spinsRemaining, setSpinsRemaining] = useState(0);
  const [wheelResult, setWheelResult] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [offersCompletedCount, setOffersCompletedCount] = useState(0);
  const [lastClaimedDay, setLastClaimedDay] = useState(0);
  const [lastClaimTimestamp, setLastClaimTimestamp] = useState(0);
  const [lastOfferTimestamp, setLastOfferTimestamp] = useState(0);

  const [userId, setUserId] = useState<string | null>(null);
  const [branding, setBranding] = useState<BrandingConfig>(DEFAULT_BRANDING);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const wheelRef = useRef<HTMLDivElement>(null);

  // ---------- Firebase init ----------
  useEffect(() => {
    const unsubBranding = subscribeToBranding(setBranding);
    const unsubNotifs = subscribeToNotifications(setNotifications);

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const dbData = await getUserData(user.uid) as Record<string, unknown> | null;
        if (dbData) {
          if (dbData.personalDetails) setPersonalDetails(dbData.personalDetails as PersonalDetails);
          if (dbData.addressDetails) setAddressDetails(dbData.addressDetails as AddressDetails);
          if (dbData.payoutDetails) setPayoutAccounts(dbData.payoutDetails as PayoutAccounts);
          if (dbData.balance !== undefined) setWalletBalance(dbData.balance as number);
          if (dbData.referralCode) setReferralCode(dbData.referralCode as string);
          if (dbData.referrals) setReferralsCount(((dbData.referrals as unknown[]) || []).length);
          if (dbData.referralEarnings) setReferralEarnings(dbData.referralEarnings as number);
          if (dbData.spinsRemaining !== undefined) setSpinsRemaining(dbData.spinsRemaining as number);
          if (dbData.offersCompleted !== undefined) setOffersCompletedCount(dbData.offersCompleted as number);
          if (dbData.lastClaimedDay !== undefined) setLastClaimedDay(dbData.lastClaimedDay as number);
          if (dbData.lastClaimTimestamp !== undefined) setLastClaimTimestamp(dbData.lastClaimTimestamp as number);
          if (dbData.lastOfferTimestamp !== undefined) setLastOfferTimestamp(dbData.lastOfferTimestamp as number);
          loadOffers().then(setOffers).catch(console.error);
          loadTransactions(user.uid).then(setTransactions).catch(console.error);
        } else {
          try {
            const { newCode, newUserData } = await createNewUser(
              user.uid,
              user.email || authEmail,
              user.displayName,
              user.photoURL,
              referralCodeInput
            );
            const pd = newUserData.personalDetails as PersonalDetails;
            setPersonalDetails(pd);
            setAddressDetails(newUserData.addressDetails as AddressDetails);
            setPayoutAccounts(newUserData.payoutDetails as PayoutAccounts);
            setWalletBalance(0);
            setReferralCode(newCode);
            setReferralsCount(0);
            setReferralEarnings(0);
            setSpinsRemaining(0);
            setOffersCompletedCount(0);
            setLastClaimedDay(0);
            setLastClaimTimestamp(0);
            setLastOfferTimestamp(0);
            loadOffers().then(setOffers).catch(console.error);
            loadTransactions(user.uid).then(setTransactions).catch(console.error);
          } catch (err) {
            console.error(err);
          }
        }
        setCurrentScreen('DASHBOARD');
      } else {
        setCurrentScreen('AUTH');
        setUserId(null);
      }
    });

    return () => {
      unsubBranding();
      unsubNotifs();
      unsubAuth();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const closeDropdown = () => setShowNotificationDropdown(false);
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, []);

  // ---------- Auth handlers ----------
  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;
    try {
      if (isRegisterMode) {
        await signUpWithEmail(authEmail, authPassword);
      } else {
        await signInWithEmail(authEmail, authPassword);
      }
      setAnimationState('LOGIN_SUCCESS');
      setTimeout(() => setAnimationState(null), 1500);
    } catch (error: unknown) {
      alert((error as Error).message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setAnimationState('LOGIN_SUCCESS');
      setTimeout(() => setAnimationState(null), 1500);
    } catch (error: unknown) {
      alert('Google Sign-In Failed: ' + (error as Error).message);
    }
  };

  const logoutUser = async () => {
    await logout();
    setCurrentScreen('AUTH');
    setProfileSubView(null);
  };

  // ---------- Navigation ----------
  const navigateToProfileSub = (view: 'PERSONAL' | 'ADDRESS' | 'PAYOUT') => {
    setProfileSubView(view);
    setActiveTab('PROFILE');
  };

  // ---------- Withdrawal ----------
  const verifyAndOpenWithdrawal = () => {
    if (
      !personalDetails.fullName?.trim() ||
      !payoutAccounts.upiId?.trim() ||
      !personalDetails.phone?.trim()
    ) {
      alert('Please complete your payment details before withdrawing.');
      navigateToProfileSub('PAYOUT');
      return;
    }
    setShowWithdrawModal(true);
  };

  const triggerWithdrawal = async () => {
    if (!selectedAmount) return;
    const amtNumber = parseFloat(selectedAmount);
    if (walletBalance < amtNumber) { alert('Insufficient balance!'); return; }
    if (!personalDetails.fullName?.trim() || !payoutAccounts.upiId?.trim()) {
      alert('Please complete your payment details before withdrawing.');
      setShowWithdrawModal(false);
      navigateToProfileSub('PAYOUT');
      return;
    }
    setShowWithdrawModal(false);
    setAnimationState('PROCESSING');
    try {
      const user = auth.currentUser;
      if (user) {
        const newBalance = await triggerWithdrawalDb(user.uid, walletBalance, amtNumber, withdrawalMethod);
        setWalletBalance(newBalance);
        loadTransactions(user.uid).then(setTransactions).catch(console.error);
        setAnimationState('SUCCESS');
        setTimeout(() => setAnimationState(null), 2000);
      }
    } catch (err: unknown) {
      alert('Withdrawal error: ' + (err as Error).message);
      setAnimationState(null);
    }
  };

  // ---------- Offers ----------
  const completeOffer = async (offerId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const dbData = await getUserData(user.uid) as Record<string, unknown>;
      const { newSpins, newOffersCompleted, now } = await completeOfferDb(user.uid, offerId, dbData);
      setSpinsRemaining(newSpins);
      setOffersCompletedCount(newOffersCompleted);
      setLastOfferTimestamp(now);
      loadTransactions(user.uid).then(setTransactions).catch(console.error);
      alert('Offer completed! You earned 1 spin.');
    } catch (err: unknown) {
      alert('Error completing offer: ' + (err as Error).message);
    }
  };

  // ---------- Spin wheel ----------
  const spinWheel = () => {
    if (isSpinning) return;
    if (spinsRemaining <= 0) { alert('No spins left. Complete an offer.'); return; }
    setIsSpinning(true);

    const securePrizes = [1, 2, 3];
    const result = securePrizes[Math.floor(Math.random() * securePrizes.length)];
    const targetIndex = result - 1;
    const segmentAngle = 36;
    const targetDegrees = 360 - (targetIndex * segmentAngle + segmentAngle / 2);
    const totalRotation = 5 * 360 + targetDegrees;

    const wheel = wheelRef.current;
    if (wheel) {
      wheel.style.transition = 'none';
      wheel.style.transform = 'rotate(0deg)';
      void wheel.offsetHeight;
      wheel.style.transition = 'transform 4s cubic-bezier(0.15, 0.75, 0.2, 1)';
      wheel.style.transform = `rotate(${totalRotation}deg)`;
    }

    setTimeout(async () => {
      setWheelResult(result);
      setIsSpinning(false);
      setSpinsRemaining((prev) => prev - 1);
      try {
        const user = auth.currentUser;
        if (user) {
          const newBal = await creditSpinDb(user.uid, walletBalance, result);
          setWalletBalance(newBal);
          await updateSpinsDb(user.uid, -1);
          loadTransactions(user.uid).then(setTransactions).catch(console.error);
        }
      } catch (err: unknown) {
        alert('Error crediting spin reward: ' + (err as Error).message);
      }
    }, 4200);
  };

  // ---------- Daily check-in ----------
  const handleClaimDailyReward = async (dayNum: number, rewardAmt: number) => {
    const now = Date.now();
    const dynamicWindowLimit = 24 * 60 * 60 * 1000;

    if (now - lastOfferTimestamp > dynamicWindowLimit || offersCompletedCount <= 0) {
      alert("Complete at least one offer to unlock today's reward.");
      return;
    }
    if (lastClaimTimestamp > 0 && now - lastClaimTimestamp < dynamicWindowLimit) {
      const remaining = dynamicWindowLimit - (now - lastClaimTimestamp);
      const hours = Math.floor(remaining / (3600 * 1000));
      const minutes = Math.floor((remaining % (3600 * 1000)) / (60 * 1000));
      alert(`Next claim available in ${hours}h ${minutes}m.`);
      return;
    }
    if (dayNum !== (lastClaimedDay % 7) + 1) {
      alert(`Please claim Day ${(lastClaimedDay % 7) + 1} sequentially!`);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) return;
      const { newBalance, now: ts } = await claimDailyRewardDb(user.uid, walletBalance, dayNum, rewardAmt);
      setWalletBalance(newBalance);
      setLastClaimedDay(dayNum);
      setLastClaimTimestamp(ts);
      loadTransactions(user.uid).then(setTransactions).catch(console.error);
      alert(`Successfully claimed ₹${rewardAmt} for Day ${dayNum}!`);
    } catch (err: unknown) {
      alert('Error claiming reward: ' + (err as Error).message);
    }
  };

  // ---------- Profile save ----------
  const saveProfileDataNode = async (
    type: 'PERSONAL' | 'ADDRESS' | 'PAYOUT',
    updatedPayload: Record<string, unknown>
  ) => {
    try {
      if (auth.currentUser) {
        await saveProfileDb(auth.currentUser.uid, type, personalDetails, updatedPayload);
        if (type === 'PERSONAL') {
          const p = updatedPayload as { fullName: string; phone: string; avatarUrl: string; email: string };
          setPersonalDetails((prev) => ({ ...prev, fullName: p.fullName, phone: p.phone, avatarUrl: p.avatarUrl }));
        }
        if (type === 'ADDRESS') setAddressDetails(updatedPayload as AddressDetails);
        if (type === 'PAYOUT') {
          const p = updatedPayload as { fullName: string; phone: string; payout: PayoutAccounts };
          setPayoutAccounts(p.payout);
          setPersonalDetails((prev) => ({ ...prev, fullName: p.fullName, phone: p.phone }));
        }
        setAnimationState('SAVE_SUCCESS');
        setTimeout(() => { setAnimationState(null); setProfileSubView(null); }, 1200);
      }
    } catch (err: unknown) {
      alert('Sync Error: ' + (err as Error).message);
    }
  };

  // ---------- Share ----------
  const shareOnPlatform = (platform: string) => {
    const message = `Join Reward Rush using my referral code: ${referralCode} and get ₹1 bonus! Download the app now.`;
    const encoded = encodeURIComponent(message);
    let url = '';
    switch (platform) {
      case 'whatsapp': url = `https://wa.me/?text=${encoded}`; break;
      case 'telegram': url = `https://t.me/share/url?url=${encodeURIComponent('https://rewardrush.com')}&text=${encoded}`; break;
      case 'gmail': url = `mailto:?subject=${encodeURIComponent('Join Reward Rush')}&body=${encoded}`; break;
      case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?quote=${encoded}`; break;
      case 'twitter': url = `https://twitter.com/intent/tweet?text=${encoded}`; break;
      case 'copy':
        navigator.clipboard.writeText(message).then(() => alert('Copied!')).catch(() => alert('Copy: ' + message));
        setShowShareModal(false);
        return;
      default: return;
    }
    if (url) { window.open(url, '_blank'); setShowShareModal(false); }
  };

  // ---------- Render ----------
  if (currentScreen === 'AUTH' && animationState !== 'LOGIN_SUCCESS') {
    return (
      <AuthScreen
        branding={branding}
        isRegisterMode={isRegisterMode}
        authEmail={authEmail}
        authPassword={authPassword}
        referralCodeInput={referralCodeInput}
        personalDetails={personalDetails}
        onToggleMode={() => setIsRegisterMode(!isRegisterMode)}
        onEmailChange={setAuthEmail}
        onPasswordChange={setAuthPassword}
        onReferralChange={setReferralCodeInput}
        onNameChange={(v) => setPersonalDetails((prev) => ({ ...prev, fullName: v }))}
        onSubmit={handleAuthAction}
        onGoogleSignIn={handleGoogleSignIn}
      />
    );
  }

  const tabTitle: Record<TabId, string> = {
    CAMPAIGNS: 'Daily Rewards',
    TASKS: 'Tasks',
    OFFERS: 'Offers & Spin',
    TRANSACTIONS: 'History Log',
    SUPPORT: 'AI Support Desk',
    PROFILE: 'Profile',
    SARVES: 'Surveys',
  };

  return (
    <div className="mx-auto max-w-md min-h-screen bg-brand-black flex flex-col relative border-x border-neutral-900 pb-24">
      {/* Header */}
      {profileSubView === null && animationState === null && (
        <div className="flex justify-between items-center px-4 py-4 bg-brand-black sticky top-0 z-40">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('CAMPAIGNS')}
              className={`p-1 bg-neutral-900 rounded-full border border-white/5 flex items-center justify-center transition ${
                activeTab === 'CAMPAIGNS' ? 'text-brand-orange' : 'text-neutral-400'
              }`}
            >
              <span className="material-symbols-rounded text-xl">calendar_month</span>
            </button>
            <h1
              className="text-2xl font-bold tracking-tight text-white"
              style={{ color: branding.primaryColor }}
            >
              {tabTitle[activeTab]}
            </h1>
          </div>

          <div className="flex items-center space-x-2 relative">
            <button
              onClick={() => setActiveTab('SUPPORT')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-neutral-900 border border-white/5 text-xs text-neutral-300 font-medium"
            >
              <span className="material-symbols-rounded text-sm" style={{ color: branding.accentColor }}>
                smart_toy
              </span>
              <span>AI Desk</span>
            </button>

            <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setShowNotificationDropdown(!showNotificationDropdown);
                  setHasUnreadNotifications(false);
                }}
                className="relative p-2 bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-neutral-300 rounded-full transition focus:outline-none flex items-center justify-center"
              >
                <span className="material-symbols-rounded text-xl">notifications</span>
                {hasUnreadNotifications && notifications.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                )}
              </button>

              {showNotificationDropdown && (
                <div className="absolute right-0 mt-3 w-72 bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-white/10 flex justify-between items-center bg-neutral-900/50">
                    <h3 className="font-bold text-xs text-white">Notifications Log</h3>
                    <button
                      onClick={(e) => { e.stopPropagation(); setNotifications([]); }}
                      className="text-[10px] text-neutral-500 hover:text-red-400 font-bold transition"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2 space-y-2 bg-black/40">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-neutral-600 text-[11px] font-medium">
                        No active notifications available.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-3 bg-neutral-900 rounded-xl border border-white/5 space-y-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-white text-[11px] truncate max-w-[150px]">{n.title}</h4>
                            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                              n.type === 'alert' ? 'bg-red-950 text-red-400'
                              : n.type === 'warning' ? 'bg-amber-950 text-amber-400'
                              : n.type === 'success' ? 'bg-emerald-950 text-emerald-400'
                              : 'bg-blue-950 text-blue-400'
                            }`}>{n.type}</span>
                          </div>
                          <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">{n.message}</p>
                          <span className="text-[8px] text-neutral-600 block pt-1 font-mono">
                            {new Date(n.createdAt).toLocaleString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 px-4 overflow-y-auto">
        {animationState !== null ? (
          <AnimationOverlay
            animationState={animationState}
            onReturn={() => setAnimationState(null)}
          />
        ) : activeTab === 'PROFILE' && profileSubView !== null ? (
          <div>
            {profileSubView === 'PERSONAL' && (
              <PersonalDetailsView
                data={personalDetails}
                onSave={(updated) => saveProfileDataNode('PERSONAL', updated as unknown as Record<string, unknown>)}
                onBack={() => setProfileSubView(null)}
              />
            )}
            {profileSubView === 'ADDRESS' && (
              <AddressDetailsView
                data={addressDetails}
                onSave={(updated) => saveProfileDataNode('ADDRESS', updated as unknown as Record<string, unknown>)}
                onBack={() => setProfileSubView(null)}
              />
            )}
            {profileSubView === 'PAYOUT' && (
              <PayoutDetailsView
                data={{ payout: payoutAccounts, name: personalDetails.fullName, phone: personalDetails.phone, email: personalDetails.email }}
                onSave={(updated) => saveProfileDataNode('PAYOUT', updated as unknown as Record<string, unknown>)}
                onBack={() => setProfileSubView(null)}
              />
            )}
          </div>
        ) : (
          <div className="h-full">
            {activeTab === 'CAMPAIGNS' && (
              <DailyCheckInView
                lastClaimedDay={lastClaimedDay}
                lastClaimTimestamp={lastClaimTimestamp}
                offersCompletedCount={offersCompletedCount}
                lastOfferTimestamp={lastOfferTimestamp}
                onClaim={handleClaimDailyReward}
              />
            )}
            {activeTab === 'TASKS' && (
              <div className="py-4 text-center">
                <span className="material-symbols-rounded text-6xl text-neutral-600">task_alt</span>
                <h3 className="text-xl font-bold text-white mt-4">Tasks Section</h3>
                <p className="text-xs text-brand-grayMuted mt-2">
                  Your allocated workflow tasks will be populated here.
                </p>
              </div>
            )}
            {activeTab === 'OFFERS' && (
              <OffersTab
                offers={offers}
                onCompleteOffer={completeOffer}
                spinsRemaining={spinsRemaining}
                onSpin={spinWheel}
                isSpinning={isSpinning}
                wheelRef={wheelRef}
                wheelResult={wheelResult}
                accentColor={branding.accentColor}
              />
            )}
            {activeTab === 'TRANSACTIONS' && (
              <TransactionsTab
                balance={walletBalance}
                transactionList={transactions}
                onWithdrawClick={verifyAndOpenWithdrawal}
                onRefreshClick={() => {
                  if (auth.currentUser) loadTransactions(auth.currentUser.uid).then(setTransactions);
                }}
                accentColor={branding.accentColor}
              />
            )}
            {activeTab === 'SUPPORT' && (
              <SupportTab
                payoutInfo={payoutAccounts}
                onOpenTerms={() => setShowTermsModal(true)}
                accentColor={branding.accentColor}
              />
            )}
            {activeTab === 'SARVES' && <SarvesTab userId={userId} />}
            {activeTab === 'PROFILE' && (
              <ProfileTab
                userData={personalDetails}
                referralCode={referralCode}
                referralsCount={referralsCount}
                referralEarnings={referralEarnings}
                onShare={() => setShowShareModal(true)}
                onNavigate={navigateToProfileSub}
                onOpenTerms={() => setShowTermsModal(true)}
                onLogout={logoutUser}
                accentColor={branding.accentColor}
              />
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showShareModal && (
        <ShareModal
          referralCode={referralCode}
          onClose={() => setShowShareModal(false)}
          onShare={shareOnPlatform}
        />
      )}
      {showWithdrawModal && animationState === null && (
        <WithdrawModal
          walletBalance={walletBalance}
          withdrawalMethod={withdrawalMethod}
          selectedAmount={selectedAmount}
          payoutAccounts={payoutAccounts}
          accentColor={branding.accentColor}
          primaryColor={branding.primaryColor}
          onClose={() => setShowWithdrawModal(false)}
          onSetMethod={setWithdrawalMethod}
          onSetAmount={setSelectedAmount}
          onProceed={triggerWithdrawal}
        />
      )}
      {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}

      {/* Bottom tab bar */}
      {animationState === null && (
        <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-md glass-panel flex justify-around items-center py-3 z-40">
          <BottomTabItem
            icon="task_alt"
            label="Tasks"
            active={activeTab === 'TASKS' && profileSubView === null}
            onClick={() => { setActiveTab('TASKS'); setProfileSubView(null); }}
          />
          <BottomTabItem
            icon="casino"
            label="Offers"
            active={activeTab === 'OFFERS' && profileSubView === null}
            onClick={() => { setActiveTab('OFFERS'); setProfileSubView(null); }}
          />
          <BottomTabItem
            icon="history"
            label="Logs"
            active={activeTab === 'TRANSACTIONS' && profileSubView === null}
            onClick={() => { setActiveTab('TRANSACTIONS'); setProfileSubView(null); }}
          />
          <BottomTabItem
            icon="assignment"
            label="Sarves"
            active={activeTab === 'SARVES' && profileSubView === null}
            onClick={() => { setActiveTab('SARVES'); setProfileSubView(null); }}
          />
          <BottomTabItem
            icon="person"
            label="Profile"
            active={activeTab === 'PROFILE' && profileSubView === null}
            onClick={() => { setActiveTab('PROFILE'); setProfileSubView(null); }}
          />
        </div>
      )}
    </div>
  );
}
