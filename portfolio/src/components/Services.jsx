import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import portfolioManagementImg from '../assets/portfolioManagementImg.jpg';
import retirementInvestmentImg from '../assets/retirementInvestmentImg.jpeg';
import rmaImg from '../assets/rma.png';
import wealthPlanningImg from '../assets/wealthPlanningImg.jpeg';

const servicesData = [
  {
    title: 'Portfolio Management',
    image: portfolioManagementImg,
    description:
      'Our expert team customizes portfolios tailored to your financial goals, balancing risk and reward for maximum returns. Stay informed with real-time performance tracking.',
  },
  {
    title: 'Retirement Investment',
    image: retirementInvestmentImg,
    description:
      'Plan for your future with confidence. We offer strategies that ensure a secure, comfortable retirement with sustainable income sources and smart investments.',
  },
  {
    title: 'Risk Management Assessment',
    image: rmaImg,
    description:
      'Understand and mitigate risks in your portfolio. Our assessment tools help you identify potential vulnerabilities and protect your investments in uncertain times.',
  },
  {
    title: 'Wealth Planning',
    image: wealthPlanningImg,
    description:
      'Build a roadmap to financial independence. Our wealth planning services guide you through estate planning, tax strategies, and wealth preservation for generations.',
  },
];

function Services() {
  const [currentService, setCurrentService] = useState(0);

  const handleNextService = () => {
    setCurrentService((prev) => (prev === servicesData.length - 1 ? 0 : prev + 1));
  };

  const handlePrevService = () => {
    setCurrentService((prev) => (prev === 0 ? servicesData.length - 1 : prev - 1));
  };

  const { title, image, description } = servicesData[currentService];

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray p-6 font-sans rounded-lg">
      {/* Left Arrow */}
      <button
        className="text-beige hover:text-light-beige text-3xl mr-4 md:mr-8"
        onClick={handlePrevService}
      >
        <FaArrowLeft />
      </button>

      {/* Service Content */}
      <div className="flex flex-col md:flex-row items-center bg-light-beige shadow-lg rounded-lg overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full md:w-1/2 h-auto object-cover"
        />
        <div className="p-8 md:p-12">
          <h2 className="text-4xl font-bold text-beige">{title}</h2>
          <p className="mt-4 text-lg text-dark-blue">{description}</p>
        </div>
      </div>

      {/* Right Arrow */}
      <button
        className="text-beige hover:text-light-beige text-3xl ml-4 md:ml-8"
        onClick={handleNextService}
      >
        <FaArrowRight />
      </button>
    </div>
  );
}

export default Services;
