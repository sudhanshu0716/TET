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
    navigate('/dashboard');
  };

  const handleFailure = (error) => {
    alert(lang === 'HI' ? 'भुगतान विफल: ' + error : 'Payment Failed: ' + error);
  };

  return (
    <div className="flex flex-col gap-8 px-5 pt-10 pb-32 max-w-md mx-auto w-full animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-[var(--text-primary)]">{lang === 'HI' ? 'प्रीमियम में' : 'Upgrade to'} <span className="text-sky-400">{t.premium}</span> {lang === 'HI' ? 'बदलें' : ''}</h1>
        <p className="text-slate-400 text-sm font-medium">{lang === 'HI' ? 'असीमित तैयारी के लिए एक प्लान चुनें' : 'Choose a plan for unlimited preparation'}</p>
      </div>

      <div className="grid gap-4">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedPlan(plan.id)}
            className={`glass-card relative overflow-hidden border-2 transition-all cursor-pointer active:scale-[0.98] ${selectedPlan === plan.id ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-white/5 opacity-70'}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-sky-500 text-white text-[8px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-widest">
                {t.bestValue}
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${plan.bg} ${plan.color}`}>
                  <plan.icon size={24} />
                </div>
                <div>
                  <h3 className="font-black text-[var(--text-primary)]">{plan.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{plan.duration}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-[var(--text-primary)]">₹{plan.price}</div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">One-time</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">
          {lang === 'HI' ? 'प्रीमियम सुविधाएं' : "Premium Features"}
        </h4>
        <div className="grid gap-3">
          {(lang === 'HI' 
            ? ['असीमित दैनिक परीक्षाएं', 'पूर्ण प्रदर्शन विश्लेषण', 'लाइव प्रतियोगिताओं में प्राथमिकता', 'विज्ञापन-मुक्त अनुभव', 'सभी प्रीमियम नोट्स']
            : ['Unlimited Daily Exams', 'Complete Performance Analytics', 'Priority Access to Live Contests', 'Ad-free Experience', 'All Premium Cheatsheets']
          ).map((feat, i) => (
            <div key={i} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <Check size={12} />
              </div>
              {feat}
            </div>
          ))}
        </div>
      </div>

      <PaymentButton 
        amount={Math.round(plans[selectedPlan].price * 100)} 
        user={user}
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        label={t.unlockFeatures}
      />

      <p className="text-[10px] text-slate-500 font-medium text-center px-4">
        {lang === 'HI' 
          ? 'सुरक्षित भुगतान रेजरपे (Razorpay) द्वारा संचालित।' 
          : 'Secure payment powered by Razorpay.'}
      </p>
    </div>
  );
};

export default Subscription;
