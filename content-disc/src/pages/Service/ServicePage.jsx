import React, { useState, useMemo } from 'react';
import './ServicePage.css';
const features = [
  { title: "4K & HD Restoration", description: "Experience classic cinema in stunning high fidelity, with many titles restored and remastered for modern screens." },
  { title: "Watch Anywhere", description: "Seamlessly switch between your TV, computer, or mobile device. Your progress is always synced." },
  { title: "Offline Viewing", description: "Download your favorite films to your device and watch them on the go, without an internet connection." },
  { title: "Ad-Free Experience", description: "Enjoy uninterrupted cinematic masterpieces. Our platform is, and always will be, completely ad-free." }
];
const faqData = [
  { category: "Billing", question: "How do I update my payment method?", answer: "You can update your payment details anytime in the 'Membership' section of your Account settings. All payments are securely processed." },
  { category: "Technical", question: "Why is the video buffering or playing in low quality?", answer: "Video quality adjusts to your internet speed. For the best experience, we recommend a stable connection of at least 5 Mbps for HD and 25 Mbps for 4K streaming. Try pausing the video for a moment to allow it to buffer." },
  { category: "Account", question: "How do I reset my password?", answer: "You can reset your password by clicking the 'Forgot Password?' link on the Login page. An email will be sent to you with instructions." },
  { category: "Content", question: "How often are new films added to the collection?", answer: "We add new, curated films to our library every month! Keep an eye on our newsletter, 'The Director's Cut,' for the latest additions." }
];

const ServicePage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const filteredFaqs = useMemo(() => {
    if (!searchTerm) return faqData;
    return faqData.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="service-page">
      <header className="service-header">
        <h1 className="service-title">Service & Support</h1>
        <p className="service-subtitle">
          Our commitment to providing a premium viewing experience and world-class support.
        </p>
      </header>

      {/* --- Features Section --- */}
      <section className="service-section">
        <h2>Our Commitment to Quality</h2>
        <div className="features-grid">
          {features.map(feature => (
            <div className="feature-item" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="service-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-search-container">
          <input
            type="text"
            placeholder="Search for answers..."
            className="faq-search-input"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="faq-container">
          {filteredFaqs.length > 0 ? filteredFaqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button className="faq-question" onClick={() => toggleFaq(index)}>
                {faq.question}
                <span className={`faq-icon ${openFaqIndex === index ? 'open' : ''}`}>+</span>
              </button>
              <div className={`faq-answer ${openFaqIndex === index ? 'open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          )) : <p className="faq-no-results">No results found for "{searchTerm}"</p>}
        </div>
      </section>
      <section className="service-section">
        <h2>Still Need Help?</h2>
        <p className="contact-subtitle">Our support team is here to assist you. Fill out the form below, and we'll get back to you as soon as possible.</p>
        <form className="contact-form">
          <div className="form-row">
            <div className="input-group"><label htmlFor="name">Your Name</label><input type="text" id="name" required /></div>
            <div className="input-group"><label htmlFor="email">Your Email</label><input type="email" id="email" required /></div>
          </div>
          <div className="input-group">
            <label htmlFor="subject">Subject</label>
            <select id="subject" required>
              <option value="">Select a topic...</option>
              <option value="billing">Billing & Membership</option>
              <option value="technical">Technical Support</option>
              <option value="feedback">Feedback & Suggestions</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" rows="6" required></textarea>
          </div>
          <button type="submit" className="submit-button">Send Message</button>
        </form>
      </section>
    </div>
  );
};

export default ServicePage;
