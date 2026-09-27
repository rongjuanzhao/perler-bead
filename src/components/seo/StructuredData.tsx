export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Percentage Increase Calculator",
    "description": "Free online percentage increase calculator. Calculate percentage changes, increases, and decreases instantly with visual comparison and history tracking.",
    "url": "https://percentage-increase-calculator.net/",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Instant percentage calculations",
      "Visual comparison charts",
      "Calculation history tracking",
      "CSV export functionality",
      "Mobile responsive design",
      "No registration required"
    ],
    "author": {
      "@type": "Organization",
      "name": "Percentage Calculator"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Percentage Calculator"
    }
  }

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do you calculate percentage increase?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To calculate percentage increase, subtract the initial value from the final value, divide by the initial value, then multiply by 100. Formula: ((Final - Initial) / Initial) × 100 = Percentage Increase"
        }
      },
      {
        "@type": "Question",
        "name": "What's the difference between percentage increase and percentage change?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Percentage increase specifically refers to a positive change (when final value > initial value). Percentage change can be positive (increase) or negative (decrease). Our calculator handles both scenarios automatically."
        }
      },
      {
        "@type": "Question",
        "name": "Can I calculate percentage decrease with this tool?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our calculator automatically detects when the final value is less than the initial value and displays the result as a negative percentage, indicating a decrease."
        }
      },
      {
        "@type": "Question",
        "name": "Is this calculator free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our percentage increase calculator is completely free to use with no limitations. No registration or payment required."
        }
      }
    ]
  }

  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Percentage Increase",
    "description": "Step-by-step guide to calculating percentage increase using our online calculator",
    "image": "https://percentage-increase-calculator.net/calculator-preview.jpg",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter Initial Value",
        "text": "Input your starting value, original price, or baseline number in the first field",
        "url": "https://percentage-increase-calculator.net/#step1"
      },
      {
        "@type": "HowToStep", 
        "name": "Enter Final Value",
        "text": "Input your ending value, new price, or current number in the second field",
        "url": "https://percentage-increase-calculator.net/#step2"
      },
      {
        "@type": "HowToStep",
        "name": "Get Results",
        "text": "Click calculate to see instant percentage change with visual comparison",
        "url": "https://percentage-increase-calculator.net/#step3"
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }}
      />
    </>
  )
}