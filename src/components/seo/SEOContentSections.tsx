import { FiTrendingUp, FiActivity, FiBarChart, FiTarget, FiDollarSign, FiBookOpen } from 'react-icons/fi'

const features = [
  {
    icon: FiActivity,
    title: "Instant Calculations",
    description: "Get percentage change results immediately with our lightning-fast percentage increase calculator engine."
  },
  {
    icon: FiBarChart,
    title: "Visual Comparison",
    description: "See your data with interactive bar charts that make understanding percentage changes intuitive."
  },
  {
    icon: FiTrendingUp,
    title: "History Tracking",
    description: "Keep track of your recent calculations and export data for your records."
  },
  {
    icon: FiTarget,
    title: "High Precision",
    description: "Professional-grade accuracy for all your percentage calculation needs."
  }
]

const useCases = [
  {
    icon: FiDollarSign,
    title: "Financial Analysis",
    description: "Calculate investment returns, salary increases, price changes, and budget analysis.",
    examples: ["Investment ROI calculation", "Salary negotiation prep", "Price comparison analysis"]
  },
  {
    icon: FiTrendingUp,
    title: "Business Growth",
    description: "Track revenue growth, customer acquisition, and performance metrics over time.",
    examples: ["Monthly revenue growth", "Customer base expansion", "Sales performance tracking"]
  },
  {
    icon: FiBookOpen,
    title: "Educational Use",
    description: "Perfect for students, teachers, and anyone learning percentage increase calculations.",
    examples: ["Math homework help", "Statistics projects", "Academic research"]
  }
]

export default function SEOContentSections() {
  return (
    <>
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Why Choose Our Percentage Increase Calculator?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Professional-grade tools designed for accuracy, speed, and ease of use
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-4 group-hover:bg-blue-200 transition-colors">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Perfect for Every Percentage Increase Calculation Need
            </h2>
            <p className="text-xl text-slate-600">
              From business analysis to educational projects, our percentage increase calculator serves all purposes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <useCase.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">{useCase.title}</h3>
                </div>
                <p className="text-slate-600 mb-4">{useCase.description}</p>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-700">Common uses:</div>
                  <ul className="space-y-1">
                    {useCase.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex} className="text-sm text-slate-600 flex items-center">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              How to Calculate Percentage Increase
            </h2>
            <p className="text-xl text-slate-600">
              Simple steps to get accurate percentage calculations every time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Enter Initial Value</h3>
              <p className="text-slate-600">Input your starting value or original amount</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Enter Final Value</h3>
              <p className="text-slate-600">Input your ending value or new amount</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Get Results</h3>
              <p className="text-slate-600">See instant percentage change with visual comparison</p>
            </div>
          </div>

          <div className="mt-12 bg-slate-50 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Formula Explanation</h3>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="font-mono text-lg text-center text-slate-800 mb-2">
                Percentage Change = ((Final Value - Initial Value) / Initial Value) × 100
              </div>
              <p className="text-sm text-slate-600 text-center">
                Positive results indicate an increase, negative results indicate a decrease
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-8">
            Trusted by Professionals Worldwide
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-slate-600">Accurate</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">Free</div>
              <div className="text-sm text-slate-600">Always</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">Instant</div>
              <div className="text-sm text-slate-600">Results</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-slate-600">Available</div>
            </div>
          </div>

          <p className="text-lg text-slate-600 mb-6">
            Join thousands of users who rely on our Percentage Increase Calculator for accurate, instant calculations.
            No registration required, completely free, and always available when you need it.
          </p>
        </div>
      </section>
    </>
  )
}