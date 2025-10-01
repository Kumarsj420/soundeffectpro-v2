// components/SubscriptionCard.tsx
import React from 'react';

const SubscriptionCard: React.FC = () => {
  const handleUpgrade = () => {
    console.log('Upgrade to Premium clicked');
    // TODO: Add upgrade logic
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-zinc-900 rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">Current Plan</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-zinc-100">Free Plan</p>
            <p className="text-zinc-400 text-sm">$0/month</p>
          </div>
          <button
            onClick={handleUpgrade}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-6 py-2 font-medium transition-colors"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>

      {/* Premium Benefits */}
      <div className="bg-zinc-900 rounded-xl shadow p-6">
        <h4 className="text-lg font-semibold text-zinc-100 mb-4">Premium Benefits</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-zinc-200 font-medium">Higher Upload Size</p>
              <p className="text-zinc-400 text-sm">Upload files up to 50MB instead of 10MB</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-zinc-200 font-medium">Unlimited Downloads</p>
              <p className="text-zinc-400 text-sm">Download sounds without daily limits</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-zinc-200 font-medium">Ad-Free Experience</p>
              <p className="text-zinc-400 text-sm">Enjoy browsing without advertisements</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-zinc-200 font-medium">Priority Support</p>
              <p className="text-zinc-400 text-sm">Get faster responses to your questions</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-zinc-200 font-medium">Early Access</p>
              <p className="text-zinc-400 text-sm">Try new features before everyone else</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-zinc-800 rounded-lg border border-blue-600/20">
          <div className="text-center">
            <p className="text-2xl font-bold text-zinc-100">$9.99<span className="text-sm font-normal text-zinc-400">/month</span></p>
            <button
              onClick={handleUpgrade}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 font-medium transition-colors"
            >
              Start Premium Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;