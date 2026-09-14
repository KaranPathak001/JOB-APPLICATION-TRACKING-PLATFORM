import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ChevronRight,
  FileSpreadsheet,
  CheckCircle2,
  Mail,
  Zap,
  Briefcase,
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [trackerType, setTrackerType] = useState('Spreadsheet');
  const [importChoice, setImportChoice] = useState('Manual');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFinish = () => {
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 animate-fade-in relative overflow-hidden">
        {/* Step Indicators */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center font-bold text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm">JobFlow AI Setup</span>
          </div>
          <span className="text-xs font-semibold text-sky-400">Step {step} of 4</span>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto border border-sky-500/20">
              <Briefcase className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight">
                Welcome to JobFlow AI, {user?.name?.split(' ')[0] || 'there'}!
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Let's customize your intelligent job search workspace in under 60 seconds.
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-md shadow-sky-500/20 transition flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: How you currently track */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">How do you currently track applications?</h2>
              <p className="text-xs text-slate-400 mt-1">We'll tailor your dashboard view based on your current workflow.</p>
            </div>

            <div className="space-y-3">
              {['Spreadsheet (Excel / Google Sheets)', 'Notes App', 'Another Tracker Tool', "I don't track them yet"].map(
                (opt) => (
                  <button
                    key={opt}
                    onClick={() => setTrackerType(opt)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition flex items-center justify-between ${
                      trackerType === opt
                        ? 'border-sky-500 bg-sky-500/10 text-sky-300'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{opt}</span>
                    {trackerType === opt && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                  </button>
                )
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Automation */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Automate your job search</h2>
              <p className="text-xs text-slate-400 mt-1">
                JobFlow AI can automatically detect incoming recruiter interview requests & ATS status updates.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-sky-500/30 bg-sky-500/10 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-sky-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Gmail Integration</h4>
                  <p className="text-xs text-sky-200">Automatically sync job emails and scheduled interview links.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Ready */}
        {step === 4 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight">You're all set!</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Your JobFlow AI workspace is configured. Dive in to view active opportunities, parse job postings, and track interviews.
              </p>
            </div>
            <button
              onClick={handleFinish}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-sky-500/20 transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
