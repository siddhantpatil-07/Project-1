import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, LogOut, User, Trash2, CreditCard, Send, ArrowLeft, ArrowRight, 
  Home, Utensils, Info, ShieldCheck, Star, Clock, MapPin, Lock, CheckCircle, 
  Package, Leaf, Coffee, Pizza, Bike, Store, UtensilsCrossed 
} from 'lucide-react';

// --- Expanded Mock Data ---
const MENU_ITEMS = [
  // Burgers
  { id: 1, name: 'ARK Classic Burger', price: 299, category: 'Burgers', image: '🍔', desc: 'Flame-grilled beef with secret sauce.', veg: false },
  { id: 2, name: 'Double Cheese Ark', price: 449, category: 'Burgers', image: '🍔', desc: 'Two layers of melted cheddar joy.', veg: false },
  { id: 3, name: 'Crispy Chicken Ark', price: 349, category: 'Burgers', image: '🍗', desc: 'Southern-style buttermilk chicken.', veg: false },
  
  // Veg Specials
  { id: 9, name: 'Paneer Crunch Burger', price: 279, category: 'Veg Special', image: '🧀', desc: 'Spicy breaded paneer patty with peri-peri mayo.', veg: true },
  { id: 10, name: 'Veggie Supreme', price: 229, category: 'Veg Special', image: '🥦', desc: 'Crispy vegetable patty with fresh lettuce.', veg: true },
  { id: 11, name: 'Aloo Tikki Gold', price: 149, category: 'Veg Special', image: '🥔', desc: 'The classic Indian spiced potato patty burger.', veg: true },
  
  // Pizzas (New)
  { id: 13, name: 'Classic Margherita', price: 399, category: 'Pizza', image: '🍕', desc: 'Fresh basil, mozzarella, and tomato sauce.', veg: true },
  { id: 14, name: 'Farmhouse Pizza', price: 499, category: 'Pizza', image: '🍕', desc: 'Loaded with capsicum, onion, mushroom, and corn.', veg: true },
  { id: 15, name: 'Peri Peri Chicken Pizza', price: 549, category: 'Pizza', image: '🍕', desc: 'Spicy chicken, olives, and jalapenos.', veg: false },
  { id: 16, name: 'Paneer Makhani Pizza', price: 529, category: 'Pizza', image: '🍕', desc: 'Indian style paneer with makhani gravy.', veg: true },

  // Coffee (New)
  { id: 17, name: 'Double Espresso', price: 129, category: 'Coffee', image: '☕', desc: 'Strong and bold double shot espresso.', veg: true },
  { id: 18, name: 'Classic Cafe Latte', price: 219, category: 'Coffee', image: '☕', desc: 'Espresso with steamed milk and a touch of foam.', veg: true },
  { id: 19, name: 'Caramel Macchiato', price: 259, category: 'Coffee', image: '☕', desc: 'Vanilla and caramel blended with espresso.', veg: true },
  { id: 20, name: 'Cappuccino', price: 209, category: 'Coffee', image: '☕', desc: 'Classic frothy coffee with cocoa sprinkle.', veg: true },

  // Sides
  { id: 4, name: 'Ark Gold Fries', price: 149, category: 'Sides', image: '🍟', desc: 'World-famous thin-cut golden fries.', veg: true },
  { id: 5, name: 'Onion Rings', price: 199, category: 'Sides', image: '🥯', desc: 'Hand-battered sweet onion rings.', veg: true },
  { id: 12, name: 'Veg Pizza Wrap', price: 189, category: 'Sides', image: '🌯', desc: 'Tortilla filled with cheese and corn.', veg: true },

  // Cold Drinks
  { id: 6, name: 'Mocha Chiller', price: 249, category: 'Drinks', image: '🥤', desc: 'Blended coffee with rich chocolate.', veg: true },
  { id: 8, name: 'Fresh Orange Juice', price: 219, category: 'Drinks', image: '🍹', desc: '100% freshly squeezed juice.', veg: true },
];

// --- Shared Components ---

