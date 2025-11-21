import { Shield, Lock, Eye, FileCheck } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <section id="privacy" className="py-20 px-6 bg-gradient-to-b from-sage-50/30 via-warm-white to-mint-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <div className="container mx-auto max-w-4xl relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-forest dark:text-sage-100 mb-4">
            Privacy Policy
          </h2>
          <p className="text-lg text-warm-gray/70 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-lg border-2 border-sage-100/50 dark:border-gray-700">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-mint-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-forest dark:text-sage-100 mb-3">Your Privacy Matters</h3>
                <p className="text-warm-gray/80 dark:text-gray-300 leading-relaxed">
                  At MindShift, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-lg border-2 border-sage-100/50 dark:border-gray-700">
            <div className="flex items-start gap-4 mb-4">
              <Lock className="w-6 h-6 text-sage-600 dark:text-sage-400 mt-1 flex-shrink-0" strokeWidth={2} />
              <div>
                <h3 className="text-xl font-bold text-forest dark:text-sage-100 mb-3">Information We Collect</h3>
                <ul className="space-y-2 text-warm-gray/80 dark:text-gray-300 leading-relaxed list-disc list-inside">
                  <li>Account information (name, email, phone number)</li>
                  <li>Health and wellness data you choose to share</li>
                  <li>Conversation history with NIRA</li>
                  <li>Journal entries and mood logs</li>
                  <li>Emergency contact information</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-lg border-2 border-sage-100/50 dark:border-gray-700">
            <div className="flex items-start gap-4 mb-4">
              <Eye className="w-6 h-6 text-sage-600 dark:text-sage-400 mt-1 flex-shrink-0" strokeWidth={2} />
              <div>
                <h3 className="text-xl font-bold text-forest dark:text-sage-100 mb-3">How We Use Your Information</h3>
                <ul className="space-y-2 text-warm-gray/80 dark:text-gray-300 leading-relaxed list-disc list-inside">
                  <li>Provide personalized mental health support and guidance</li>
                  <li>Improve our AI companion's responses and recommendations</li>
                  <li>Track your progress and celebrate milestones</li>
                  <li>Contact emergency services if you're in crisis (with your explicit consent)</li>
                  <li>Comply with legal obligations and protect user safety</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-lg border-2 border-sage-100/50 dark:border-gray-700">
            <div className="flex items-start gap-4 mb-4">
              <FileCheck className="w-6 h-6 text-sage-600 dark:text-sage-400 mt-1 flex-shrink-0" strokeWidth={2} />
              <div>
                <h3 className="text-xl font-bold text-forest dark:text-sage-100 mb-3">Data Security</h3>
                <p className="text-warm-gray/80 dark:text-gray-300 leading-relaxed mb-3">
                  We implement bank-level encryption and security measures to protect your data:
                </p>
                <ul className="space-y-2 text-warm-gray/80 dark:text-gray-300 leading-relaxed list-disc list-inside">
                  <li>End-to-end encryption for all communications</li>
                  <li>Secure data storage with industry-standard protocols</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal data by authorized personnel only</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-forest p-8 rounded-[2rem] text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Your Rights</h3>
            <p className="text-white/90 leading-relaxed mb-4">
              You have the right to access, update, or delete your personal information at any time. 
              You can also request a copy of your data or opt-out of certain data processing activities. 
              Contact us at <a href="mailto:privacy@mindshift.com" className="underline hover:text-mint-300">privacy@mindshift.com</a> for any privacy-related inquiries.
            </p>
            <p className="text-white/90 leading-relaxed">
              <strong>We never sell your personal information.</strong> Your data is yours, and we respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
