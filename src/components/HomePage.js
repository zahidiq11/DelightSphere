import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Box,
  CircularProgress,
  Button,
  CardActions,
  Fade,
  Paper,
  InputBase,
  IconButton
} from '@mui/material';
import { 
  Info as InfoIcon,
  AddShoppingCart as AddCartIcon,
  LocalOffer as OfferIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import Footer from './Footer';

const HomePage = ({ isAuthenticated, searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [error, setError] = useState(null);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Memoize special offers to prevent unnecessary re-renders
  const specialOffers = useMemo(() => [
    {
      title: "Flash Sale! 🎉",
      description: "50% OFF on all Electronics - Limited Time Only!",
      color: "#ff4081"
    },
    {
      title: "Weekend Special! 🌟",
      description: "Buy 1 Get 1 Free on Fashion Items",
      color: "#7c4dff"
    },
    {
      title: "New User Offer! 🎁",
      description: "Get $20 OFF on your first purchase",
      color: "#00bcd4"
    },
    {
      title: "Clearance Sale! 💫",
      description: "Up to 70% OFF on Selected Items",
      color: "#ff5722"
    }
  ], []);

  // Rotate offers every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentOfferIndex((prevIndex) => 
        prevIndex === specialOffers.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Get search term directly from URL as well as props
  useEffect(() => {
    // Prioritize the URL search term
    const urlSearchTerm = searchParams.get('search') || '';
    
    console.log("HomePage search term synchronization:", {
      urlSearchTerm, 
      propSearchTerm: searchTerm,
      currentLocalTerm: localSearchTerm
    });
    
    // Always update local search term to match the parent component's state
    if (searchTerm !== localSearchTerm) {
      setLocalSearchTerm(searchTerm || '');
    }
    // If URL has a search term that doesn't match the local state
    else if (urlSearchTerm && urlSearchTerm !== localSearchTerm) {
      setLocalSearchTerm(urlSearchTerm);
    }
  }, [searchParams, searchTerm, localSearchTerm]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Create a products cache key based on timestamp
        const cacheKey = 'homepage_products';
        const cacheExpiry = 5 * 60 * 1000; // 5 minutes
        
        // Try to get cached data first
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < cacheExpiry) {
            setProducts(data);
            setLoading(false);
            // Fetch fresh data in background
            fetchFreshData();
            return;
          }
        }

        // If no valid cache, fetch fresh data
        await fetchFreshData();

      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchFreshData = async () => {
      // Fetch all sellers with active status
      const sellersRef = collection(db, 'sellers');
      const sellersQuery = query(sellersRef, where('status', '==', 'active'));
      const sellersSnapshot = await getDocs(sellersQuery);
      
      // Process all sellers data at once
      const sellersData = sellersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Collect all product IDs first
      const productIds = sellersData.reduce((acc, seller) => {
        if (seller.products && Array.isArray(seller.products)) {
          acc.push(...seller.products);
        }
        return acc;
      }, []);

      // Create a map of seller data for quick lookup
      const sellerMap = sellersData.reduce((acc, seller) => {
        acc[seller.id] = {
          shopName: seller.shopName,
          name: seller.name
        };
        return acc;
      }, {});

      // Batch fetch products in groups of 10
      const batchSize = 10;
      const productPromises = [];
      
      for (let i = 0; i < productIds.length; i += batchSize) {
        const batch = productIds.slice(i, i + batchSize);
        const batchPromises = batch.map(async (productId) => {
          const productDoc = await getDoc(doc(db, 'products', productId));
          if (productDoc.exists()) {
            const sellerId = sellersData.find(s => s.products?.includes(productId))?.id;
            return {
              id: productDoc.id,
              ...productDoc.data(),
              seller: sellerId ? {
                id: sellerId,
                ...sellerMap[sellerId]
              } : null
            };
          }
          return null;
        });
        productPromises.push(...batchPromises);
      }

      // Wait for all product fetches to complete
      const productsResults = await Promise.all(productPromises);
      const validProducts = productsResults.filter(p => p !== null);

      // Cache the results
      localStorage.setItem('homepage_products', JSON.stringify({
        data: validProducts,
        timestamp: Date.now()
      }));

      setProducts(validProducts);
    };

    fetchAllProducts();
  }, []);

  // Memoize the filtered and sorted products with unique keys to prevent duplicate keys
  const displayProductsWithKeys = useMemo(() => {
    const filtered = products
      .filter(product => {
        if (!localSearchTerm) return true;
        const searchLower = localSearchTerm.toLowerCase().trim();
        return (
          (product.name && product.name.toLowerCase().includes(searchLower)) ||
          (product.description && product.description.toLowerCase().includes(searchLower)) ||
          (product.category && product.category.toLowerCase().includes(searchLower)) ||
          (product.seller?.shopName && product.seller.shopName.toLowerCase().includes(searchLower))
        );
      })
      .filter(product => product && product.name && product.price)
      .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    
    // Assign stable unique keys to each product
    return filtered.map((product, index) => ({
      ...product,
      uniqueKey: `product-${product.id || ''}-${index}`
    }));
  }, [products, localSearchTerm]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleDetailsClick = (e, productId) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation(); // Prevent card click
    
    if (!auth.currentUser) {
      alert('Please login to add products to cart');
      navigate('/customer/login');
      return;
    }

    try {
      // Get current customer data to ensure we have the latest cart
      const customerRef = doc(db, 'customers', auth.currentUser.uid);
      const customerDoc = await getDoc(customerRef);
      
      if (!customerDoc.exists()) {
        throw new Error('Customer data not found');
      }
      
      const customerData = customerDoc.data();
      const currentCart = customerData.cart || [];
      
      // Check if product is already in cart
      const existingProduct = currentCart.find(item => item.id === product.id);
      
      let updatedCart;
      if (existingProduct) {
        // Update quantity if product already exists
        updatedCart = currentCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new product to cart
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product.price || 0,
          imageUrl: product.imageUrl || process.env.PUBLIC_URL + '/images/product1.jpg',
          quantity: 1,
          seller: product.seller || null
        };
        updatedCart = [...currentCart, cartItem];
      }
      
      // Update in Firestore
      await updateDoc(customerRef, {
        cart: updatedCart
      });
      
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  // Handle search input change in mobile search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
  };
  
  // Handle search submission
  const handleSearchSubmit = () => {
    if (localSearchTerm.trim()) {
      console.log("Direct navigation with search:", localSearchTerm.trim());
      // Use direct navigation instead of React Router to avoid state sync issues
      window.location.href = `/?search=${encodeURIComponent(localSearchTerm.trim())}`;
    } else {
      window.location.href = '/';
    }
  };
  
  // Handle search key press (Enter)
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    }
  };
  
  // Handle clearing search
  const handleClearSearch = () => {
    setLocalSearchTerm('');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 10, mb: 5 }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            height: '400px',
            width: '100%',
            mb: 6,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3,
            background: 'linear-gradient(45deg, #1a237e 30%, #303f9f 90%)',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0.1,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 4,
            }}
          >
            <Box
              sx={{
                flex: 1,
                color: 'white',
                zIndex: 1,
                textAlign: { xs: 'center', md: 'left' },
                mb: { xs: 3, md: 0 }
              }}
            >
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                Welcome to Our Store
              </Typography>
              <Typography variant="h6" paragraph>
                Discover amazing products from trusted sellers
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                  mt: 2
                }}
                onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
              >
                Shop Now
              </Button>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                height: '100%',
              }}
            >
              <Box
                component="img"
                src="https://png.pngtree.com/thumb_back/fh260/background/20230718/pngtree-digital-retailing-illustration-laptop-keyboard-with-shopping-basket-and-e-commerce-image_3903657.jpg"
                alt="E-commerce illustration"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: 2,
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Search Section - Mobile friendly additional search box */}
        <Box 
          sx={{ 
            mb: 4, 
            display: { xs: 'block', md: 'none' }, // Only show on mobile/small screens
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Find Your Perfect Product
          </Typography>
          <Paper
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit();
            }}
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              maxWidth: '600px',
              margin: '0 auto',
              backgroundColor: '#f5f5f5',
              '&:hover': {
                backgroundColor: '#fff',
                boxShadow: 2
              },
              borderRadius: '4px',
              border: '1px solid #e0e0e0',
              transition: 'all 0.3s ease',
            }}
          >
            <SearchIcon sx={{ p: '10px', color: 'primary.main' }} />
            <InputBase
              sx={{ 
                ml: 1, 
                flex: 1,
                '& input': {
                  padding: '10px 0',
                }
              }}
              placeholder="Search products by name..."
              value={localSearchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
            />
            {localSearchTerm && (
              <IconButton 
                size="small"
                sx={{ p: '5px' }} 
                aria-label="clear search"
                onClick={handleClearSearch}
              >
                <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>×</Typography>
              </IconButton>
            )}
            <IconButton 
              size="small"
              sx={{ p: '8px' }} 
              aria-label="search"
              onClick={handleSearchSubmit}
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </Paper>
        </Box>

        {/* Special Offers Section */}
        <Box sx={{ mb: 4 }}>
          <Fade in={true} timeout={500}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                background: `linear-gradient(45deg, ${specialOffers[currentOfferIndex].color} 30%, ${specialOffers[currentOfferIndex].color}dd 90%)`,
                color: 'white',
                borderRadius: 2,
                transition: 'background 0.5s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <OfferIcon fontSize="large" />
              <Box>
                <Typography variant="h5" component="h2" fontWeight="bold">
                  {specialOffers[currentOfferIndex].title}
                </Typography>
                <Typography variant="subtitle1">
                  {specialOffers[currentOfferIndex].description}
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Box>

        {!isAuthenticated && (
          <Box sx={{ mb: 4, p: 2, bgcolor: '#1a237e', borderRadius: 1 }}>
            <Typography align="center" color="white">
              Please login to add products to your cart
            </Typography>
          </Box>
        )}

        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          {localSearchTerm ? 'Search Results' : 'Featured Products'}
        </Typography>

        {displayProductsWithKeys.length === 0 ? (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              px: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 1
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {localSearchTerm 
                ? `No products found matching "${localSearchTerm}"`
                : 'No products available at the moment'
              }
            </Typography>
            {localSearchTerm && (
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={() => {
                  navigate('/', { replace: true });
                }}
                sx={{ mt: 2 }}
              >
                Clear Search
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {displayProductsWithKeys.map((product) => {
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.uniqueKey}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      cursor: 'pointer',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                        transition: 'all 0.3s ease-in-out'
                      }
                    }}
                    onClick={() => handleProductClick(product.id)}
                    onMouseEnter={() => setHoveredCard(product.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.imageUrl || process.env.PUBLIC_URL + '/images/product1.jpg'}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = process.env.PUBLIC_URL + '/images/product1.jpg';
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h2" noWrap>
                        {product.name}
                      </Typography>
                      {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {product.seller?.shopName || 'Unknown Shop'}
                      </Typography> */}
                      <Typography variant="h6" color="primary">
                        ${product.price}
                      </Typography>
                    </CardContent>
                    <Fade in={hoveredCard === product.id}>
                      <CardActions 
                        sx={{ 
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          bgcolor: 'rgba(0, 0, 0, 0.7)',
                          justifyContent: 'space-between',
                          p: 1
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<InfoIcon />}
                          onClick={(e) => handleDetailsClick(e, product.id)}
                          sx={{ color: 'white' }}
                        >
                          Details
                        </Button>
                        {isAuthenticated ? (
                          <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<AddCartIcon />}
                            onClick={(e) => handleAddToCart(e, product)}
                            sx={{ color: 'white' }}
                          >
                            Add to Cart
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert('Please login to add products to cart');
                              navigate('/customer/login');
                            }}
                            sx={{ color: 'white' }}
                          >
                            Login to Buy
                          </Button>
                        )}
                      </CardActions>
                    </Fade>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default HomePage; 