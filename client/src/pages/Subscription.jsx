import React, { useState } from 'react';
import { Check, Zap, Crown, Shield } from 'lucide-react';
import translations from '../translations';
import PaymentButton from '../components/PaymentButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Subscription = () => {
  const { user, setUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(1); // Default to popular plan
  const navigate = useNavigate();
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang] || translations.EN;

  const isTrialValid = user?.trial_end_date && new Date(user.trial_end_date) > new Date();
  const isSubValid = user?.subscription_end_date && new Date(user.subscription_end_date) > new Date();
  const trialDaysLeft = user?.trial_end_date ? Math.ceil((new Date(user.trial_end_date) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
  
  const currentPlanName = user?.is_premium || isSubValid ? 'Premium' : isTrialValid ? 'Trial' : 'Expired';
  const currentPlanIcon = user?.is_premium || isSubValid ? Crown : isTrialValid ? Zap : Shield;

  const plans = [
    { id: 0, name: t.monthly, price: 29, duration: t.oneMonth, icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 1, name: t.quarterly, price: 59, duration: t.threeMonths, icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/10', popular: true },
    { id: 2, name: t.halfYearly, price: 99, duration: t.sixMonths, icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 3, name: t.yearly, price: 149, duration: t.oneYear, icon: Crown, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const handleSuccess = (data) => {
    alert(lang === 'HI' ? 'भुगतान सफल! आप अब एक प्रीमियम सदस्य हैं।' : 'Payment Successful! You are now a Premium Member.');
    if (data.user) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    navigate('/profile');
  };

  const handleFailure = (error) => {
    alert(lang === 'HI' ? 'भुगतान विफल: ' + error : 'Payment Failed: ' + error);
  };

  return (
    <div className="flex flex-col gap-4 px-4 pt-6 pb-24 max-w-md mx-auto w-full animate-fade-in">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-black text-[var(--text-primary)]">{lang === 'HI' ? 'प्रीमियम में' : 'Upgrade to'} <span className="text-sky-400">{lang === 'HI' ? 'अपग्रेड' : t.premium}</span> {lang === 'HI' ? 'करें' : ''}</h1>
        <p className="text-slate-400 text-[10px] font-medium">{lang === 'HI' ? 'असीमित तैयारी के लिए एक प्लान चुनें' : 'Choose a plan for unlimited preparation'}</p>
      </div>

      <div className="glass-card p-5 border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-500/10 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
            {React.createElement(currentPlanIcon, { size: 24 })}
          </div>
          <div>
            <h4 className="text-sm font-black text-[var(--text-primary)]">
              {lang === 'HI' ? 'वर्तमान प्लान: ' : 'Current Plan: '} 
              <span className="text-amber-500">{currentPlanName}</span>
            </h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
              {currentPlanName === 'Premium' 
                ? (user.subscription_end_date ? `Expires: ${new Date(user.subscription_end_date).toLocaleDateString()}` : 'Lifetime Access')
                : currentPlanName === 'Trial'
                ? `${trialDaysLeft} days left in trial`
                : 'Your access has expired'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedPlan(plan.id)}
            className={`glass-card p-3 relative flex flex-col items-center justify-center text-center gap-2 border-2 transition-all cursor-pointer active:scale-[0.98] ${selectedPlan === plan.id ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-500/5' : 'border-white/5 opacity-70'}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-sky-500 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-bl-lg tracking-widest">
                {t.bestValue}
              </div>
            )}
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${plan.bg} ${plan.color}`}>
              <plan.icon size={20} />
            </div>
            <div>
              <h3 className="font-black text-sm text-[var(--text-primary)]">{plan.name}</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{plan.duration}</p>
            </div>
            <div>
              <div className="text-xl font-black text-[var(--text-primary)]">₹{plan.price}</div>
            </div>
          </div>
        ))}
      </div>



      <PaymentButton 
        amount={Math.round(plans[selectedPlan].price * 100)} 
        planId={plans[selectedPlan].id}
        user={user}
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        label={t.unlockFeatures}
      />

      <p className="text-[10px] text-slate-500 font-medium text-center px-4">
        {lang === 'HI' 
          ? 'रेज़रपे (Razorpay) द्वारा सुरक्षित भुगतान' 
          : 'Secure payment powered by Razorpay.'}
      </p>
    </div>
  );
};

export default Subscription;
