import { useState, useEffect, useMemo } from 'react';

export default function App() {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedYear, setSelectedYear] = useState('All');
  const [expandedImage, setExpandedImage] = useState(null);
  const [reviewFilter, setReviewFilter] = useState('All');
  
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('auth') === 'true');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const availableYears = useMemo(() => {
    const years = new Set();
    orders.forEach(order => {
      if (order.created_at) {
        years.add(new Date(order.created_at).getFullYear().toString());
      }
      if (order.preferred_date) {
        const year = order.preferred_date.split('-')[0];
        if (year && year.length === 4) years.add(year);
      }
    });
    years.add(new Date().getFullYear().toString());
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [orders]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchReviews();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/orders/`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/reviews/?limit=100`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete');
      fetchReviews();
      alert("Review deleted successfully!");
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete review");
    }
  };
  const handleToggleVisibility = async (reviewId, currentVisibility) => {
    try {
      const newVisibility = currentVisibility === false ? true : false; // Default is true if undefined
      
      // Optimistic update for instant speed
      setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, is_visible: newVisibility } : r));
      if (newVisibility === true) {
        setReviewFilter('Shown');
      } else {
        setReviewFilter('Hidden');
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/reviews/${reviewId}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visible: newVisibility })
      });
      if (!response.ok) {
        fetchReviews(); // Revert on error
        throw new Error('Failed to toggle visibility');
      }
      // Silently fetch in background to ensure sync without blocking UI
      fetchReviews();
    } catch (err) {
      console.error("Error toggling review visibility:", err);
    }
  };


  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update');
      
      fetchOrders();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('auth');
    setIsAuthenticated(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'blosoom2024';
    if (password === correctPassword) {
      sessionStorage.setItem('auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Incorrect password');
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6 font-inter">
        <div className="max-w-md w-full bg-white border border-border-soft rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-10 text-center">
          <h1 className="text-3xl font-playfair italic text-charcoal mb-2">Blosoom Reverie</h1>
          <p className="text-xs uppercase tracking-[3px] text-rose-muted font-medium mb-8">Admin Dashboard</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-ivory-soft border border-border-soft text-charcoal px-4 py-3 rounded-xl focus:outline-none focus:border-rose-muted transition-colors text-center placeholder:text-text-sand/50"
                autoFocus
              />
              {loginError && <p className="text-red-500 text-xs mt-2">{loginError}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-charcoal text-ivory text-sm font-medium py-3 rounded-xl hover:bg-charcoal-deep transition-all duration-300 shadow-sm"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="text-xl font-light tracking-widest text-rose uppercase">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="text-xl font-light text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory font-inter">
      {/* Navbar/Header */}
      <nav className="bg-charcoal text-ivory py-6 px-8 border-b border-charcoal-mid flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="font-playfair text-2xl italic tracking-wide">
          Blosoom Reverie
        </div>
        <div className="flex items-center gap-6">
          <div className="text-[10px] tracking-[3px] text-rose-muted uppercase font-medium hidden sm:block">
            Admin Dashboard
          </div>
          <button 
            onClick={handleLogout}
            className="text-[10px] tracking-[2px] uppercase font-semibold text-text-sand hover:text-ivory transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-16 px-6 sm:px-8 lg:px-12">
        <div className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between border-b border-border-soft pb-6 gap-6">
          <div>
            <h1 className="text-4xl font-playfair italic text-charcoal mb-3">Incoming Orders</h1>
            <p className="text-sm font-light text-text-muted leading-relaxed max-w-2xl">
              Manage your custom bouquet requests. Review the occasions, preferences, and confirm when an order is completed.
            </p>
          </div>
          <div className="text-xs uppercase tracking-[2px] font-semibold text-rose bg-blush px-4 py-2 rounded-full inline-block">
            {orders.filter(o => o.status !== 'done').length} Pending
          </div>
        </div>
        
        <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-border-soft">
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`pb-4 text-[11px] uppercase tracking-[2px] font-semibold transition-colors relative ${activeTab === 'pending' ? 'text-charcoal' : 'text-text-sand hover:text-charcoal'}`}
            >
              Pending ({orders.filter(o => o.status !== 'done' && o.status !== 'completed').length})
              {activeTab === 'pending' && <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-charcoal"></span>}
            </button>
            <button 
              onClick={() => setActiveTab('done')}
              className={`pb-4 text-[11px] uppercase tracking-[2px] font-semibold transition-colors relative ${activeTab === 'done' ? 'text-charcoal' : 'text-text-sand hover:text-charcoal'}`}
            >
              Completed ({orders.filter(o => o.status === 'done' || o.status === 'completed').length})
              {activeTab === 'done' && <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-charcoal"></span>}
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-[11px] uppercase tracking-[2px] font-semibold transition-colors relative ${activeTab === 'reviews' ? 'text-charcoal' : 'text-text-sand hover:text-charcoal'}`}
            >
              Reviews ({reviews.length})
              {activeTab === 'reviews' && <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-charcoal"></span>}
            </button>
          </div>

          <div className="pb-3 flex items-center gap-3">
            <label htmlFor="year-select" className="text-[10px] uppercase tracking-[2px] font-semibold text-text-sand">Year</label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-ivory-soft text-sm font-medium text-charcoal border border-border-soft rounded-lg px-4 py-1.5 outline-none focus:border-rose-muted transition-colors cursor-pointer appearance-none shadow-sm"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%232C1A1A%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto', paddingRight: '2.5rem' }}
            >
              <option value="All">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        
        {(() => {
          if (activeTab === 'reviews') {
            const shownCount = reviews.filter(r => r.is_visible !== false).length;
            const hiddenCount = reviews.length - shownCount;

            if (reviews.length === 0) {
              return (
                <div className="py-20 text-center border border-border-soft rounded-2xl bg-ivory-soft">
                  <p className="text-text-dim font-light italic text-lg font-playfair">No reviews found.</p>
                </div>
              );
            }
            return (
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-[1.5px] font-semibold">
                  <button 
                    onClick={() => setReviewFilter('All')}
                    className={`px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-all hover:shadow-md ${reviewFilter === 'All' ? 'bg-charcoal text-ivory' : 'bg-white border border-border-soft text-charcoal'}`}>
                    Total <span className={`px-2 py-0.5 rounded-md ${reviewFilter === 'All' ? 'bg-ivory/20 text-ivory' : 'bg-ivory-soft text-charcoal-deep'}`}>{reviews.length}</span>
                  </button>
                  <button 
                    onClick={() => setReviewFilter('Shown')}
                    className={`px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-all hover:shadow-md ${reviewFilter === 'Shown' ? 'bg-charcoal text-ivory' : 'bg-white border border-charcoal/30 text-charcoal'}`}>
                    Shown <span className={`px-2 py-0.5 rounded-md ${reviewFilter === 'Shown' ? 'bg-ivory/20 text-ivory' : 'bg-charcoal/10 text-charcoal'}`}>{shownCount}</span>
                  </button>
                  <button 
                    onClick={() => setReviewFilter('Hidden')}
                    className={`px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-all hover:shadow-md ${reviewFilter === 'Hidden' ? 'bg-charcoal text-ivory opacity-100 grayscale-0' : 'bg-white border border-border-soft text-text-dim grayscale opacity-80'}`}>
                    Hidden <span className={`px-2 py-0.5 rounded-md ${reviewFilter === 'Hidden' ? 'bg-ivory/20 text-ivory' : 'bg-ivory-soft'}`}>{hiddenCount}</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.filter(r => {
                  if (reviewFilter === 'Shown') return r.is_visible !== false;
                  if (reviewFilter === 'Hidden') return r.is_visible === false;
                  return true;
                }).map((review) => {
                  const isVisible = review.is_visible !== false;
                  return (
                  <div key={review._id} className={`bg-white border border-border-soft rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all ${!isVisible ? 'opacity-50 grayscale-[50%]' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-playfair text-2xl italic text-charcoal mb-2">
                          {review.name}
                          {!isVisible && <span className="ml-2 text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full not-italic tracking-wider uppercase">Hidden</span>}
                        </h3>
                        <div className="text-3xl leading-none flex gap-[2px] items-center">
                          {[1,2,3,4,5].map(s => {
                            const val = review.rating;
                            const full = val >= s;
                            const half = !full && val >= s - 0.5;
                            return (
                              <span key={s} className="relative inline-block" style={{ color: '#E8DDD5' }}>
                                ★
                                {(full || half) && (
                                  <span className="absolute left-0 top-0 overflow-hidden"
                                    style={{ color: '#C4968A', width: full ? '100%' : '50%' }}>★</span>
                                )}
                              </span>
                            );
                          })}
                          <span className="text-sm text-text-sand ml-2 font-medium self-center">{review.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <button onClick={() => handleDeleteReview(review._id)} className="border border-[#8C4A40]/30 text-[#8C4A40] hover:bg-[#8C4A40] hover:text-white px-3 py-1.5 rounded-md text-[10px] uppercase tracking-[1px] transition-colors font-medium">Delete</button>
                        <button onClick={() => handleToggleVisibility(review._id, review.is_visible)} className="border border-charcoal/30 text-charcoal hover:bg-charcoal hover:text-white px-3 py-1.5 rounded-md text-[10px] uppercase tracking-[1px] transition-colors font-medium">
                          {isVisible ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-light text-text-muted italic flex-1">"{review.message}"</p>
                    {review.image_url && (
                      <div className="mt-6 mb-2">
                        <div 
                          className="relative h-48 sm:h-56 w-full rounded-xl overflow-hidden group/img cursor-pointer"
                          onClick={() => setExpandedImage(review.image_url.startsWith('data:') ? review.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${review.image_url}`)}
                        >
                          <img 
                            src={review.image_url.startsWith('data:') ? review.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${review.image_url}`} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" 
                            alt="Review" 
                            loading="lazy"
                          />
                          <div className="absolute inset-0 border border-black/5 rounded-xl pointer-events-none"></div>
                        </div>
                      </div>
                    )}
                    <div className="text-[10px] text-text-sand pt-4 border-t border-border-soft mt-auto uppercase tracking-[1px]">
                      {new Date(review.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
            );
          }

          let displayedOrders = activeTab === 'pending' 
            ? orders.filter(o => o.status !== 'done' && o.status !== 'completed')
            : orders.filter(o => o.status === 'done' || o.status === 'completed');

          if (selectedYear !== 'All') {
            displayedOrders = displayedOrders.filter(o => {
              const createYear = o.created_at ? new Date(o.created_at).getFullYear().toString() : null;
              const prefYear = o.preferred_date ? o.preferred_date.split('-')[0] : null;
              return createYear === selectedYear || prefYear === selectedYear;
            });
          }

          if (displayedOrders.length === 0) {
            return (
              <div className="py-20 text-center border border-border-soft rounded-2xl bg-ivory-soft">
                <p className="text-text-dim font-light italic text-lg font-playfair">No {activeTab} orders found.</p>
              </div>
            );
          }

          return (
            <div className="space-y-6">
              {displayedOrders.map((order) => (
              <div key={order._id} className="bg-white border border-border-soft rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
                <div className="flex flex-col lg:flex-row gap-8 justify-between">
                  {/* Left Column: Customer Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-5">
                      <h2 className="text-2xl font-playfair italic text-charcoal">{order.name}</h2>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold 
                        ${order.status === 'done' || order.status === 'completed' ? 'bg-charcoal text-ivory' : 'bg-rose text-white'}`}>
                        {order.status || 'pending'}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-text-dim">
                        <svg className="w-4 h-4 text-rose-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <span className="whitespace-nowrap">{order.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-text-dim">
                        <svg className="w-4 h-4 text-rose-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        <span className="whitespace-nowrap">{order.contact}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-text-dim">
                        <svg className="w-4 h-4 text-rose-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>{new Date(order.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Order Specs */}
                  <div className="flex-[1.5] bg-ivory-soft rounded-xl p-5 border border-border-soft">
                    <h3 className="text-[10px] uppercase tracking-[2px] font-semibold text-text-sand mb-4">Order Specifications</h3>
                    <div className="grid grid-cols-2 gap-y-5 gap-x-6">
                      <div>
                        <span className="text-rose-muted uppercase tracking-wider text-[9px] block mb-1">Occasion</span>
                        <span className="text-charcoal text-sm">{order.occasion}</span>
                      </div>
                      <div>
                        <span className="text-rose-muted uppercase tracking-wider text-[9px] block mb-1">Collection</span>
                        <span className="text-charcoal text-sm">{order.collection_id || 'Custom Signature'}</span>
                      </div>
                      <div>
                        <span className="text-rose-muted uppercase tracking-wider text-[9px] block mb-1">Photos Included</span>
                        <span className="text-charcoal text-sm">{order.photo_count}</span>
                      </div>
                      {order.budget_range && (
                        <div>
                          <span className="text-rose-muted uppercase tracking-wider text-[9px] block mb-1">Budget</span>
                          <span className="text-charcoal text-sm">{order.budget_range}</span>
                        </div>
                      )}
                      {order.preferred_date && (
                        <div>
                          <span className="text-rose-muted uppercase tracking-wider text-[9px] block mb-1">Preferred Date</span>
                          <span className="text-charcoal text-sm">{order.preferred_date}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-col justify-end lg:items-end gap-3 min-w-[160px]">
                    {(order.status === 'pending' || !order.status) && (
                      <button
                        onClick={() => handleStatusChange(order._id, 'done')}
                        className="w-full lg:w-auto text-sm font-medium bg-charcoal text-ivory rounded-xl px-6 py-3 hover:bg-charcoal-deep transition-all duration-300 shadow-sm"
                      >
                        Mark as Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
          );
        })()}
      </main>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setExpandedImage(null)}
        >
          <img 
            src={expandedImage} 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default" 
            alt="Expanded Review"
            onClick={(e) => e.stopPropagation()}
          />
          <button 
            className="absolute top-6 right-6 text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors"
            onClick={() => setExpandedImage(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
