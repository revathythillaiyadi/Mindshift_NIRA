import { Shield, Phone, Heart } from 'lucide-react';

export default function SafetyGuarantee() {
  return (
    <section className="py-16 px-6 bg-forest relative overflow-hidden">

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/90 rounded-full mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-sage-600" strokeWidth={2} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            We're Here to Keep You Safe
          </h2>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-pebble-lg border border-white/50 shadow-xl">
          <p className="text-warm-gray text-lg leading-relaxed text-center mb-8">
            At MindShift, we understand that mental health is deeply personal and requires the highest level of care.
            While NIRA provides compassionate support and gentle guidance, we want you to know that help is always
            available when you need it most.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center bg-sage-50/50 p-6 rounded-pebble">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-forest rounded-full mb-4 shadow-md">
                <Phone className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-warm-gray font-bold text-lg mb-2">24/7 Crisis Access</h3>
              <p className="text-warm-gray/70 text-sm leading-relaxed">
                Immediate support connects you to emergency resources anytime, day or night
              </p>
            </div>

            <div className="text-center bg-mint-50/50 p-6 rounded-pebble">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-forest rounded-full mb-4 shadow-md">
                <Shield className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-warm-gray font-bold text-lg mb-2">Protected & Private</h3>
              <p className="text-warm-gray/70 text-sm leading-relaxed">
                Your conversations are encrypted and completely confidential, always
              </p>
            </div>

            <div className="text-center bg-peach-50/50 p-6 rounded-pebble">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-forest rounded-full mb-4 shadow-md">
                <Heart className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-warm-gray font-bold text-lg mb-2">Professional Support</h3>
              <p className="text-warm-gray/70 text-sm leading-relaxed">
                Guidance to connect with licensed therapists when you need more
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-sage-200 text-center">
            <p className="text-warm-gray font-semibold mb-4 text-lg">
              If you're experiencing a crisis or thoughts of self-harm:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:988"
                className="bg-forest text-white px-8 py-4 rounded-pebble font-bold hover:bg-forest-light hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call 988 (US)
              </a>
              <a
                href="tel:911"
                className="bg-forest text-white px-8 py-4 rounded-pebble font-bold hover:bg-forest-light hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Emergency: 911
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
