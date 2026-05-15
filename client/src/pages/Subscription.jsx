import React from 'react';
import { Check, Zap, Crown, Shield } from 'lucide-react';
import translations from '../translations';

const Subscription = () => {
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang] || translations.EN;

  const plans = [
    { name: t.monthly, price: '29', duration: t.oneMonth, icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { name: t.quarterly, price: '59', duration: t.threeMonths, icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/10', popular: true },
    { name: t.halfYearly, price: '99', duration: t.sixMonths, icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: t.yearly, price: '149', duration: t.oneYear, icon: Crown, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="flex flex-col gap-8 px-5 pt-10 pb-32 max-w-md mx-auto w-full animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-[var(--text-primary)]">{lang === 'HI' ? 'प्रीमियम में' : 'Upgrade to'} <span className="text-sky-400">{t.premium}</span> {lang === 'HI' ? 'बदलें' : ''}</h1>
        <p className="text-slate-400 text-sm font-medium">{lang === 'HI' ? 'जारी रखने के लिए एक प्लान चुनें' : 'Choose a plan to continue your journey'}</p>
      </div>

      <div className="grid gap-4">
        {plans.map((plan, i) => (
          <div key={i} className={`glass-card relative overflow-hidden border-2 transition-all active:scale-[0.98] ${plan.popular ? 'border-sky-500/50 ring-1 ring-sky-500/20' : 'border-white/5'}`}>
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
          {lang === 'HI' ? 'क्या शामिल है' : "What's included"}
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

      <button className="premium-button w-full py-4 rounded-2xl font-black text-sm shadow-xl shadow-sky-500/20">
        {t.unlockFeatures}
      </button>

      <p className="text-[10px] text-slate-500 font-medium text-center px-4">
        {lang === 'HI' 
          ? 'भुगतान एकीकरण पर काम चल रहा है। अभी के लिए, आप मैन्युअल रूप से एक्सेस पाने के लिए एडमिन से संपर्क कर सकते हैं।' 
          : 'Payment integration is being processed. For now, you can contact admin to grant access manually.'}
      </p>
    </div>
  );
};

export default Subscription;
