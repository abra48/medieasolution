"use client";

import { useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n";

export function FAQSection() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  const faqs = [
    { question: t("faq1.q"), answer: t("faq1.a") },
    { question: t("faq2.q"), answer: t("faq2.a") },
    { question: t("faq3.q"), answer: t("faq3.a") },
    { question: t("faq4.q"), answer: t("faq4.a") },
    { question: t("faq5.q"), answer: t("faq5.a") },
  ];

  return (
    <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 sm:mb-16" data-reveal>
          <p className="section-label justify-center mb-4">
            {t("faq.label")}
          </p>
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight l-text">
            {t("faq.title")}
          </h2>
        </div>

        <div className="border-t l-border" data-reveal data-reveal-delay="100">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "faq-open" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span>{faq.question}</span>
                <svg
                  className="faq-chevron"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
