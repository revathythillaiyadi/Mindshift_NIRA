import { Shield, Award, Users } from 'lucide-react';

export default function AboutUs() {
  return (
    <section id="about" className="py-20 px-6 bg-warm-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-warm-gray mb-6">
              About MindShift
            </h2>
            <div className="space-y-4 text-lg text-warm-gray/80 leading-relaxed">
              <p>
                MindShift is dedicated to making evidence-based mental health support accessible to everyone.
                Our platform combines thoughtful artificial intelligence with proven therapeutic techniques
                to help you navigate life's challenges with confidence and clarity.
              </p>
              <p>
                Founded by mental health professionals and researchers, MindShift is built on the principles
                of cognitive behavioral therapy and positive psychology. Our companion NIRA is designed with
                thousands of therapeutic conversations in mind, continuously refined to provide empathetic,
                personalized support.
              </p>
              <p>
                We believe that mental wellness should be within reach for everyone, which is why we've created
                a safe, judgment-free space where you can explore your thoughts, build resilience, and develop
                healthier thinking patterns at your own pace.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-sage-50/70 backdrop-blur-sm p-6 rounded-pebble border border-sage-100/50 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-sage-400 to-mint-400 rounded-pebble flex items-center justify-center flex-shrink-0 shadow-md">
                  <Shield className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-warm-gray mb-2">Privacy First</h3>
                  <p className="text-warm-gray/70 leading-relaxed">
                    Your data is encrypted and protected with bank-level security. We never share your personal information.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-mint-50/70 backdrop-blur-sm p-6 rounded-pebble border border-mint-100/50 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-mint-400 to-sage-500 rounded-pebble flex items-center justify-center flex-shrink-0 shadow-md">
                  <Award className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-warm-gray mb-2">Science-Backed</h3>
                  <p className="text-warm-gray/70 leading-relaxed">
                    Built on proven therapeutic methods and validated by mental health experts and researchers.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-peach-50/70 backdrop-blur-sm p-6 rounded-pebble border border-peach-100/50 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-peach-400 to-sunrise-400 rounded-pebble flex items-center justify-center flex-shrink-0 shadow-md">
                  <Users className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-warm-gray mb-2">Community Support</h3>
                  <p className="text-warm-gray/70 leading-relaxed">
                    Join thousands of users on their wellness journey, supported by our dedicated team of professionals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
