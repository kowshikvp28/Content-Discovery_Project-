
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './MembershipPage.css';
import { useAuth } from '../../context/AuthContext';
const plans = [
  {
    planId: "cinephile_monthly",
    name: "The Cinephile",
    price: "9.99",
    billingCycle: "per month",
    description: "For the dedicated enthusiast. Stream our entire collection anytime.",
    features: [
      "Access to all films",
      "HD (1080p) streaming",
      "Watch on 1 device at a time",
      "Standard community access"
    ],
    isFeatured: false,
  },
  {
    planId: "archivist_yearly",
    name: "The Archivist",
    price: "99.99",
    billingCycle: "per year",
    description: "For the true collector. The best value with exclusive perks.",
    features: [
      "Everything in Cinephile, plus:",
      "4K streaming where available",
      "Watch on 4 devices at once",
      "Offline downloads",
      "Exclusive members-only content"
    ],
    isFeatured: true,
  }
];
const faqData = [
  { question: "Can I cancel my membership anytime?", answer: "Absolutely..." },
  { question: "What devices can I watch on?", answer: "Our platform is available..." },
  { question: "Are new films added to the collection?", answer: "Yes! We are constantly working..." },
  { question: "Do you offer a free trial?", answer: "While we do not offer..." }
];

const MembershipPage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const { isLoggedIn, user } = useAuth(); 
  const navigate = useNavigate();
  const [isLoadingPlan, setIsLoadingPlan] = useState(null); 
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  const handleSelectPlan = async (selectedPlanId, planName) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setIsLoadingPlan(selectedPlanId);
    try {
      console.log(`User ${user.email} selected plan: ${planName} (${selectedPlanId})`);
      console.log(user)
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error("Failed to select plan:", error);
    } finally {
      setIsLoadingPlan(null);
    }
  };
  const currentPlanId = user?.subscription?.planId;
  return (
    <div className="membership-page">
      <header className="membership-header">
        <h1 className="membership-title">Join The Director's Club</h1>
        <p className="membership-subtitle">
          Unlock our complete, curated archive of cinematic treasures. Choose the plan that's right for you.
        </p>
      </header>

      <section className="pricing-section">
        <div className="pricing-grid">
          {plans.map((plan, index) => {
             const isCurrentPlan = currentPlanId === plan.planId;
             const isLoadingThisPlan = isLoadingPlan === plan.planId;
             return (
              <div key={index} className={`pricing-card ${plan.isFeatured ? 'featured' : ''} ${isCurrentPlan ? 'current-plan' : ''}`}>
                {plan.isFeatured && <div className="featured-banner">Best Value</div>}
                {isCurrentPlan && <div className="current-plan-banner">Current Plan</div>}
                <h2 className="plan-name">{plan.name}</h2>
                <p className="plan-price">
                  ${plan.price} <span className="plan-cycle">/ {plan.billingCycle}</span>
                </p>
                <p className="plan-description">{plan.description}</p>
                <ul className="plan-features">
                  {plan.features.map((feature, i) => <li key={i}>{feature}</li>)}
                </ul>
                <button
                  className="plan-button"
                  onClick={() => handleSelectPlan(plan.planId, plan.name)}
                  disabled={isCurrentPlan || isLoadingThisPlan}
                >
                  {isLoadingThisPlan ? 'Processing...' : (isCurrentPlan ? 'Your Plan' : 'Select Plan')}
                </button>
              </div>
             );
          })}
        </div>
      </section>
      <section className="comparison-section">
         <h2>Compare Our Plans</h2>
         <table className="comparison-table">
           <thead><tr><th>Feature</th><th>The Cinephile</th><th>The Archivist</th></tr></thead>
           <tbody>
              <tr><td>Unlimited Library Access</td><td>✓</td><td>✓</td></tr>
              <tr><td>HD (1080p) Streaming</td><td>✓</td><td>✓</td></tr>
              <tr><td>4K UHD Streaming</td><td>-</td><td>✓</td></tr>
              <tr><td>Offline Downloads</td><td>-</td><td>✓</td></tr>
              <tr><td>Watch on Multiple Devices</td><td>1 Screen</td><td>4 Screens</td></tr>
              <tr><td>Exclusive Member Content</td><td>-</td><td>✓</td></tr>
           </tbody>
         </table>
      </section>
      <section className="faq-section">
         <h2>Frequently Asked Questions</h2>
         <div className="faq-container">
           {faqData.map((faq, index) => (
             <div key={index} className="faq-item">
               <button className="faq-question" onClick={() => toggleFaq(index)}>
                 {faq.question}
                 <span className={`faq-icon ${openFaqIndex === index ? 'open' : ''}`}>+</span>
               </button>
               <div className={`faq-answer ${openFaqIndex === index ? 'open' : ''}`}>
                 <p>{faq.answer}</p>
               </div>
             </div>
           ))}
         </div>
      </section>
    </div>
  );
};

export default MembershipPage;