const InteractiveBtn = ({ children, style, onClick, type = "button", disabled = false }) => {
  const [isHover, setIsHover] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <button 
      type={type}
      disabled={disabled}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => { setIsHover(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
      style={{
        ...style,
        transform: isPressed ? 'scale(0.96)' : (isHover && !disabled ? 'translateY(-2px)' : 'translateY(0)'),
        filter: isHover && !disabled ? 'brightness(1.05)' : 'brightness(1)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        outline: 'none',
      }}
    >
      {children}
    </button>
  );
};

const Navbar = ({ currentPage, setCurrentPage, cartCount, onLogout }) => (
  <nav style={styles.nav}>
    <div style={styles.navBrand} onClick={() => setCurrentPage('home')}>
      <div style={styles.logoCircle}>A</div>
      <span style={styles.brandText}>ARK CAFE</span>
    </div>
    <div style={styles.navLinks}>
      {[
        { id: 'home', label: 'Home', icon: Home },
        { id: 'menu', label: 'Menu', icon: Utensils },
        { id: 'contact', label: 'Contact', icon: Info },
        { id: 'admin', label: 'Admin', icon: ShieldCheck }
      ].map(link => (
        <button 
          key={link.id}
          style={{
            ...styles.navBtn, 
            color: currentPage === link.id ? '#BD0017' : '#555',
            fontWeight: currentPage === link.id ? '800' : '600',
            borderBottom: currentPage === link.id ? '2px solid #BD0017' : '2px solid transparent'
          }} 
          onClick={() => setCurrentPage(link.id)}
        >
          <link.icon size={16} />
          <span style={{textTransform: 'capitalize'}}>{link.label}</span>
        </button>
      ))}
    </div>
    <div style={styles.navActions}>
      <div style={styles.cartBtn} onClick={() => setCurrentPage('cart')}>
        <ShoppingCart size={22} />
        {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
      </div>
      <button style={styles.logoutBtn} onClick={onLogout} title="Logout"><LogOut size={18} /></button>
    </div>
  </nav>
);

const App = () => {
  // --- Persistent User State ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ark_cafe_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentPage, setCurrentPage] = useState(user ? 'home' : 'login'); 
  const [cart, setCart] = useState([]);
  const [menuFilter, setMenuFilter] = useState('All');
  
  // Data State
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('ark_cafe_all_users');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [inquiries, setInquiries] = useState(() => {
    const saved = localStorage.getItem('ark_cafe_inquiries');
    return saved ? JSON.parse(saved) : [];
  });

  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  const [isSignup, setIsSignup] = useState(false);
  const [authStep, setAuthStep] = useState('email'); 
  const [orderStatus, setOrderStatus] = useState('none');
  const [orderType, setOrderType] = useState('delivery'); // delivery, dinein, takeaway

  // Sync data to localStorage
  useEffect(() => {
    localStorage.setItem('ark_cafe_all_users', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('ark_cafe_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  const handleAuth = (e) => {
    e.preventDefault();
    if (authStep === 'email') {
      if (authForm.email && authForm.email.includes('@')) {
        setAuthStep('password');
      } else { alert("Please enter a valid email."); }
      return;
    }
    
    const loggedUser = { 
      id: Math.random().toString(36).substr(2, 9), 
      email: authForm.email, 
      name: isSignup ? authForm.name : authForm.email.split('@')[0],
      loginTime: new Date().toISOString()
    };
    
    setUser(loggedUser);
    localStorage.setItem('ark_cafe_user', JSON.stringify(loggedUser));
    
    if (!usersList.some(u => u.email === loggedUser.email)) {
      setUsersList(prev => [...prev, loggedUser]);
    }
    
    setCurrentPage('home'); 
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ark_cafe_user');
    setAuthStep('email');
    setAuthForm({ email: '', password: '', name: '' });
    setCurrentPage('login');
    setIsAdminAuthenticated(false);
  };

  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (adminPassword === 'ARKcafe') { 
      setIsAdminAuthenticated(true); 
      setAdminPassword(''); 
    } else { 
      alert('Access Denied: Incorrect Admin Password'); 
    }
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const startOrderTracking = () => {
    setCurrentPage('tracking'); 
    setOrderStatus('accepted'); 
    setCart([]); 
    setTimeout(() => setOrderStatus('preparing'), 4000);
  };

  const filteredMenu = useMemo(() => 
    menuFilter === 'All' ? MENU_ITEMS : MENU_ITEMS.filter(i => i.category === menuFilter),
  [menuFilter]);

  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);

  // --- Page Components ---
  const renderPage = () => {
    switch(currentPage) {
      case 'login': return (
        <div style={styles.authContainer}>
          <div style={styles.authCard}>
            <div style={styles.authLogo}>A</div>
            <h2 style={styles.authTitle}>{authStep === 'email' ? (isSignup ? 'Create Account' : 'Welcome Back') : 'Password'}</h2>
            <form onSubmit={handleAuth} style={styles.form}>
              {authStep === 'email' ? (
                <>
                  <p style={styles.stepDesc}>Enter your email to continue to ARK Cafe</p>
                  <input style={styles.input} type="email" placeholder="Email Address" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} required autoFocus />
                  <InteractiveBtn type="submit" style={styles.primaryBtn}>Next <ArrowRight size={18}/></InteractiveBtn>
                </>
              ) : (
                <>
                  <div style={styles.emailDisplay} onClick={() => setAuthStep('email')}><span>{authForm.email}</span><span style={styles.editBtn}>Edit</span></div>
                  {isSignup && <input style={styles.input} placeholder="Full Name" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} required autoFocus />}
                  <input style={styles.input} type="password" placeholder="Password" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} required autoFocus={!isSignup} />
                  <div style={styles.btnGroup}>
                    <InteractiveBtn onClick={() => setAuthStep('email')} style={styles.secondaryBtn}><ArrowLeft size={18} /></InteractiveBtn>
                    <InteractiveBtn type="submit" style={{...styles.primaryBtn, flex: 1}}>{isSignup ? 'Register' : 'Login'}</InteractiveBtn>
                  </div>
                </>
              )}
            </form>
            <p style={styles.toggleText}>{isSignup ? 'Already a member?' : "New user?"} <span style={styles.toggleLink} onClick={() => setIsSignup(!isSignup)}>{isSignup ? ' Sign In' : ' Sign Up'}</span></p>
          </div>
        </div>
      );
      case 'home': return (
        <div style={styles.page}>
          <div style={styles.hero}>
            <div style={{flex: 1}}>
              <h1 style={styles.heroTitle}>Quality You <br/><span style={{color: '#FFBC0D'}}>Can Taste.</span></h1>
              <p style={styles.heroSub}>Premium burgers, artisanal pizzas, and hand-roasted coffee served with love since 2024.</p>
              <div style={{display: 'flex', gap: '15px'}}>
                <InteractiveBtn style={styles.ctaBtn} onClick={() => setCurrentPage('menu')}>Order Menu</InteractiveBtn>
                <InteractiveBtn style={{...styles.secondaryBtn, padding: '15px 30px'}} onClick={() => setCurrentPage('contact')}>Contact Us</InteractiveBtn>
              </div>
            </div>
            <div style={styles.heroImage}>🍔</div>
          </div>
          <div style={styles.featureGrid}>
            <div style={styles.featureCard}><Star size={32} color="#FFBC0D"/><h3 style={{margin: '10px 0'}}>Voted #1</h3><p>Best cafe experience in the city.</p></div>
            <div style={styles.featureCard}><Clock size={32} color="#BD0017"/><h3 style={{margin: '10px 0'}}>15 Mins Prep</h3><p>Fresh food, fast service.</p></div>
            <div style={styles.featureCard}><Leaf size={32} color="#4CAF50"/><h3 style={{margin: '10px 0'}}>Pure Veg Options</h3><p>Delicious non-meat alternatives.</p></div>
          </div>
        </div>
      );
      case 'menu': return (
        <div style={styles.page}>
          <div style={styles.menuHeader}>
              <h2 style={styles.pageTitle}>Explore Our Menu</h2>
              <div style={styles.filterBar}>
                {['All', 'Veg Special', 'Burgers', 'Pizza', 'Coffee', 'Sides', 'Drinks'].map(cat => (
                  <button key={cat} style={{...styles.filterBtn, ...(menuFilter === cat ? styles.filterBtnActive : {})}} onClick={() => setMenuFilter(cat)}>{cat}</button>
                ))}
              </div>
          </div>
          <div style={styles.menuGrid}>
            {filteredMenu.map(item => (
              <div key={item.id} style={styles.menuCard}>
                <div style={styles.menuEmoji}>{item.image}</div>
                <div style={{display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center'}}>
                  <h4 style={styles.menuItemName}>{item.name}</h4>
                  {item.veg && <div style={styles.vegDot} title="Vegetarian"></div>}
                </div>
                <p style={styles.menuItemDesc}>{item.desc}</p>
                <p style={styles.price}>₹{item.price}</p>
                <InteractiveBtn style={styles.addBtn} onClick={() => addToCart(item)}>Add to Cart</InteractiveBtn>
              </div>
            ))}
          </div>
        </div>
      );
      case 'cart': return (
        <div style={styles.page}>
          <h2 style={styles.pageTitle}>Checkout Basket</h2>
          {cart.length === 0 ? (
            <div style={{textAlign: 'center', padding: '100px 0'}}>
              <div style={{fontSize: '4rem', marginBottom: '20px'}}>🛒</div>
              <h3>Your cart is lonely!</h3>
              <InteractiveBtn style={{...styles.primaryBtn, margin: '20px auto'}} onClick={() => setCurrentPage('menu')}>Add Some Joy</InteractiveBtn>
            </div>
          ) : (
            <div style={styles.cartGrid}>
              <div style={styles.cartList}>
                {cart.map(i => (
                  <div key={i.id} style={styles.cartItem}>
                    <span style={{fontSize: '2.5rem'}}>{i.image}</span>
                    <div style={{flex:1, marginLeft:'20px'}}>
                      <strong>{i.name}</strong>
                      <div style={{fontSize: '0.85rem', color: '#888'}}>₹{i.price} each</div>
                    </div>
                    <div style={styles.qtyControls}>
                      <button onClick={() => { 
                        const id = i.id;
                        setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item));
                      }} style={styles.qtyBtn}>-</button>
                      <span>{i.quantity}</span>
                      <button onClick={() => {
                        const id = i.id;
                        setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
                      }} style={styles.qtyBtn}>+</button>
                    </div>
                    <button onClick={() => setCart(prev => prev.filter(item => item.id !== i.id))} style={styles.delBtn}><Trash2 size={20}/></button>
                  </div>
                ))}
              </div>
              <div style={styles.summaryCard}>
                <h3 style={{marginTop:0}}>Order Details</h3>
                
                <div style={styles.orderTypeContainer}>
                  {[
                    { id: 'delivery', label: 'Delivery', icon: Bike },
                    { id: 'takeaway', label: 'Takeaway', icon: Store },
                    { id: 'dinein', label: 'Dine-in', icon: UtensilsCrossed }
                  ].map(type => (
                    <button 
                      key={type.id} 
                      onClick={() => setOrderType(type.id)}
                      style={{
                        ...styles.typeBtn, 
                        borderColor: orderType === type.id ? '#BD0017' : '#EEE',
                        background: orderType === type.id ? '#FFF1F2' : 'white',
                        color: orderType === type.id ? '#BD0017' : '#555'
                      }}
                    >
                      <type.icon size={18}/>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>

                <div style={styles.summaryLine}><span>Subtotal</span><span>₹{cartTotal}</span></div>
                <div style={styles.summaryLine}><span>Service Fee</span><span>₹40</span></div>
                <div style={{...styles.summaryLine, fontWeight: 'bold', borderTop: '1px solid #EEE', paddingTop: '15px', marginTop: '10px'}}>
                  <span>Grand Total</span><span>₹{cartTotal + 40}</span>
                </div>
                
                <InteractiveBtn style={{...styles.primaryBtn, width:'100%', marginTop:'25px', height: '55px'}} onClick={startOrderTracking}>
                  <CreditCard size={18} style={{marginRight: '8px'}}/> Confirm Checkout
                </InteractiveBtn>
              </div>
            </div>
          )}
        </div>
      );
      case 'tracking': return (
        <div style={styles.page}>
          <div style={styles.trackingCard}>
            <h2 style={{textAlign: 'center', color: '#BD0017'}}>Live Order Track</h2>
            <p style={{textAlign: 'center', color: '#888'}}>Order ID: #ARK-{Math.floor(Math.random()*1000000)}</p>
            
            <div style={styles.statusTimeline}>
              <div style={{...styles.statusStep, opacity: 1}}>
                <div style={{...styles.statusIcon, background: '#4CAF50'}}><CheckCircle color="white"/></div>
                <p style={{fontWeight: 'bold', color: '#4CAF50'}}>Accepted</p>
              </div>
              <div style={{...styles.statusLine, background: orderStatus === 'preparing' ? '#FFBC0D' : '#EEE'}}></div>
              <div style={{...styles.statusStep, opacity: orderStatus === 'preparing' ? 1 : 0.3}}>
                <div style={{...styles.statusIcon, background: orderStatus === 'preparing' ? '#FFBC0D' : '#EEE'}}><Package color="white"/></div>
                <p style={{fontWeight: orderStatus === 'preparing' ? 'bold' : 'normal'}}>Preparing</p>
              </div>
            </div>
            
            <div style={styles.trackingMessage}>
              {orderStatus === 'accepted' ? (
                <div><h3>Order Received! 🤝</h3><p>Our kitchen is getting ready to cook your feast.</p></div>
              ) : (
                <div><h3>Cooking in Progress! 🍳</h3><p>Your meal is being prepared with high quality ingredients.</p></div>
              )}
            </div>
            <InteractiveBtn style={{...styles.secondaryBtn, display: 'block', margin: '30px auto', padding: '12px 30px'}} onClick={() => setCurrentPage('menu')}>Keep Browsing</InteractiveBtn>
          </div>
        </div>
      );
      case 'admin': return (
        <div style={styles.page}>
          {!isAdminAuthenticated ? (
            <div style={styles.authContainer}>
              <div style={styles.authCard}>
                <Lock size={48} color="#BD0017" style={{marginBottom: '20px'}}/>
                <h2 style={styles.authTitle}>Internal Admin</h2>
                <p style={{color: '#888', marginBottom: '20px'}}>Authorized access only.</p>
                <form onSubmit={handleAdminAuth} style={styles.form}>
                  <input 
                    style={styles.input} 
                    type="password" 
                    placeholder="Enter Admin Password" 
                    value={adminPassword} 
                    onChange={e => setAdminPassword(e.target.value)} 
                    required 
                  />
                  <InteractiveBtn type="submit" style={styles.primaryBtn}>Enter Portal</InteractiveBtn>
                </form>
              </div>
            </div>
          ) : (
            <>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '40px'}}>
                <h2 style={styles.pageTitle}>ARK Management Dashboard</h2>
                <InteractiveBtn style={styles.secondaryBtn} onClick={() => setIsAdminAuthenticated(false)}>Lock Portal</InteractiveBtn>
              </div>
              <div style={styles.adminGrid}>
                <div style={styles.adminCard}>
                  <h3 style={{marginBottom: '20px'}}>Verified Customers ({usersList.length})</h3>
                  <div style={styles.adminList}>
                    {usersList.length === 0 ? <p style={{color: '#999'}}>No users registered yet.</p> : usersList.map(u => (
                      <div key={u.id} style={styles.listItem}>
                        <strong>{u.name}</strong>
                        <span style={{fontSize: '0.85rem', color: '#666'}}>{u.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={styles.adminCard}>
                  <h3 style={{marginBottom: '20px'}}>Inquiries Received ({inquiries.length})</h3>
                  <div style={styles.adminList}>
                    {inquiries.length === 0 ? <p style={{color: '#999'}}>No queries found.</p> : inquiries.map(i => (
                      <div key={i.id} style={{...styles.listItem, flexDirection: 'column', alignItems: 'flex-start'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                          <strong>{i.name}</strong>
                          <span style={{fontSize: '0.75rem', color: '#999'}}>{new Date(i.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p style={{marginTop: '5px', fontSize: '0.9rem', color: '#444', fontStyle: 'italic'}}>"{i.message}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      );
      case 'contact': return (
        <div style={styles.page}>
          <div style={styles.contactContainer}>
            <div style={{flex: 1}}>
              <h2 style={styles.pageTitle}>Get In Touch</h2>
              <p style={{fontSize: '1.1rem', color: '#666', lineHeight: '1.6'}}>Have a question about a bulk order or our ingredients? Drop us a message.</p>
              <div style={{marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
                <div style={styles.contactItem}><MapPin size={20} color="#BD0017"/> 4th Floor, Tech Valley, Pune - 411001</div>
                <div style={styles.contactItem}><Clock size={20} color="#BD0017"/> Mon - Sun: 9:00 AM - 11:00 PM</div>
                <div style={styles.contactItem}><Send size={20} color="#BD0017"/> support@arkcafe.in</div>
              </div>
            </div>
            <form style={styles.contactForm} onSubmit={(e) => { 
              e.preventDefault(); 
              const form = e.target;
              const newInq = {
                id: Math.random().toString(),
                name: form[0].value,
                email: form[1].value,
                message: form[2].value,
                timestamp: new Date().toISOString()
              };
              setInquiries(prev => [...prev, newInq]);
              alert("Message Sent! We will get back to you soon."); 
              setCurrentPage('home'); 
            }}>
              <input style={styles.input} placeholder="Your Name" required />
              <input style={styles.input} type="email" placeholder="Your Email" required />
              <textarea style={{...styles.input, height: '140px'}} placeholder="What can we help you with?" required />
              <InteractiveBtn style={styles.primaryBtn} type="submit">Send Message</InteractiveBtn>
            </form>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div style={styles.app}>
      {currentPage !== 'login' && <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} cartCount={cart.length} onLogout={handleLogout} />}
      <main style={{flex: 1}}>{renderPage()}</main>
      <footer style={styles.footer}>
        <div style={styles.logoCircle}>A</div>
        <p>© 2024 ARK Cafe Global • Made with Passion in India</p>
      </footer>
    </div>
  );
};

// --- Styles ---
const styles = {
  app: { fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#333' },
  nav: { display: 'flex', justifyContent: 'space-between', padding: '15px 60px', backgroundColor: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', position: 'sticky', top: 0, zIndex: 1000 },
  navBrand: { display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '15px' },
  logoCircle: { backgroundColor: '#FFBC0D', color: '#BD0017', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.4rem' },
  brandText: { fontWeight: '900', color: '#BD0017', fontSize: '1.4rem', letterSpacing: '-0.5px' },
  navLinks: { display: 'flex', gap: '25px' },
  navBtn: { border: 'none', background: 'none', cursor: 'pointer', padding: '8px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' },
  navActions: { display: 'flex', alignItems: 'center', gap: '20px' },
  cartBtn: { position: 'relative', cursor: 'pointer', color: '#BD0017' },
  cartBadge: { position: 'absolute', top: '-10px', right: '-12px', background: '#BD0017', color: 'white', fontSize: '0.75rem', padding: '2px 7px', borderRadius: '12px', fontWeight: '900', border: '2px solid white' },
  logoutBtn: { border: 'none', background: '#F5F5F5', padding: '10px', borderRadius: '50%', cursor: 'pointer' },
  
  authContainer: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' },
  authCard: { background: 'white', padding: '50px 40px', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.06)', width: '400px', textAlign: 'center' },
  authLogo: { background: '#FFBC0D', color: '#BD0017', width: '64px', height: '64px', borderRadius: '16px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '900' },
  authTitle: { fontSize: '2rem', color: '#BD0017', fontWeight: '900', marginBottom: '10px' },
  stepDesc: { color: '#888', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  input: { padding: '16px', borderRadius: '14px', border: '1px solid #EEE', fontSize: '1rem', width: '100%', boxSizing: 'border-box', backgroundColor: '#F9F9F9', outline: 'none' },
  emailDisplay: { background: '#F5F5F5', padding: '14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', alignItems: 'center' },
  editBtn: { color: '#BD0017', fontWeight: 'bold', fontSize: '0.85rem' },
  btnGroup: { display: 'flex', gap: '15px' },
  primaryBtn: { background: '#FFBC0D', color: '#27251F', border: 'none', padding: '16px', borderRadius: '18px', fontWeight: '900', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  secondaryBtn: { background: '#F0F0F0', border: 'none', padding: '16px', borderRadius: '18px', fontWeight: '700', color: '#555' },
  toggleLink: { color: '#BD0017', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' },
  toggleText: { marginTop: '30px', color: '#888' },

  page: { padding: '60px 8%', flex: 1 },
  hero: { display: 'flex', alignItems: 'center', border: '1px solid #F0F0F0', padding: '100px 60px', borderRadius: '48px', marginBottom: '60px', background: 'radial-gradient(circle at top left, white, #FFF9F0)' },
  heroTitle: { fontSize: '4.5rem', color: '#BD0017', fontWeight: '900', marginBottom: '25px', lineHeight: '1' },
  heroSub: { fontSize: '1.3rem', color: '#777', marginBottom: '40px', maxWidth: '550px', lineHeight: '1.6' },
  ctaBtn: { background: '#BD0017', color: 'white', border: 'none', padding: '18px 50px', borderRadius: '50px', fontWeight: '900', fontSize: '1.2rem', boxShadow: '0 10px 25px rgba(189,0,23,0.3)' },
  heroImage: { fontSize: '8rem', flex: 1, textAlign: 'right', display: 'flex', justifyContent: 'flex-end' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' },
  featureCard: { background: '#FFFFFF', padding: '40px', borderRadius: '32px', textAlign: 'center', border: '1px solid #F5F5F5', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
  
  menuHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px', flexWrap: 'wrap', gap: '20px' },
  pageTitle: { fontSize: '2.8rem', fontWeight: '900', color: '#222' },
  filterBar: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  filterBtn: { padding: '12px 25px', borderRadius: '30px', border: '1px solid #EEE', background: 'white', fontWeight: '700', color: '#777', cursor: 'pointer' },
  filterBtnActive: { background: '#BD0017', color: 'white', borderColor: '#BD0017' },
  menuGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '40px' },
  menuCard: { background: 'white', padding: '35px', borderRadius: '40px', textAlign: 'center', border: '1px solid #F9F9F9', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' },
  menuEmoji: { fontSize: '5rem', marginBottom: '20px' },
  menuItemName: { fontSize: '1.3rem', fontWeight: '900', color: '#222' },
  menuItemDesc: { fontSize: '0.9rem', color: '#888', margin: '15px 0', lineHeight: '1.4' },
  vegDot: { width: '14px', height: '14px', background: '#4CAF50', border: '2px solid white', borderRadius: '50%', boxShadow: '0 0 0 1px #4CAF50' },
  price: { fontWeight: '900', color: '#BD0017', fontSize: '1.8rem', margin: '20px 0' },
  addBtn: { background: '#FFBC0D', border: 'none', width: '100%', padding: '15px', borderRadius: '20px', fontWeight: '900', fontSize: '1rem' },
  
  cartGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '60px' },
  cartList: { background: 'white', padding: '35px', borderRadius: '40px', border: '1px solid #F0F0F0' },
  cartItem: { display: 'flex', alignItems: 'center', padding: '25px 0', borderBottom: '1px solid #F9F9F9' },
  qtyControls: { display: 'flex', gap: '10px', alignItems: 'center', background: '#F5F5F5', borderRadius: '15px', padding: '6px' },
  qtyBtn: { background: 'white', border: '1px solid #DDD', width: '35px', height: '35px', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.2rem' },
  delBtn: { border: 'none', background: 'none', color: '#FF5252', cursor: 'pointer', marginLeft: '20px' },
  summaryCard: { background: '#FFFBF5', padding: '40px', borderRadius: '40px', height: 'fit-content', border: '1px solid #FFEED6' },
  summaryLine: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#555', fontSize: '1.1rem' },
  orderTypeContainer: { display: 'flex', gap: '10px', marginBottom: '30px' },
  typeBtn: { flex: 1, padding: '15px 5px', border: '2px solid', borderRadius: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700' },
  
  trackingCard: { background: 'white', padding: '60px', borderRadius: '48px', boxShadow: '0 20px 60px rgba(0,0,0,0.06)', maxWidth: '650px', margin: '20px auto' },
  statusTimeline: { display: 'flex', alignItems: 'center', gap: '20px', margin: '50px 0' },
  statusStep: { textAlign: 'center', flex: 1 },
  statusIcon: { width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statusLine: { flex: 1, height: '6px', borderRadius: '10px', marginTop: '-30px' },
  trackingMessage: { textAlign: 'center', background: '#FDFDFD', padding: '40px', borderRadius: '32px', border: '1px solid #F5F5F5' },

  contactContainer: { display: 'flex', gap: '80px', background: 'white', padding: '60px', borderRadius: '48px', border: '1px solid #F0F0F0' },
  contactItem: { display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.1rem', color: '#555' },
  contactForm: { display: 'flex', flexDirection: 'column', gap: '20px', flex: 1.5 },
  
  adminGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' },
  adminCard: { background: 'white', padding: '40px', borderRadius: '32px', border: '1px solid #F0F0F0' },
  adminList: { maxHeight: '500px', overflowY: 'auto' },
  listItem: { padding: '20px', background: '#F9F9F9', borderRadius: '20px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  footer: { textAlign: 'center', padding: '60px', color: '#BBB', borderTop: '1px solid #F9F9F9', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: 'auto' }
};

export default App;