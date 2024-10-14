import React, { useState } from 'react';
import logo from './assets/logo.png';  
import Services from './components/Services';  // Importing the Services component

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    {
      name: 'home',
      content: (
        <div className="flex flex-col items-center justify-center h-screen bg-dark-blue text-white rounded-lg shadow-md p-6">
          <h1 className="text-5xl font-bold text-beige">GRAND PORTFOLIOS</h1>
          <p className="text-2xl mt-4">Welcome to a space where Your Wealth Is Prioritized</p>
          <p className="text-2xl mt-4">
            Empowering Investors to Achieve Financial Freedom through Tailored Investment Strategies.
          </p>
          <ul className="mt-8 space-y-4">
            <li>✔️ Personalized Investment Portfolios</li>
            <li>✔️ Real-Time Market Data & Analysis</li>
            <li>✔️ Transparent Fee Structure</li>
            <li>✔️ Dedicated Customer Support</li>
          </ul>
          <button 
            className="bg-beige hover:bg-gray text-dark-blue font-bold py-2 px-4 rounded mt-8"
            onClick={() => setActiveTab('services')} // Learn More triggers Services
          >
            Learn More
          </button>
        </div>
      ),
    },
    {
      name: 'about us',
      content: (
        <div className="flex flex-col items-center justify-center h-screen bg-white text-dark-blue rounded-lg shadow-md p-6">
          <h1 className="text-5xl font-bold text-beige">About Us</h1>
          <p className="text-2xl mt-4">We are a team of experienced investors and financial experts.</p>
          <p className="text-2xl mt-4">
            Our mission is to provide the best investment solutions for our clients.
          </p>
          <p className="text-xl mt-6 italic">
            Our vision is to be the leading provider of investment solutions, committed to delivering lasting value for our clients and partners.
          </p>
        </div>
      ),
    },
    {
      name: 'services',
      content: (
        <>
          <Services />
        </>
      ),
    },
    {
      name: 'clients',
      content: (
        <div className="flex flex-col items-center justify-center h-screen bg-white text-dark-blue rounded-lg shadow-md p-6">
          <h1 className="text-5xl font-bold text-beige">Our Clients & Affiliates</h1>
          <p className="text-2xl mt-4">
            We are proud to partner with a wide range of corporate and individual clients, helping them achieve their financial goals.
          </p>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-12">
            <div className="flex flex-col items-center">
              <h2 className="text-6xl font-bold text-beige">200+</h2>
              <p className="text-xl text-dark-blue mt-2">Corporate Clients</p>
            </div>

            <div className="flex flex-col items-center">
              <h2 className="text-6xl font-bold text-beige">500+</h2>
              <p className="text-xl text-dark-blue mt-2">Individual Clients</p>
            </div>

            <div className="flex flex-col items-center">
              <h2 className="text-6xl font-bold text-beige">50+</h2>
              <p className="text-xl text-dark-blue mt-2">Affiliates</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8">
            <p className="text-xl">Interested in becoming our corporate or individual client?</p>
            <button
              className="bg-beige hover:bg-gray text-dark-blue font-bold py-2 px-6 rounded mt-4"
              onClick={() => setActiveTab('contact us')} // Contact Us triggers the Contact Us section
            >
              Contact Us
            </button>
          </div>
        </div>
      ),
    },
    {
      name: 'contact us',
      content: (
        <div className="flex flex-col items-center justify-center h-screen bg-light-beige text-dark-blue rounded-lg shadow-md p-6">
          <h1 className="text-5xl font-bold text-beige">Contact Us</h1>
          <form className="w-full max-w-lg mt-8">
            <div className="mb-4">
              <label className="block text-dark-blue text-lg font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                id="name"
                type="text"
                placeholder="Your Name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-dark-blue text-lg font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                id="email"
                type="email"
                placeholder="Your Email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-dark-blue text-lg font-bold mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                id="message"
                placeholder="Your Message"
              />
            </div>
            <button
              className="bg-beige hover:bg-gray text-dark-blue font-bold py-2 px-4 rounded"
              type="submit"
            >
              Send Message
            </button>
          </form>
          <p className="text-dark-blue text-lg mt-4">
            Address: Greenwood Gearhart 26 East Center Street Fayetteville, Arkansas 72701<br />
            Phone: (415) 534-6876<br />
            Office Hours: Monday - Friday, 9 AM - 6 PM
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <nav className="flex flex-col md:flex-row justify-between items-center bg-dark-blue py-4 shadow-lg px-8 space-y-4 md:space-y-0">
        <img src={logo} alt="Grand Portfolios Logo" className="w-24 h-auto" />
        <div className="flex flex-wrap justify-center space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`text-light-beige hover:bg-beige hover:text-dark-blue font-bold py-2 px-4 rounded ${
                activeTab === tab.name ? 'bg-beige text-dark-blue' : ''
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.name.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>
      <div className="p-6">
        {tabs.find((tab) => tab.name === activeTab)?.content}
      </div>
      <footer className="bg-light-beige py-4 mt-12 rounded-t-lg">
        <div className="text-center text-dark-blue">
          © 2024 Grand Portfolios. All Rights Reserved.
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          <a href="#" className="text-dark-blue">LinkedIn</a>
          <a href="#" className="text-dark-blue">Twitter</a>
          <a href="#" className="text-dark-blue">Facebook</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
