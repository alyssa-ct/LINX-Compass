'use client';

import { useState } from 'react';
import { colors } from '@/lib/constants';

const faqs = [
  {
    question: 'What is LINX Compass?',
    answer:
      'LINX Compass is a 15-dimension behavioral assessment that profiles how individuals think, feel, and act in the workplace. It provides scored dimensions, cross-dimension insights, and role-fit recommendations mapped to 50+ job archetypes.',
  },
  {
    question: 'How long does it take to complete?',
    answer:
      'The free preview (30 questions) takes about 5 minutes. The full assessment varies by version: Light (150 questions, ~20 min), Standard (225 questions, ~30 min), or Max (300 questions, ~40 min).',
  },
  {
    question: 'What do I get in the free preview?',
    answer:
      'You answer 2 questions per dimension (30 total) and see a teaser of your dimension names with blurred scores. To unlock full scores, interpretations, and role-fit analysis, you choose a paid version.',
  },
  {
    question: 'How is this different from other personality tests?',
    answer:
      'LINX Compass measures 15 behavioral dimensions specifically calibrated for workplace performance. Unlike general personality tests, it includes overuse detection (when a strength becomes a weakness), universal disqualifier flags, and direct role-fit mapping to specific job archetypes.',
  },
  {
    question: 'What are the three versions?',
    answer:
      'Light ($149) gives you 15 dimension scores with basic interpretation. Standard ($249) adds overuse detection, cross-dimension insights, and top 5 role-fit matches. Max ($349) includes the full 50+ role analysis with detailed strength and gap breakdowns.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes. All payments are processed securely through Stripe. Your assessment data is stored securely and is never shared with third parties without your consent.',
  },
  {
    question: 'Can I use this for hiring?',
    answer:
      'LINX Compass is designed as a behavioral profiling and development tool. While the role-fit analysis can inform hiring discussions, it should be used as one input among many in a comprehensive hiring process.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-4" style={{ backgroundColor: colors.porcelain }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.indigo }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-xl overflow-hidden"
                style={{ backgroundColor: colors.white, border: '1px solid #e5e5e5' }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-bold pr-4" style={{ color: colors.indigo }}>
                    {faq.question}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="shrink-0 transition-transform duration-300"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: colors.slate }}
                  >
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? '200px' : '0px' }}
                >
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: colors.charcoal }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
