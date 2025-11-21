import { useState } from 'react';
import { Link } from 'react-router-dom';
import TreeRing from '../components/TreeRing';
import { QrCode, Smartphone, ArrowRight } from 'lucide-react';

export default function BetaQRCode() {
  const [qrCodeError, setQrCodeError] = useState(false);
  
  // URL that the QR code should link to - the beta signup form on the landing page
  const betaSignupUrl = `${window.location.origin}/#beta-signup`;
  
  // Generate QR code using a free QR code API service
  // Using api.qrserver.com which is a free, no-auth service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(betaSignupUrl)}`;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-mint-50/20 via-warm-white to-sage-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Tree Rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <TreeRing
          ringCount={9}
          className="absolute top-10 -right-10 w-[280px] h-[280px] opacity-20"
        />
        <TreeRing
          ringCount={7}
          className="absolute bottom-20 -left-10 w-[240px] h-[240px] opacity-20"
        />
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-sage-100/50 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-sage-500 to-mint-500 rounded-[1.5rem] flex items-center justify-center shadow-lg">
                <QrCode className="w-9 h-9 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-forest dark:text-blue-100 mb-3">
              Join the MindShift Beta
            </h1>
            <p className="text-lg text-soft-gray dark:text-blue-300">
              Scan the QR code to access the beta signup form
            </p>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-sage-200 dark:border-gray-600 mb-6">
              {/* QR Code Image - Generated dynamically */}
              <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center relative overflow-hidden">
                {qrCodeError ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 p-4">
                    <QrCode className="w-16 h-16 mb-2" />
                    <p className="text-sm text-center">Unable to load QR code</p>
                    <p className="text-xs text-center mt-2">Please use the button below</p>
                  </div>
                ) : (
                  <img
                    src={qrCodeUrl}
                    alt="Beta Signup QR Code - Scan to join MindShift Beta"
                    className="w-full h-full object-contain"
                    onError={() => setQrCodeError(true)}
                  />
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-sage-50 dark:bg-gray-700/50 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-start gap-4">
                <Smartphone className="w-6 h-6 text-sage-600 dark:text-sage-400 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-forest dark:text-blue-100">
                    How to join:
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-soft-gray dark:text-blue-300">
                    <li>Open your phone's camera app</li>
                    <li>Point it at the QR code above</li>
                    <li>Tap the notification that appears</li>
                    <li>Fill out the beta signup form</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Access */}
          <div className="border-t border-sage-200 dark:border-gray-700 pt-6">
            <p className="text-center text-soft-gray dark:text-blue-300 mb-4">
              Prefer to sign up on this device?
            </p>
            <Link
              to="/#beta-signup"
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-sage-500 to-mint-500 hover:from-sage-600 hover:to-mint-600 text-white font-semibold rounded-[1.5rem] shadow-lg hover:shadow-xl transition-all"
            >
              Go to Signup Form
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-blue-600 dark:text-sage-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors inline-flex items-center gap-2"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

