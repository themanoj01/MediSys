import React, { useState } from 'react';
import { Search } from 'lucide-react';
import FAQItem from '../components/ui/FAQItem';
import { faqs } from '../lib/data';

const Faqs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter FAQs based on search term
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our services, appointments, and facilities.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for questions or keywords..."
              className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          {filteredFaqs.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredFaqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No FAQs found</h3>
              <p className="mt-2 text-gray-500">
                No questions matched your search term. Please try a different search.
              </p>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            If you couldn't find the answer you were looking for, please don't hesitate to contact us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <p className="text-gray-800 font-medium">Call us at:</p>
              <a href="tel:+61234567890" className="text-primary hover:underline">+61 2 3456 7890</a>
            </div>
            <div>
              <p className="text-gray-800 font-medium">Email us at:</p>
              <a href="mailto:info@medisys.com.au" className="text-primary hover:underline">info@medisys.com.au</a>
            </div>
            <div>
              <p className="text-gray-800 font-medium">Visit us at:</p>
              <p className="text-gray-600">123 Healthcare St, Sydney</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faqs;