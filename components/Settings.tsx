
import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Eye, 
  Shield, 
  HelpCircle, 
  Moon, 
  Globe, 
  ChevronRight,
  LogOut,
  Key,
  Smartphone,
  Info,
  Sparkles
} from 'lucide-react';

interface SettingsViewProps {
  onLogout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onLogout }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [showAI, setShowAI] = useState(true);

  const SettingItem = ({ icon, label, sublabel, action, type = 'nav' }: any) => (
    <button 
      onClick={action}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-2xl group"
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-white transition-colors">
          {React.cloneElement(icon, { className: 'w-5 h-5 text-gray-600' })}
        </div>
        <div className="text-left">
          <p className="font-semibold text-sm text-gray-900">{label}</p>
          {sublabel && <p className="text-xs text-gray-500">{sublabel}</p>}
        </div>
      </div>
      {type === 'nav' ? (
        <ChevronRight className="w-5 h-5 text-gray-300" />
      ) : type === 'toggle' ? (
        <div className={`w-10 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-purple-600' : 'bg-gray-200'}`}>
          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-4' : ''}`} />
        </div>
      ) : null}
    </button>
  );

  const Toggle = ({ enabled, setEnabled }: { enabled: boolean, setEnabled: (v: boolean) => void }) => (
    <button 
      onClick={() => setEnabled(!enabled)}
      className={`w-11 h-6 rounded-full transition-colors relative ${enabled ? 'bg-purple-600' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${enabled ? 'translate-x-5' : ''}`} />
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 animate-in fade-in duration-500 pb-24">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and privacy</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Account</h2>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <SettingItem icon={<User />} label="Edit Profile" sublabel="Name, bio, and profile picture" />
            <SettingItem icon={<Smartphone />} label="Personal Information" sublabel="Email, phone, and date of birth" />
            <SettingItem icon={<Globe />} label="Language" sublabel="English (US)" />
            <SettingItem 
              icon={<Key />} 
              label="API Studio Key" 
              sublabel="Manage your Google GenAI connection"
              action={() => (window as any).aistudio?.openSelectKey()} 
            />
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Privacy & Security</h2>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <Lock className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-gray-900">Private Account</p>
                  <p className="text-xs text-gray-500">Only people you approve can see your posts</p>
                </div>
              </div>
              <Toggle enabled={privateAccount} setEnabled={setPrivateAccount} />
            </div>
            <SettingItem icon={<Shield />} label="Security" sublabel="Password, 2-factor, login activity" />
            <SettingItem icon={<Eye />} label="Blocked Accounts" />
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">App Preferences</h2>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
             <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <Sparkles className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-gray-900">Show AI Content</p>
                  <p className="text-xs text-gray-500">Display AI-generated tags and content in feed</p>
                </div>
              </div>
              <Toggle enabled={showAI} setEnabled={setShowAI} />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <Moon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-gray-900">Dark Mode</p>
                  <p className="text-xs text-gray-500">Easier on the eyes at night</p>
                </div>
              </div>
              <Toggle enabled={darkMode} setEnabled={setDarkMode} />
            </div>
            <SettingItem icon={<Bell />} label="Notifications" sublabel="Push, email, and SMS" />
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Support</h2>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <SettingItem icon={<HelpCircle />} label="Help Center" />
            <SettingItem icon={<Info />} label="About" sublabel="Version 2.4.0 (Nano Banana)" />
          </div>
        </section>

        <button 
          onClick={onLogout}
          className="w-full p-4 flex items-center justify-center gap-2 text-red-500 font-bold bg-red-50 hover:bg-red-100 transition-colors rounded-2xl"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
};
