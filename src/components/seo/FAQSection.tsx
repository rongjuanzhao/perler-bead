'use client'

import { useState } from 'react'
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "How do you calculate percentage increase?",
    answer: "To calculate percentage increase, subtract the initial value from the final value, divide by the initial value, then multiply by 100. Formula: ((Final - Initial) / Initial) × 100 = Percentage Increase"
  },
  {
    question: "What's the difference between percentage increase and percentage change?",
    answer: "Percentage increase specifically refers to a positive change (when final value > initial value). Percentage change can be positive (increase) or negative (decrease). Our calculator handles both scenarios automatically."
  },
  {
    question: "Can I calculate percentage decrease with this tool?",
    answer: "Yes! Our calculator automatically detects when the final value is less than the initial value and displays the result as a negative percentage, indicating a decrease."
  },
  {
    question: "Why does the calculator show an error when I enter 0 as the initial value?",
    answer: "Division by zero is mathematically undefined. When the initial value is 0, percentage change cannot be calculated. Instead, you would express this as an absolute increase to the final value."
  },
  {
    question: "How accurate are the calculations?",
    answer: "Our calculator provides results rounded to 2 decimal places for display, but uses full precision for internal calculations. This ensures accurate results for both small and large numbers."
  },
  {
    question: "Can I save my calculation results?",
    answer: "Yes! The calculator automatically saves your last 5 calculations locally in your browser. You can also export your calculation history to a CSV file for record-keeping."
  },
  {
    question: "What are some common uses for percentage increase calculations?",
    answer: "Common uses include calculating salary increases, analyzing business revenue growth, measuring investment returns, tracking price changes, comparing sales performance, and solving educational math problems."
  },
  {
    question: "Is this calculator free to use?",
    answer: "Yes! Our percentage increase calculator is completely free to use with no limitations. No registration or payment required."
  }
]

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 mb-4">
          <FiHelpCircle className="w-6 h-6 text-blue-500" />
          <h2 className="text-3xl font-bold text-slate-800">Frequently Asked Questions</h2>
        </div>
        <p className="text-slate-600 text-lg">Get answers to common questions about percentage calculations</p>
      </div>

      <div className="space-y-4">
        {faqData.map((item, index) => {
          const isOpen = openItems.includes(index)
          
          return (
            <div 
              key={index}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 rounded-xl transition-colors"
                aria-expanded={isOpen}
              >
                <h3 className="text-lg font-semibold text-slate-800 pr-4">
                  {item.question}
                </h3>
                <FiChevronDown 
                  className={`w-5 h-5 text-slate-500 transform transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-4">
                  <div className="h-px bg-slate-200 mb-4"></div>
                  <p className="text-slate-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Help Section */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Need More Help?</h3>
          <p className="text-slate-600 mb-4">
            Can't find what you're looking for? We're here to help with any calculation questions.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}