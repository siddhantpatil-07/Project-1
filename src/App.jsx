import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, LogOut, User, Trash2, CreditCard, Send, ArrowLeft, ArrowRight, Home, Utensils, Info, ShieldCheck } from 'lucide-react';

// --- Mock Data ---
const MENU_ITEMS = [
  { id: 1, name: 'ARK Classic Burger', price: 5.99, category: 'Burgers', image: '🍔' },
  { id: 2, name: 'Double Cheese Ark', price: 7.49, category: 'Burgers', image: '🍔' },
  { id: 3, name: 'Crispy Chicken Ark', price: 6.49, category: 'Burgers', image: '🍗' },
  { id: 4, name: 'Ark Gold Fries', price: 2.99, category: 'Sides', image: '🍟' },
  { id: 5, name: 'Onion Rings', price: 3.49, category: 'Sides', image: '🥯' },
  { id: 6, name: 'Mocha Chiller', price: 4.50, category: 'Drinks', image: '🥤' },
  { id: 7, name: 'Iced Americano', price: 3.00, category: 'Drinks', image: '☕' },
  { id: 8, name: 'Fresh Orange Juice', price: 3.99, category: 'Drinks', image: '🍹' },
];

const App = () => {
  // --- Local State (Replacing Firebase) ---
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login'); 
  const [cart, setCart] = useState([]);
  
  // Simulated database collections
  const [usersList, setUsersList] = useState([
    { id: '1', name: 'Admin Demo', email: 'admin@ark.com', lastLogin: new Date().toISOString() }
  ]);
  const [inquiries, setInquiries] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', message: 'Do you offer catering for events?', timestamp: new Date().toISOString() }
  ]);

  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  const [isSignup, setIsSignup] = useState(false);
  const [authStep, setAuthStep] = useState('email'); // 'email' or 'password'

  // --- Logic Functions ---
  const handleAuth = (e) => {
    e.preventDefault();
    
    // Step 1: Email Verification
    if (authStep === 'email') {
      if (authForm.email && authForm.email.includes('@')) {
        setAuthStep('password');
      } else {
        alert("Please enter a valid email address.");
      }
      return;
    }

    // Step 2: Final Login/Signup
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: authForm.email,
      name: isSignup ? authForm.name : authForm.email.split('@')[0],
      lastLogin: new Date().toISOString()
    };

    setUser(newUser);
    setUsersList(prev => [...prev, newUser]);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthStep('email');
    setAuthForm({ email: '', password: '', name: '' });
    setCurrentPage('login');
    setIsAdminAuthenticated(false);
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const submitInquiry = (formData) => {
    const newInquiry = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      timestamp: new Date().toISOString()
    };
    setInquiries(prev => [newInquiry, ...prev]);
    alert("Inquiry sent to ARK Cafe Admin!");
    setCurrentPage('home');
  };

  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2), [cart]);

  // --- UI Components ---
  const Navbar = () => (
    <nav style={styles.nav}>
      <div style={styles.navBrand} onClick={() => setCurrentPage('home')}>
        <div style={styles.logoCircle}>A</div>
        <span style={styles.brandText}>ARK CAFE</span>
      </div>
      <div style={styles.navLinks}>
        <button style={styles.navBtn} onClick={() => setCurrentPage('home')}><Home size={18}/> Home</button>
        <button style={styles.navBtn} onClick={() => setCurrentPage('menu')}><Utensils size={18}/> Menu</button>
        <button style={styles.navBtn} onClick={() => setCurrentPage('contact')}><Info size={18}/> Contact</button>
        <button style={styles.navBtn} onClick={() => setCurrentPage('admin')}><ShieldCheck size={18}/> Admin</button>
      </div>
      <div style={styles.navActions}>
        <div style={styles.cartBtn} onClick={() => setCurrentPage('cart')}>
          <ShoppingCart size={22} />
          {cart.length > 0 && <span style={styles.cartBadge}>{cart.length}</span>}
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout} title="Logout"><LogOut size={18} /></button>
      </div>
    </nav>
  );

  const LoginPage = () => (
    <div style={styles.authContainer}>
      <div style={styles.authCard}>
        <div style={styles.authLogo}>A</div>
        <h2 style={styles.authTitle}>{authStep === 'email' ? (isSignup ? 'Create Account' : 'Sign In') : 'Welcome Back'}</h2>
        <form onSubmit={handleAuth} style={styles.form}>
          {authStep === 'email' ? (
            <>
              <p style={styles.stepDesc}>Enter your email to continue</p>
              <input style={styles.input} type="email" placeholder="Email Address" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} required autoFocus />
              <button type="submit" style={styles.primaryBtn}>Next <ArrowRight size={18} style={{marginLeft: '8px'}}/></button>
            </>
          ) : (
            <>
              <div style={styles.emailDisplay} onClick={() => setAuthStep('email')}>
                <span>{authForm.email}</span>
                <button type="button" style={styles.editBtn}>Edit</button>
              </div>
              {isSignup && <input style={styles.input} placeholder="Full Name" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} required autoFocus />}
              <input style={styles.input} type="password" placeholder="Password" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} required autoFocus={!isSignup} />
              <div style={styles.btnGroup}>
                <button type="button" style={styles.secondaryBtn} onClick={() => setAuthStep('email')}><ArrowLeft size={18} /></button>
                <button type="submit" style={{...styles.primaryBtn, flex: 1}}>{isSignup ? 'Register' : 'Login'}</button>
              </div>
            </>
          )}
        </form>
        <p style={styles.toggleText}>
          {isSignup ? 'Already a member?' : "New to ARK Cafe?"}
          <span style={styles.toggleLink} onClick={() => { setIsSignup(!isSignup); setAuthStep('email'); }}>{isSignup ? ' Sign In' : ' Create Account'}</span>
        </p>
      </div>
    </div>
  );

  const HomePage = () => (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Freshly Brewed <br/>Daily Joy</h1>
        <p style={styles.heroSub}>Discover the secret behind our legendary ARK Burgers and artisanal coffee.</p>
        <button style={styles.ctaBtn} onClick={() => setCurrentPage('menu')}>Explore Menu</button>
      </div>
      <div style={styles.featureGrid}>
        <div style={styles.featureCard}><h3>🍟 Best Sides</h3><p>Golden fries made with premium Idaho potatoes.</p></div>
        <div style={styles.featureCard}><h3>☕ Master Roasts</h3><p>Beans sourced directly from ethical farmers.</p></div>
        <div style={styles.featureCard}><h3>🍔 Pure Beef</h3><p>100% fresh, never frozen flame-grilled patties.</p></div>
      </div>
    </div>
  );

  const MenuPage = () => {
    const [filter, setFilter] = useState('All');
    const filtered = filter === 'All' ? MENU_ITEMS : MENU_ITEMS.filter(i => i.category === filter);
    return (
      <div style={styles.page}>
        <h2 style={styles.pageTitle}>Our Signature Menu</h2>
        <div style={styles.filterBar}>
          {['All', 'Burgers', 'Sides', 'Drinks'].map(cat => (
            <button key={cat} style={{...styles.filterBtn, ...(filter === cat ? styles.filterBtnActive : {})}} onClick={() => setFilter(cat)}>{cat}</button>
          ))}
        </div>
        <div style={styles.menuGrid}>
          {filtered.map(item => (
            <div key={item.id} style={styles.menuCard}>
              <div style={styles.menuEmoji}>{item.image}</div>
              <h4 style={styles.menuItemName}>{item.name}</h4>
              <p style={styles.price}>${item.price.toFixed(2)}</p>
              <button style={styles.addBtn} onClick={() => addToCart(item)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CartPage = () => (
    <div style={styles.page}>
      <h2 style={styles.pageTitle}>Your Order</h2>
      {cart.length === 0 ? <div style={{textAlign: 'center'}}><p>Your cart is empty.</p><button style={styles.primaryBtn} onClick={() => setCurrentPage('menu')}>Add Items</button></div> : (
        <div style={styles.cartGrid}>
          <div style={styles.cartList}>
            {cart.map(i => (
              <div key={i.id} style={styles.cartItem}>
                <span style={{fontSize:'2rem'}}>{i.image}</span>
                <div style={{flex:1, marginLeft:'15px'}}><strong>{i.name}</strong><br/>${i.price}</div>
                <div style={styles.qtyControls}>
                  <button onClick={() => updateQuantity(i.id, -1)} style={styles.qtyBtn}>-</button>
                  <span style={{width:'30px', textAlign:'center'}}>{i.quantity}</span>
                  <button onClick={() => updateQuantity(i.id, 1)} style={styles.qtyBtn}>+</button>
                </div>
                <button onClick={() => removeFromCart(i.id)} style={styles.delBtn}><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
          <div style={styles.summaryCard}>
            <h3 style={{marginTop:0}}>Total Bill</h3>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}><span>Items</span><span>${cartTotal}</span></div>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}><span>Tax (5%)</span><span>${(cartTotal * 0.05).toFixed(2)}</span></div>
            <div style={{display:'flex', justifyContent:'space-between', fontWeight:'bold', fontSize:'1.2rem'}}><span>Grand Total</span><span>${(cartTotal * 1.05).toFixed(2)}</span></div>
            <button style={{...styles.primaryBtn, width:'100%', marginTop:'30px'}} onClick={() => {alert('Order Submitted!'); setCart([]); setCurrentPage('home');}}>
               <CreditCard size={18} style={{marginRight:'10px'}}/> Confirm Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const ContactPage = () => {
    const [msgForm, setMsgForm] = useState({ name: '', email: '', message: '' });
    return (
      <div style={styles.page}>
        <div style={styles.contactContainer}>
            <div style={{flex:1}}>
                <h2 style={styles.pageTitle}>Contact Us</h2>
                <p>Have a question or feedback? We'd love to hear from you.</p>
                <div style={{marginTop: '30px'}}>
                    <p>📍 45 Ark Avenue, Downtown</p>
                    <p>📞 (555) 123-4567</p>
                    <p>📧 support@arkcafe.com</p>
                </div>
            </div>
            <form style={{flex:1, display:'flex', flexDirection:'column', gap:'15px'}} onSubmit={(e) => { e.preventDefault(); submitInquiry(msgForm); }}>
                <input style={styles.input} placeholder="Your Name" value={msgForm.name} onChange={e => setMsgForm({...msgForm, name:e.target.value})} required />
                <input style={styles.input} type="email" placeholder="Email Address" value={msgForm.email} onChange={e => setMsgForm({...msgForm, email:e.target.value})} required />
                <textarea style={{...styles.input, height:'100px'}} placeholder="How can we help?" value={msgForm.message} onChange={e => setMsgForm({...msgForm, message:e.target.value})} required />
                <button style={styles.primaryBtn} type="submit">Send Message <Send size={18} style={{marginLeft: '10px'}}/></button>
            </form>
        </div>
      </div>
    );
  };

  const AdminPage = () => {
    if (!isAdminAuthenticated) {
      return (
        <div style={styles.authContainer}>
          <div style={styles.authCard}>
            <h2 style={styles.authTitle}>Admin Portal</h2>
            <input style={styles.input} type="password" placeholder="Admin Password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} />
            <button style={{...styles.primaryBtn, width:'100%', marginTop:'15px'}} onClick={() => adminPassword === 'ARKcafe' ? setIsAdminAuthenticated(true) : alert('Incorrect Password')}>Login to Dashboard</button>
          </div>
        </div>
      );
    }
    return (
      <div style={styles.page}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h2 style={styles.pageTitle}>Admin Dashboard</h2>
            <button style={styles.secondaryBtn} onClick={() => setIsAdminAuthenticated(false)}>Logout Admin</button>
        </div>
        <div style={styles.adminGrid}>
            <div style={styles.adminCard}>
                <h3>Registered Users ({usersList.length})</h3>
                <div style={styles.list}>
                    {usersList.map(u => (
                        <div key={u.id} style={styles.listItem}><strong>{u.name}</strong> <span>({u.email})</span></div>
                    ))}
                </div>
            </div>
            <div style={styles.adminCard}>
                <h3>Inquiries ({inquiries.length})</h3>
                <div style={styles.list}>
                    {inquiries.map(i => (
                        <div key={i.id} style={{...styles.listItem, flexDirection:'column', alignItems:'start'}}>
                            <strong>{i.name} ({i.email})</strong>
                            <p style={{margin:'5px 0', fontStyle:'italic'}}>"{i.message}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    );
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'login': return <LoginPage />;
      case 'home': return <HomePage />;
      case 'menu': return <MenuPage />;
      case 'cart': return <CartPage />;
      case 'contact': return <ContactPage />;
      case 'admin': return <AdminPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div style={styles.app}>
      {currentPage !== 'login' && <Navbar />}
      {renderPage()}
      <footer style={styles.footer}>© 2024 ARK Cafe • Quality & Freshness Since Day One</footer>
    </div>
  );
};

// --- Styles (Standard React Inline Styles) ---
const styles = {
  app: { 
    fontFamily: '"Inter", "Segoe UI", sans-serif', 
    backgroundColor: '#F8F9FA', 
    minHeight: '100vh', 
    color: '#27251F',
    display: 'flex',
    flexDirection: 'column'
  },
  nav: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: '12px 40px', 
    backgroundColor: 'white', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  navBrand: { display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '12px' },
  logoCircle: { 
    backgroundColor: '#FFBC0D', 
    color: '#BD0017', 
    width: '40px', 
    height: '40px', 
    borderRadius: '50%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontWeight: '900',
    fontSize: '1.4rem'
  },
  brandText: { fontWeight: '800', color: '#BD0017', fontSize: '1.4rem', letterSpacing: '0.5px' },
  navLinks: { display: 'flex', gap: '25px' },
  navBtn: { 
    border: 'none', 
    background: 'none', 
    cursor: 'pointer', 
    fontWeight: '600', 
    color: '#444',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.95rem',
    transition: 'color 0.2s'
  },
  navActions: { display: 'flex', alignItems: 'center', gap: '20px' },
  cartBtn: { position: 'relative', cursor: 'pointer', color: '#BD0017' },
  cartBadge: { 
    position: 'absolute', 
    top: '-8px', 
    right: '-10px', 
    background: '#BD0017', 
    color: 'white', 
    fontSize: '0.7rem', 
    padding: '2px 6px', 
    borderRadius: '10px',
    fontWeight: 'bold'
  },
  logoutBtn: { border: 'none', background: '#F0F0F0', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex' },
  
  authContainer: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #BD0017 0%, #FFBC0D 100%)' },
  authCard: { background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', width: '100%', maxWidth: '380px', textAlign: 'center' },
  authLogo: { background: '#FFBC0D', color: '#BD0017', width: '60px', height: '60px', borderRadius: '15px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' },
  authTitle: { fontSize: '1.8rem', marginBottom: '10px', color: '#BD0017' },
  stepDesc: { color: '#666', marginBottom: '25px', fontSize: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '14px', borderRadius: '10px', border: '1px solid #DDD', fontSize: '1rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
  emailDisplay: { display: 'flex', justifyContent: 'space-between', background: '#F8F9FA', padding: '12px', borderRadius: '10px', border: '1px solid #EEE', fontSize: '0.9rem', cursor: 'pointer' },
  editBtn: { background: 'none', border: 'none', color: '#BD0017', cursor: 'pointer', fontWeight: 'bold' },
  btnGroup: { display: 'flex', gap: '10px' },
  primaryBtn: { background: '#FFBC0D', color: '#27251F', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  secondaryBtn: { background: '#E9ECEF', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  toggleText: { marginTop: '25px', color: '#666', fontSize: '0.9rem' },
  toggleLink: { color: '#BD0017', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' },

  page: { padding: '40px 10%', flex: 1 },
  hero: { background: '#BD0017', color: 'white', padding: '80px 40px', borderRadius: '32px', textAlign: 'center', marginBottom: '50px', backgroundImage: 'radial-gradient(circle at top right, #D0001B, #BD0017)' },
  heroTitle: { fontSize: '3.5rem', marginBottom: '20px', lineHeight: '1.1', fontWeight: '900' },
  heroSub: { fontSize: '1.2rem', marginBottom: '35px', opacity: 0.9, maxWidth: '600px', margin: '0 auto 35px' },
  ctaBtn: { background: '#FFBC0D', color: '#BD0017', border: 'none', padding: '16px 45px', borderRadius: '40px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255,188,13,0.3)' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' },
  featureCard: { background: 'white', padding: '30px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  
  pageTitle: { fontSize: '2.2rem', color: '#27251F', marginBottom: '30px' },
  filterBar: { display: 'flex', gap: '15px', marginBottom: '40px', justifyContent: 'center' },
  filterBtn: { padding: '10px 25px', borderRadius: '30px', border: '1.5px solid #DDD', background: 'white', cursor: 'pointer', fontWeight: '600' },
  filterBtnActive: { background: '#BD0017', color: 'white', border: 'none' },
  menuGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' },
  menuCard: { background: 'white', padding: '25px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', transition: 'transform 0.2s' },
  menuEmoji: { fontSize: '4rem', marginBottom: '15px' },
  menuItemName: { fontSize: '1.1rem', marginBottom: '8px', color: '#333' },
  price: { fontWeight: '800', color: '#BD0017', fontSize: '1.3rem', margin: '15px 0' },
  addBtn: { background: '#FFBC0D', border: 'none', width: '100%', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem' },
  
  cartGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' },
  cartList: { background: 'white', padding: '25px', borderRadius: '24px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' },
  cartItem: { display: 'flex', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #F0F0F0' },
  qtyControls: { display: 'flex', gap: '5px', alignItems: 'center', background: '#F8F9FA', borderRadius: '10px', padding: '5px' },
  qtyBtn: { background: 'white', border: '1px solid #DDD', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  delBtn: { border: 'none', background: 'none', color: '#DC3545', cursor: 'pointer', marginLeft: '15px' },
  summaryCard: { background: 'white', padding: '30px', borderRadius: '24px', height: 'fit-content', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0' },
  
  contactContainer: { display: 'flex', gap: '60px', background: 'white', padding: '50px', borderRadius: '32px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' },
  adminGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  adminCard: { background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  listItem: { display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#F8F9FA', borderRadius: '10px', fontSize: '0.9rem' },
  footer: { textAlign: 'center', padding: '30px', background: '#27251F', color: '#888', fontSize: '0.9rem', marginTop: 'auto' }
};

export default App;