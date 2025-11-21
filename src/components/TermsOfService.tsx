import { FileText, CheckCircle, AlertCircle, Users } from 'lucide-react';

export default function TermsOfService() {
  return (
    <section id="terms" className="py-20 px-6 bg-gradient-to-b from-mint-50/20 via-warm-white to-sage-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <div className="container mx-auto max-w-4xl relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-forest dark:text-sage-100 mb-4">
            Terms of Service
          </h2>
          <p className="text-lg text-warm-gray/70 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-lg border-2 border-sage-100/50 dark:border-gray-700">
            <div className="flex items-start gap-4 mb-4">
              <FileText className="w-6 h-6 text-sage-600 dark:text-sage-400 mt-1 flex-shrink-0" strokeWidth={2} />
              <div>
                <h3 className="text-2xl font-bold text-forest dark:text-sage-100 mb-3">Agreement to Terms</h3>
                <p className="text-warm-gray/80 dark:text-gray-300 leading-relaxed">
                  By accessing or using MindShift, you agree to be bound by these Terms of Service. 
                  If you do not agree with any part of these terms, please do not use our services.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-lg border-2 border-sage-100/50 dark:border-gray-700">
            <div className="flex items-start gap-4 mb-4">
              <CheckCircle className="w-6 h-6 text-sage-600 dark:text-sage-400 mt-1 flex-shrink-0" strokeWidth={2} />
              <div>
                <h3 className="text-xl font-bold text-forest dark:text-sage-100 mb-3">Acceptable Use</h3>
                <p className="text-warm-gray/80 dark:text-gray-300 leading-relaxed mb-3">
                  You agree to use MindShift responsibly and in accordance with applicable laws:
                </p>
                <ul className="space-y-2 text-warm-gray/80 dark:text-gray-300 leading-relaxed list-disc list-inside">
                  <li>Use the service for legitimate mental health and wellness purposes</li>
                  <li>Provide accurate and truthful information</li>
                  <li>Respect the privacy and rights of other users</li>
                  <li>Not attempt to misuse, hack, or damage the service</li>
                  <li>Not use the service for illegal or harmful activities</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-lg border-2 border-sage-100/50 dark:border-gray-700">
            <div className="flex items-start gap-4 mb-4">
              <AlertCircle className="w-6 h-6 text-sage-600 dark:text-sage-400 mt-1 flex-shrink-0" strokeWidth={2} />
              <div>
                <h3 className="text-xl font-bold text-forest dark:text-sage-100 mb-3">Medical Disclaimer</h3>
                <p className="text-warm-gray/80 dark:text-gray-300 leading-relaxed">
                  <strong>Important:</strong> MindShift is not a substitute for professional medical advice, diagnosis, or treatment. 
                  Our AI companion NIRA provides supportive guidance but cannot replace the care of qualified mental health professionals. 
                  If you are experiencing a mental health emergency, please contact emergency services (911) or a crisis helpline (988) immediately.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-lg border-2 border-sage-100/50 dark:border-gray-700">
            <div className="flex items-start gap-4 mb-4">
              <Users className="w-6 h-6 text-sage-600 dark:text-sage-400 mt-1 flex-shrink-0" strokeWidth={2} />
              <div>
                <h3 className="text-xl font-bold text-forest dark:text-sage-100 mb-3">User Responsibilities</h3>
                <ul className="space-y-2 text-warm-gray/80 dark:text-gray-300 leading-relaxed list-disc list-inside">
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Keep your emergency contact information up to date</li>
                  <li>Seek professional help when appropriate</li>
                  <li>Report any bugs, security issues, or inappropriate content</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-sage-50 dark:bg-gray-800 p-8 rounded-[2rem] border-2 border-sage-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-forest dark:text-sage-100 mb-3">Service Availability</h3>
            <p className="text-warm-gray/80 dark:text-gray-300 leading-relaxed">
              We strive to provide reliable service, but we cannot guarantee uninterrupted availability. 
              We reserve the right to modify, suspend, or discontinue any part of the service at any time. 
              We will provide reasonable notice when possible.
            </p>
          </div>

          <div className="bg-forest p-8 rounded-[2rem] text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
            <p className="text-white/90 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@mindshift.com" className="underline hover:text-mint-300">legal@mindshift.com</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
