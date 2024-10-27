import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaArrowDown, FaSignOutAlt, FaChartLine, FaBars } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ClientView() {
  const navigate = useNavigate();
  const [portfolioValue, setPortfolioValue] = useState(250000);
  const [goldAllocation, setGoldAllocation] = useState(75000);
  const [goldPrice, setGoldPrice] = useState(1800);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = sessionStorage.getItem('user_name');
    if (name) {
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const goldPriceHistory = [1750, 1780, 1790, 1800, 1820, 1810, 1800, 1730, 1799, 1803];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const lineChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October"],
    datasets: [
      {
        label: "Gold Price",
        data: goldPriceHistory,
        borderColor: "#F4C46C",
        backgroundColor: "rgba(244, 196, 108, 0.1)",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            return formatCurrency(context.raw);
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray text-dark-blue font-sans">
      {/* Responsive Header */}
      <header className="bg-dark-blue text-white p-4">
        <div className="container mx-auto flex flex-col md:flex-row md:justify-between items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
          <div className="flex flex-wrap justify-center space-x-2 md:space-x-4">
            <button className="flex items-center text-xs md:text-sm px-3 py-1 md:px-4 md:py-2 bg-beige text-dark-blue font-bold rounded hover:bg-light-beige">
              Statement Summary
            </button>
            <button className="flex items-center text-xs md:text-sm px-3 py-1 md:px-4 md:py-2 bg-beige text-dark-blue font-bold rounded hover:bg-light-beige">
              Withdrawals
            </button>
            <button onClick={handleLogout} className="flex items-center text-xs md:text-sm px-3 py-1 md:px-4 md:py-2 border border-white rounded hover:bg-blue">
              <FaSignOutAlt className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        {/* Portfolio Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white text-dark-blue p-4 rounded shadow border">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-sm font-medium">Total Portfolio Value</h2>
              <FaChartLine className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{formatCurrency(portfolioValue)}</div>
          </div>

          <div className="bg-white text-dark-blue p-4 rounded shadow border">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-sm font-medium">Gold Allocation</h2>
              <FaBars className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{formatCurrency(goldAllocation)}</div>
            <p className="text-xs text-gray-500">
              {((goldAllocation / portfolioValue) * 100).toFixed(2)}% of portfolio
            </p>
          </div>

          <div className="bg-white text-dark-blue p-4 rounded shadow border">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-sm font-medium">Current Gold Price</h2>
              <span className="h-4 w-4 text-gray-400">$</span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(goldPrice)}</div>
            <p className="text-xs text-gray-500">per troy ounce</p>
          </div>

          <div className="bg-white text-dark-blue p-4 rounded shadow border">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-sm font-medium">24h Change</h2>
              {goldPrice > goldPriceHistory[goldPriceHistory.length - 2] ? (
                <FaArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <FaArrowDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="text-2xl font-bold">
              {((goldPrice - goldPriceHistory[goldPriceHistory.length - 2]) / goldPriceHistory[goldPriceHistory.length - 2] * 100).toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Gold Price Trend - Responsive */}
        <div className="bg-light-beige p-4 rounded shadow border flex justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-lg font-medium mb-4 text-center text-dark-blue">Gold Price Trend</h2>
            <div className="h-64">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-light-beige p-4 rounded shadow border text-dark-blue">
          <h2 className="text-lg font-medium mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Bought Gold</p>
                <p className="text-sm text-blue">2023-10-25</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-500">+$5,000</p>
                <p className="text-sm text-gray">2.78 oz</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Sold Gold</p>
                <p className="text-sm text-blue">2023-10-20</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-red-500">-$3,500</p>
                <p className="text-sm text-gray">1.94 oz</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invest More in Gold Card */}
        <div className="bg-dark-blue text-white p-6 rounded shadow text-center">
          <h3 className="text-2xl font-bold mb-2">Invest More in Gold</h3>
          <p className="mb-4">Take advantage of the current market conditions and strengthen your portfolio.</p>
          <button className="px-6 py-2 bg-beige text-dark-blue font-bold rounded-lg hover:bg-light-beige">
            Invest Now
          </button>
        </div>
      </main>
    </div>
  );
}
