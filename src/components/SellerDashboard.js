import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Avatar,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  styled,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  CssBaseline,
  Zoom,
  alpha,
  useTheme,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Badge,
  Snackbar,
  Alert,
  Collapse,
  Card,
  InputAdornment,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  Store as StoreIcon,
  Inventory as ProductIcon,
  ShoppingCart as OrderIcon,
  AttachMoney as RevenueIcon,
  Dashboard as DashboardIcon,
  LocalShipping as PackageIcon,
  Share as SpreadIcon,
  Group as AffiliateIcon,
  AccountBalance as WithdrawIcon,
  // Chat as ConversationsIcon,
  Settings as SettingsIcon,
  AssignmentReturn as RefundIcon,
  Home as HomeIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Person as ProfileIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  AssignmentInd as AssignmentIndIcon,
  ExpandMore as ExpandMoreIcon,
  Logout as LogoutIcon,
  InfoOutlined,
  Search as SearchIcon,
  Chat as ConversationsIcon,
} from "@mui/icons-material";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  limit,
  deleteDoc,
} from "firebase/firestore";
// import ChatWindow from "./Chat/ChatWindow";
import { useNavigate } from "react-router-dom";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { Chat } from "./ChatComponents";

const drawerWidth = 260;
const navbarHeight = 64;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create(["margin", "background"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    background: "linear-gradient(to bottom, #f5f7ff, #ffffff)",
    ...(open && {
      transition: theme.transitions.create(["margin", "background"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const StyledDashboardCard = styled(Card)(({ theme, color }) => ({
  height: "100%",
  position: "relative",
  overflow: "hidden",
  borderRadius: 20,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
  background: color
    ? `linear-gradient(135deg, ${color}, ${alpha(color, 0.8)})`
    : theme.palette.background.paper,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.12)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "150px",
    height: "150px",
    background:
      "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
    borderRadius: "0 0 0 100%",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "120px",
    height: "120px",
    background:
      "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
    borderRadius: "0 100% 0 0",
  },
}));

const StyledSectionCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  overflow: "visible",
  marginBottom: theme.spacing(4),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  background: "linear-gradient(to bottom right, #ffffff, #fafbff)",
  "&:hover": {
    boxShadow: "0 12px 48px rgba(0, 0, 0, 0.12)",
    transform: "translateY(-4px)",
  },
  "& .MuiCardHeader-root": {
    paddingBottom: theme.spacing(2),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    position: "relative",
    background:
      "linear-gradient(to right, rgba(63, 81, 181, 0.05), rgba(92, 107, 192, 0.02))",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "60px",
      height: 4,
      background: "linear-gradient(to right, #3f51b5, #5c6bc0)",
      borderRadius: "0 0 4px 0",
      transition: "width 0.3s ease",
    },
  },
  "&:hover .MuiCardHeader-root:after": {
    width: 120,
  },
  "& .MuiCardContent-root": {
    padding: theme.spacing(3),
    "& .MuiTableContainer-root": {
      borderRadius: 16,
      boxShadow: "none",
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    },
    "& .MuiTableHead-root .MuiTableCell-root": {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      color: theme.palette.text.primary,
      fontWeight: 600,
      borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    },
    "& .MuiTableBody-root .MuiTableRow-root:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.02),
    },
  },
}));

const AnimatedAvatar = styled(Avatar)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor || alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  width: 64,
  height: 64,
  transform: "rotate(-5deg)",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "rotate(0deg) scale(1.1)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
  },
  "& .MuiSvgIcon-root": {
    fontSize: 36,
    transition: "transform 0.3s ease",
  },
  "&:hover .MuiSvgIcon-root": {
    transform: "scale(1.1) rotate(360deg)",
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundImage: "linear-gradient(to bottom, #1a237e, #283593, #303f9f)",
    color: "white",
    borderRight: "none",
    boxShadow: "2px 0 20px rgba(0, 0, 0, 0.2)",
    "&:before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      opacity: 0.1,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    },
  },
}));

const SectionHeading = styled(Typography)(({ theme }) => ({
  position: "relative",
  marginBottom: theme.spacing(4),
  paddingBottom: theme.spacing(1),
  fontWeight: 700,
  fontSize: "1.5rem",
  color: theme.palette.text.primary,
  "&:after": {
    content: '""',
    position: "absolute",
    left: 0,
    bottom: 0,
    height: 4,
    width: 60,
    background: "linear-gradient(to right, #3f51b5, #5c6bc0)",
    borderRadius: 4,
    transition: "width 0.3s ease",
  },
  "&:hover:after": {
    width: 120,
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
  overflow: "hidden",
  background: theme.palette.background.paper,
  "& .MuiTable-root": {
    borderCollapse: "separate",
    borderSpacing: "0 8px",
  },
  "& .MuiTableHead-root": {
    "& .MuiTableCell-root": {
      background: "linear-gradient(to right, #3f51b5, #5c6bc0)",
      color: theme.palette.common.white,
      fontWeight: 600,
      borderBottom: "none",
      padding: theme.spacing(2),
      "&:first-of-type": {
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
      },
      "&:last-of-type": {
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
      },
    },
  },
  "& .MuiTableBody-root": {
    "& .MuiTableRow-root": {
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
      },
      "& .MuiTableCell-root": {
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        padding: theme.spacing(2),
        "&:first-of-type": {
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
        },
        "&:last-of-type": {
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
        },
      },
    },
    "& .MuiTableRow-root:nth-of-type(even)": {
      backgroundColor: alpha(theme.palette.primary.light, 0.02),
    },
  },
}));

const DashboardCard = ({ title, value, icon, color }) => (
  <StyledDashboardCard elevation={3} color={color}>
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={3}
      position="relative"
      zIndex={1}
    >
      <Box>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1,
            color: color ? "rgba(255,255,255,0.8)" : "text.secondary",
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontWeight: "bold",
            color: color ? "white" : "text.primary",
          }}
        >
          {value}
        </Typography>
      </Box>
      <AnimatedAvatar bgcolor={color ? "rgba(255,255,255,0.2)" : undefined}>
        {icon}
      </AnimatedAvatar>
    </Box>
  </StyledDashboardCard>
);

const SellerDashboard = () => {
  const [sellerData, setSellerData] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminProducts, setAdminProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [sellerOrders, setSellerOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPrice, setSearchPrice] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editableSellerData, setEditableSellerData] = useState({
    shopName: "",
    email: "",
    phone: "",
    name: "",
    address: "",
    bio: "",
    // Payment methods
    cashPayment: false,
    bankPayment: false,
    usdtPayment: false,
    // Bank details
    bankName: "",
    bankAccountName: "",
    bankAccountNumber: "",
    ifscCode: "",
    // USDT details
    usdtLink: "",
    usdtAddress: "",
    // Password change
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSettingsEditable, setIsSettingsEditable] = useState(false);
  const [isSettingsSaving, setIsSettingsSaving] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [expandedItems, setExpandedItems] = useState(["orders"]);
  const [ordersData, setOrdersData] = useState([]);
  const [adminAssignedOrdersCount, setAdminAssignedOrdersCount] = useState(0);
  // Add additional state variables for component-level loading
  const [dashboardStatsLoading, setDashboardStatsLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [currentTabLoading, setCurrentTabLoading] = useState(false);
  // Add product search state variables
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productPriceRange, setProductPriceRange] = useState({ min: "", max: "" });

  // Add new effect to fetch admin products when dialog opens
  useEffect(() => {
    if (isProductDialogOpen) {
      fetchAdminProducts();
    }
  }, [isProductDialogOpen]);

  // Update the openProductDialog function
  const openProductDialog = async () => {
    setIsProductDialogOpen(true);
  };

  // Update the fetchAdminProducts function
  const fetchAdminProducts = async () => {
    try {
      setLoading(true);
      const productsRef = collection(db, "products");
      const productsSnapshot = await getDocs(productsRef);
      const productsData = [];

      productsSnapshot.forEach((doc) => {
        const data = doc.data();
        const price = parseFloat(data.price) || 0;
        productsData.push({ 
          id: doc.id, 
          ...data,
          price: price,
          profit: (price * 0.23).toFixed(2) // Calculate 23% profit
        });
      });

      setAdminProducts(productsData);
      setLoading(false);
      return productsData;
    } catch (error) {
      console.error("Error fetching admin products:", error);
      setSnackbar({
        open: true,
        message: "Error loading product catalog. Please try again.",
        severity: "error",
      });
      setLoading(false);
      return [];
    }
  };

  // Add the function to filter products based on search and price range
  const getFilteredProducts = () => {
    return adminProducts.filter((product) => {
      // Filter by search query (name and description)
      const nameMatch = product.name?.toLowerCase().includes(productSearchQuery.toLowerCase()) || false;
      const descriptionMatch = product.description?.toLowerCase().includes(productSearchQuery.toLowerCase()) || false;
      const searchMatch = productSearchQuery === "" || nameMatch || descriptionMatch;
      
      // Filter by price range
      const minPrice = productPriceRange.min !== "" ? parseFloat(productPriceRange.min) : 0;
      const maxPrice = productPriceRange.max !== "" ? parseFloat(productPriceRange.max) : Infinity;
      
      const priceMatch = 
        (productPriceRange.min === "" || (product.price && product.price >= minPrice)) &&
        (productPriceRange.max === "" || (product.price && product.price <= maxPrice));
      
      return searchMatch && priceMatch;
    });
  };

  // Update the handleProductSelection function
  const handleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Update the handleAddSelectedProducts function
  const handleAddSelectedProducts = async () => {
    if (!selectedProducts.length) {
      setSnackbar({
        open: true,
        message: "Please select at least one product",
        severity: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const sellerRef = doc(db, "sellers", auth.currentUser.uid);
      const currentProducts = sellerData?.products || [];
      
      // Add only products that aren't already in the seller's inventory
      const newProducts = selectedProducts.filter(
        (id) => !currentProducts.includes(id)
      );
      
      await updateDoc(sellerRef, {
        products: [...currentProducts, ...newProducts],
      });

      // Update local state
      setSellerData((prev) => ({
        ...prev,
        products: [...currentProducts, ...newProducts],
      }));

      // Fetch updated seller products
      await fetchSellerProducts([...currentProducts, ...newProducts]);

      setSnackbar({
        open: true,
        message: "Products added successfully!",
        severity: "success",
      });
      setSelectedProducts([]);
      setIsProductDialogOpen(false);
    } catch (error) {
      console.error("Error adding products:", error);
      setSnackbar({
        open: true,
        message: "Failed to add products. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a function to check for assigned orders and show notification
  const checkForAssignedOrders = (orders) => {
    const assignedOrders = orders.filter((order) => order.assignedAt);
    if (assignedOrders.length > 0) {
      console.log(
        `Found ${assignedOrders.length} orders assigned by admin:`,
        assignedOrders,
      );

      // Show notification
      setSnackbar({
        open: true,
        message: `You have ${assignedOrders.length} orders assigned by admin!`,
        severity: "info",
      });

      // Update the badge count
      const adminAssignedOrdersCount = assignedOrders.length;

      // You could also play a sound or show a more prominent notification here
    }
  };

  // Update the useEffect to use this function
  useEffect(() => {
    // Main function to fetch essential data first
    const loadEssentialData = async () => {
      try {
        setLoading(true);

        // Get seller ID from localStorage as fallback
        const sellerId = localStorage.getItem('sellerId');
        if (!sellerId) {
          console.error('No seller ID found');
          navigate('/seller/login');
          return;
        }

        // Try to get cached seller data first for immediate display
        const cachedSellerData = localStorage.getItem('sellerData');
        if (cachedSellerData) {
          try {
            const parsedData = JSON.parse(cachedSellerData);
            setSellerData({
              ...parsedData,
              walletBalance: parsedData.walletBalance || 0,
              pendingAmount: parsedData.pendingAmount || 0,
              productsCount: parsedData.products ? parsedData.products.length : 0,
              ordersCount: 0
            });
            
            // Check if seller is frozen and redirect to conversations tab
            if (parsedData.status === 'frozen') {
              setActiveTab("conversations");
            }
          } catch (e) {
            console.error("Error parsing cached seller data:", e);
            // Continue to fetch from Firestore
          }
        }

        // Try to fetch fresh data from Firestore
        try {
          const sellerDoc = await getDoc(doc(db, "sellers", sellerId));
          
          if (sellerDoc.exists()) {
            const data = sellerDoc.data();
            
            // Update localStorage with fresh data
            localStorage.setItem('sellerData', JSON.stringify(data));
            
            // Update the login time to keep session fresh
            localStorage.setItem('sellerLoginTime', new Date().toISOString());

            // Set seller data in state
            setSellerData({
              ...data,
              walletBalance: data.walletBalance || 0,
              pendingAmount: data.pendingAmount || 0,
              productsCount: data.products ? data.products.length : 0,
              ordersCount: 0
            });
            
            // If seller is frozen, force the conversations tab
            if (data.status === 'frozen') {
              setActiveTab("conversations");
            }

            // Now fetch additional data in parallel
            Promise.all([
              fetchOrders(),
              activeTab === "products" ? fetchSellerProducts(data.products) : Promise.resolve(),
            ])
              .catch((error) => {
                console.error("Error loading parallel data:", error);
                setSnackbar({
                  open: true,
                  message: "Some data could not be loaded. Please refresh the page.",
                  severity: "warning"
                });
              })
              .finally(() => {
                setLoading(false);
              });
          } else {
            console.error('Seller document not found');
            // If Firestore doesn't have the seller doc but we have cached data, use that
            if (cachedSellerData) {
              setLoading(false);
            } else {
              setSnackbar({
                open: true,
                message: "Error loading seller data. Please try logging in again.",
                severity: "error"
              });
              navigate('/seller/login');
            }
          }
        } catch (firestoreError) {
          console.error("Error fetching seller document:", firestoreError);
          // If Firestore fails but we have cached data, continue with cached data
          if (cachedSellerData) {
            setLoading(false);
          } else {
            setSnackbar({
              open: true, 
              message: "Error connecting to database. Please check your connection.",
              severity: "error"
            });
            // Only redirect if we don't have cached data
            navigate('/seller/login');
          }
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
        setLoading(false);
        setSnackbar({
          open: true,
          message: "Error loading dashboard data. Please refresh.",
          severity: "error"
        });
      }
    };

    loadEssentialData();
  }, []);

  // Separate effect for tab-specific data
  useEffect(() => {
    const loadTabData = async () => {
      try {
        setCurrentTabLoading(true);

        switch (activeTab) {
          case "dashboard":
            if (dashboardStatsLoading) {
              await fetchOrders();
              setDashboardStatsLoading(false);
            }
            break;

          case "products":
            if (productsLoading && sellerData?.products) {
              await fetchSellerProducts(sellerData.products);
              await fetchAdminProducts();
              setProductsLoading(false);
            }
            break;

          case "orders":
          case "allOrders":
          case "directOrders":
            if (ordersLoading) {
              await fetchOrders();
              setOrdersLoading(false);
            }
            break;

          // Other tabs can load data as needed
          default:
            break;
        }
      } catch (error) {
        console.error("Error loading tab data:", error);
      } finally {
        setCurrentTabLoading(false);
      }
    };

    loadTabData();
  }, [activeTab, activeSubTab]);

  // Update the fetchOrders function for better performance
  const fetchOrders = async () => {
    try {
      const sellerId = localStorage.getItem('sellerId');
      if (!sellerId) {
        console.error('No seller ID found');
        return;
      }

      // Use a simpler query without orderBy to avoid index requirement
      const ordersQuery = query(
        collection(db, "orders"),
        where("sellerId", "==", sellerId)
      );

      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData = [];
      
      ordersSnapshot.forEach((doc) => {
        ordersData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Sort manually by createdAt
      ordersData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
        return dateB - dateA; // Sort in descending order (newest first)
      });

      // Limit to most recent 100 orders after sorting
      const limitedOrdersData = ordersData.slice(0, 100);

      // Update state with the orders
      setSellerOrders(limitedOrdersData);

      // Calculate order statistics
      let totalSales = 0;
      let pendingOrders = 0;

      limitedOrdersData.forEach((order) => {
        if (order.status === "pending") {
          pendingOrders++;
        }
        if (order.total) {
          totalSales += Number(order.total);
        }
      });

      // Update seller data with order statistics
      setSellerData((prevData) => {
        if (!prevData) return null;
        return {
          ...prevData,
          ordersCount: limitedOrdersData.length,
          pendingOrders,
          totalSales,
        };
      });

      return limitedOrdersData;
    } catch (error) {
      console.error("Error fetching orders:", error);
      setSnackbar({
        open: true,
        message: "Error loading orders. Please refresh the page.",
        severity: "error"
      });
      return [];
    }
  };

  // Update the fetchSellerProducts for better performance
  const fetchSellerProducts = async (productIds) => {
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      setSellerProducts([]);
      return [];
    }

    try {
      // Use batched reads to avoid too many individual document fetches
      // Process in chunks of 10 products at a time
      const products = [];
      const batchSize = 10;

      for (let i = 0; i < productIds.length; i += batchSize) {
        const batch = productIds.slice(i, i + batchSize);
        const promises = batch.map((id) => getDoc(doc(db, "products", id)));

        const results = await Promise.all(promises);

        results.forEach((doc) => {
          if (doc.exists()) {
            products.push({
              id: doc.id,
              ...doc.data(),
            });
          }
        });
      }

      setSellerProducts(products);
      return products;
    } catch (error) {
      console.error("Error fetching seller products:", error);
      setSnackbar({
        open: true,
        message: "Error loading products. Please refresh the page.",
        severity: "error",
      });
      return [];
    }
  };

  const handleTabChange = (tab) => {
    // If seller is frozen, only allow conversations tab
    if (sellerData?.status === 'frozen' && tab !== 'conversations') {
      setSnackbar({
        open: true,
        message: "Your account is frozen. You can only access conversations.",
        severity: "warning"
      });
      return;
    }
    
    setActiveTab(tab);

    // If the tab has subitems, toggle its expanded state
    if (["orders"].includes(tab)) {
      setExpandedItems((prev) =>
        prev.includes(tab)
          ? prev.filter((item) => item !== tab)
          : [...prev, tab],
      );
    }

    // Initialize editable data when profile or settings tab is selected
    if (tab === "profile" || tab === "settings") {
      setEditableSellerData({
        shopName: sellerData?.shopName || "",
        email: sellerData?.email || "",
        phone: sellerData?.phone || "",
        name: sellerData?.name || "",
        address: sellerData?.address || "",
        bio: sellerData?.bio || "",
        // Payment methods
        cashPayment: sellerData?.cashPayment || false,
        bankPayment: sellerData?.bankPayment || false,
        usdtPayment: sellerData?.usdtPayment || false,
        // Bank details
        bankName: sellerData?.bankName || "",
        bankAccountName: sellerData?.bankAccountName || "",
        bankAccountNumber: sellerData?.bankAccountNumber || "",
        ifscCode: sellerData?.ifscCode || "",
        // USDT details
        usdtLink: sellerData?.usdtLink || "",
        usdtAddress: sellerData?.usdtAddress || "",
        // Password change
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Reset edit mode
      setIsSettingsEditable(false);
    }
  };

  const handleSubTabChange = (parentTab, subTab) => {
    setActiveTab(parentTab);
    // If the removed adminAssignedOrders is somehow selected, redirect to allOrders
    if (subTab === "adminAssignedOrders") {
      setActiveSubTab("allOrders");
    } else {
      setActiveSubTab(subTab);
    }
  };

  const handleSettingsChange = (field, value) => {
    setEditableSellerData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSettingsEdit = () => {
    setIsSettingsEditable(!isSettingsEditable);

    // If canceling edit, reset to original values
    if (isSettingsEditable) {
      setEditableSellerData({
        shopName: sellerData?.shopName || "",
        email: sellerData?.email || "",
        phone: sellerData?.phone || "",
        name: sellerData?.name || "",
        address: sellerData?.address || "",
        bio: sellerData?.bio || "",
        // Payment methods
        cashPayment: sellerData?.cashPayment || false,
        bankPayment: sellerData?.bankPayment || false,
        usdtPayment: sellerData?.usdtPayment || false,
        // Bank details
        bankName: sellerData?.bankName || "",
        bankAccountName: sellerData?.bankAccountName || "",
        bankAccountNumber: sellerData?.bankAccountNumber || "",
        ifscCode: sellerData?.ifscCode || "",
        // USDT details
        usdtLink: sellerData?.usdtLink || "",
        usdtAddress: sellerData?.usdtAddress || "",
        // Password change
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const saveSettings = async () => {
    // Only validate email format if an email is provided
    if (
      editableSellerData.email.trim() &&
      !editableSellerData.email.includes("@")
    ) {
      alert("Please enter a valid email address");
      return;
    }

    // Validate bank details only if bank payment is selected and any bank field is filled
    if (editableSellerData.bankPayment) {
      const hasBankDetails =
        editableSellerData.bankName.trim() ||
        editableSellerData.bankAccountName.trim() ||
        editableSellerData.bankAccountNumber.trim() ||
        editableSellerData.ifscCode.trim();

      if (hasBankDetails) {
        const missingFields = [];
        if (!editableSellerData.bankName.trim())
          missingFields.push("Bank Name");
        if (!editableSellerData.bankAccountName.trim())
          missingFields.push("Bank Account Name");
        if (!editableSellerData.bankAccountNumber.trim())
          missingFields.push("Bank Account Number");
        if (!editableSellerData.ifscCode.trim())
          missingFields.push("IFSC Code");

        if (missingFields.length > 0) {
          alert(`Please fill in all bank details: ${missingFields.join(", ")}`);
          return;
        }
      }
    }

    // Validate USDT details only if USDT payment is selected and any USDT field is filled
    if (editableSellerData.usdtPayment) {
      const hasUSDTDetails =
        editableSellerData.usdtLink.trim() ||
        editableSellerData.usdtAddress.trim();

      if (hasUSDTDetails) {
        const missingFields = [];
        if (!editableSellerData.usdtLink.trim())
          missingFields.push("USDT Link");
        if (!editableSellerData.usdtAddress.trim())
          missingFields.push("USDT Address");

        if (missingFields.length > 0) {
          alert(`Please fill in all USDT details: ${missingFields.join(", ")}`);
          return;
        }
      }
    }

    // Validate password change if attempted
    if (editableSellerData.newPassword || editableSellerData.currentPassword) {
      if (!editableSellerData.currentPassword) {
        alert("Current password is required to change password");
        return;
      }
      if (!editableSellerData.newPassword) {
        alert("New password is required");
        return;
      }
      if (
        editableSellerData.newPassword !== editableSellerData.confirmPassword
      ) {
        alert("New passwords do not match");
        return;
      }
      if (editableSellerData.newPassword.length < 6) {
        alert("New password must be at least 6 characters long");
        return;
      }
    }

    setIsSettingsSaving(true);

    try {
      const sellerRef = doc(db, "sellers", auth.currentUser.uid);

      // Update seller data in Firestore
      const updateData = {
        name: editableSellerData.name.trim(),
        email: editableSellerData.email.trim(),
        phone: editableSellerData.phone.trim(),
        // Payment methods
        cashPayment: editableSellerData.cashPayment,
        bankPayment: editableSellerData.bankPayment,
        usdtPayment: editableSellerData.usdtPayment,
        // Bank details
        bankName: editableSellerData.bankName.trim(),
        bankAccountName: editableSellerData.bankAccountName.trim(),
        bankAccountNumber: editableSellerData.bankAccountNumber.trim(),
        ifscCode: editableSellerData.ifscCode.trim(),
        // USDT details
        usdtLink: editableSellerData.usdtLink.trim(),
        usdtAddress: editableSellerData.usdtAddress.trim(),
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(sellerRef, updateData);

      // Handle password change if requested
      if (
        editableSellerData.newPassword &&
        editableSellerData.currentPassword
      ) {
        try {
          // Re-authenticate user
          const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            editableSellerData.currentPassword,
          );
          await reauthenticateWithCredential(auth.currentUser, credential);

          // Update password
          await updatePassword(
            auth.currentUser,
            editableSellerData.newPassword,
          );
          alert("Password updated successfully");
        } catch (error) {
          console.error("Error updating password:", error);
          alert(
            "Failed to update password. Please check your current password and try again.",
          );
          return;
        }
      }

      // Update local state
      setSellerData((prev) => ({
        ...prev,
        ...updateData,
      }));

      // Reset password fields
      setEditableSellerData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      setIsSettingsEditable(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSettingsSaving(false);
    }
  };

  const renderDashboardContent = () => (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Show skeleton loaders while loading dashboard stats */}
      {dashboardStatsLoading ? (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Wallet and Revenue Card Skeletons */}
            {[1, 2].map((item) => (
              <Grid item xs={12} md={6} key={item}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    bgcolor: item === 1 ? "primary.main" : "success.main",
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: 2,
                    height: "100%",
                    opacity: 0.7,
                  }}
                >
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {item === 1 ? "Wallet Balance" : "Pending"}
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        height: 40,
                        width: 120,
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      height: 48,
                      width: 48,
                      borderRadius: "50%",
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Dashboard Card Skeletons */}
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    height: 120,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "rgba(0,0,0,0.1)",
                      height: 24,
                      width: "70%",
                      borderRadius: 1,
                      mb: 2,
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "rgba(0,0,0,0.1)",
                        height: 40,
                        width: 80,
                        borderRadius: 1,
                      }}
                    />
                    <Box
                      sx={{
                        bgcolor: "rgba(0,0,0,0.1)",
                        height: 40,
                        width: 40,
                        borderRadius: "50%",
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        // Render actual data when loaded
        <>
          {/* Wallet and Revenue Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Wallet Balance Card */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  bgcolor: "primary.main",
                  color: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: 2,
                  height: "100%",
                }}
              >
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Wallet Balance
                  </Typography>
                  <Typography variant="h4">
                    ${(sellerData?.walletBalance || 0).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Available for withdrawal
                  </Typography>
                </Box>
                <WithdrawIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Paper>
            </Grid>

            {/* Revenue Card */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  bgcolor: "success.main",
                  color: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: 2,
                  height: "100%",
                }}
              >
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Pending
                  </Typography>
                  <Typography variant="h4">
                    ${(sellerData?.pendingAmount || 0).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Total pending amount
                  </Typography>
                </Box>
                <RevenueIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Paper>
            </Grid>
          </Grid>

          {/* Existing Dashboard Cards */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard
                title="Total Products"
                value={sellerData?.productsCount || 0}
                icon={<ProductIcon />}
                color="#4CAF50"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard
                title="Total Orders"
                value={sellerData?.ordersCount || 0}
                icon={<OrderIcon />}
                color="#2196F3"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard
                title="Gurantee Money"
                value={sellerData?.guaranteeMoney || 0}
                icon={<RevenueIcon />}
                color="#FF9800"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard
                title="Total Sales"
                value={sellerData?.totalSales || 0}
                icon={<RevenueIcon />}
                color="#E91E63"
              />
            </Grid>
          </Grid>

          {/* Recent Orders */}
          <Box mt={4}>
            <SectionHeading variant="h5" gutterBottom>
              Recent Orders
            </SectionHeading>
            <StyledTableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Profit</TableCell>
                    <TableCell>Grand Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sellerOrders.length > 0 ? (
                    sellerOrders.slice(0, 5).map((order) => (
                      <TableRow
                        key={order.id}
                        hover
                        sx={{
                          bgcolor: order.assignedAt
                            ? alpha(theme.palette.secondary.light, 0.1)
                            : "inherit",
                          "&:hover": {
                            bgcolor: order.assignedAt
                              ? alpha(theme.palette.secondary.light, 0.2)
                              : alpha(theme.palette.primary.light, 0.1),
                          },
                        }}
                      >
                        <TableCell>
                          {order.orderNumber || order.id.substring(0, 8)}
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          {order.customerName ||
                            order.customerEmail ||
                            "Anonymous"}
                        </TableCell>
                        <TableCell>
                          $
                          {Number(
                            order.total || order.totalAmount || 0,
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "medium",
                              color: "success.main",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            $
                            {(
                              Number(order.total || order.totalAmount || 0) *
                              0.23
                            ).toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "medium",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            $
                            {(
                              Number(order.total || order.totalAmount || 0) +
                              Number(order.total || order.totalAmount || 0) *
                                0.23
                            ).toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            color={
                              order.status === "completed"
                                ? "success"
                                : order.status === "processing"
                                  ? "info"
                                  : order.status === "assigned"
                                    ? "primary"
                                    : order.status === "cancelled"
                                      ? "error"
                                      : "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            {/* <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleViewOrderDetails(order)}
                            >
                              VIEW
                            </Button> */}
                            {order.status === "assigned" && (
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={() => handlePickOrder(order.id)}
                              >
                                PICK
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Box sx={{ py: 3 }}>
                          <Typography color="textSecondary">
                            No orders yet
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </StyledTableContainer>
            {sellerOrders.length > 5 && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setActiveTab("orders")}
                  endIcon={<OrderIcon />}
                >
                  View All Orders
                </Button>
              </Box>
            )}
          </Box>

          <Box mt={6}>
            <SectionHeading variant="h5" gutterBottom>
              Quick Actions
            </SectionHeading>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
                      background: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                  onClick={() => setIsProductDialogOpen(true)}
                >
                  <ProductIcon sx={{ fontSize: 40, color: "#5c6bc0", mb: 1 }} />
                  <Typography variant="body1" fontWeight="medium">
                    Add Products
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
                      background: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                  onClick={() => setActiveTab("orders")}
                >
                  <OrderIcon sx={{ fontSize: 40, color: "#26a69a", mb: 1 }} />
                  <Typography variant="body1" fontWeight="medium">
                    View Orders
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
                      background: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                  onClick={() => setActiveTab("settings")}
                >
                  <SettingsIcon
                    sx={{ fontSize: 40, color: "#7e57c2", mb: 1 }}
                  />
                  <Typography variant="body1" fontWeight="medium">
                    Shop Settings
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
                      background: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                  onClick={() => setActiveTab("profile")}
                >
                  <ProfileIcon sx={{ fontSize: 40, color: "#ec407a", mb: 1 }} />
                  <Typography variant="body1" fontWeight="medium">
                    My Profile
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Container>
  );

  const renderProductsContent = () => (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="medium">
        Products Management
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, flexGrow: 1, maxWidth: "70%" }}>
          <TextField
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            placeholder="Max price..."
            value={searchPrice}
            onChange={(e) => setSearchPrice(e.target.value)}
            variant="outlined"
            size="small"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            sx={{ maxWidth: 150 }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsProductDialogOpen(true)}
        >
          Add New Products
        </Button>
      </Box>
      <Paper elevation={3} sx={{ p: 3 }}>
        {sellerProducts.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Profit</TableCell>
                  <TableCell>Grand Total</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Box
                        component="img"
                        src={product.imageUrl}
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            process.env.PUBLIC_URL + "/images/product1.jpg";
                        }}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 1,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          backgroundColor: "#f5f5f5",
                          display: "block",
                          border: "1px solid #e0e0e0",
                        }}
                        loading="lazy"
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "medium",
                          color: "success.main",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        ${(Number(product.price || 0) * 0.23).toFixed(2)}
                        <Typography
                          variant="caption"
                          sx={{ ml: 1, color: "text.secondary" }}
                        ></Typography>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "medium",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        $
                        {(
                          Number(product.price || 0) +
                          Number(product.price || 0) * 0.23
                        ).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.status || "Active"}
                        color={
                          product.status === "Inactive"
                            ? "default"
                            : product.status === "Pending"
                              ? "warning"
                              : "success"
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color="textSecondary">
            No products added yet. Click "Add New Products" to get started.
          </Typography>
        )}
      </Paper>

      {/* Product Selection Dialog */}
      <Dialog
        open={isProductDialogOpen}
        onClose={handleProductDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Select Products to Add
          <IconButton
            aria-label="close"
            onClick={handleProductDialogClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 2 }}>
            You can add products to your inventory free of cost. No wallet
            balance will be deducted.
          </Typography>
          
          {/* Search and Filter Section */}
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <TextField
              label="Search products"
              variant="outlined"
              size="small"
              value={productSearchQuery}
              onChange={(e) => setProductSearchQuery(e.target.value)}
              sx={{ flexGrow: 1, minWidth: '250px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Min Price"
              variant="outlined"
              size="small"
              type="number"
              value={productPriceRange.min}
              onChange={(e) => setProductPriceRange(prev => ({ ...prev, min: e.target.value }))}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={{ width: '120px' }}
            />
            <TextField
              label="Max Price"
              variant="outlined"
              size="small"
              type="number"
              value={productPriceRange.max}
              onChange={(e) => setProductPriceRange(prev => ({ ...prev, max: e.target.value }))}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={{ width: '120px' }}
            />
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedProducts.length > 0 &&
                        selectedProducts.length < adminProducts.length
                      }
                      checked={
                        selectedProducts.length === adminProducts.length &&
                        adminProducts.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts(adminProducts.map((p) => p.id));
                        } else {
                          setSelectedProducts([]);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Profit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : getFilteredProducts().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Box sx={{ textAlign: "center", p: 2 }}>
                        <Typography variant="body1" color="textSecondary" gutterBottom>
                          No products match your search criteria
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Try adjusting your search terms or price range
                        </Typography>
                        {(productSearchQuery || productPriceRange.min || productPriceRange.max) && (
                          <Button 
                            onClick={clearProductFilters}
                            color="primary"
                            sx={{ mt: 1 }}
                          >
                            Clear Filters
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  getFilteredProducts().map((product) => {
                    const isSelected = selectedProducts.includes(product.id);
                    const isAlreadyAdded = sellerData?.products?.includes(
                      product.id,
                    );

                    return (
                      <TableRow
                        key={product.id}
                        selected={isSelected}
                        sx={{
                          backgroundColor: isAlreadyAdded
                            ? "rgba(0, 0, 0, 0.04)"
                            : "inherit",
                          "&.Mui-selected": {
                            backgroundColor: "rgba(25, 118, 210, 0.08)",
                          },
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleProductSelection(product.id)}
                            disabled={isAlreadyAdded}
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            component="img"
                            src={product.imageUrl}
                            alt={product.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                process.env.PUBLIC_URL + "/images/product1.jpg";
                            }}
                            sx={{
                              width: 80,
                              height: 80,
                              objectFit: "cover",
                              borderRadius: 1,
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              backgroundColor: "#f5f5f5",
                              display: "block",
                              border: "1px solid #e0e0e0",
                            }}
                            loading="lazy"
                          />
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "medium",
                                color:
                                  product.price &&
                                  product.cost &&
                                  product.price > 0
                                    ? (product.price - product.cost) /
                                        product.price >=
                                      0.4
                                      ? "success.main"
                                      : (product.price - product.cost) /
                                            product.price >=
                                          0.2
                                        ? "info.main"
                                        : (product.price - product.cost) /
                                              product.price >=
                                            0.1
                                          ? "warning.main"
                                          : "error.main"
                                  : "text.secondary",
                                }}
                              >
                              $
                              {(
                                Number(product.price || 0) -
                                Number(product.cost || 0)
                              ).toFixed(2)}
                              <br />
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mt: 1,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: "medium",
                                    color: "success.main",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  23%: $
                                  {(Number(product.price || 0) * 0.23).toFixed(2)}
                                </Typography>
                              </Box>
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProductDialogClose}>Cancel</Button>
          <Button
            onClick={handleAddSelectedProducts}
            variant="contained"
            color="primary"
            disabled={selectedProducts.length === 0 || loading}
          >
            Add Selected Products
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );

  const fetchSellerOrders = async () => {
    try {
      // Get seller ID from localStorage instead of auth.currentUser
      const sellerId = localStorage.getItem('sellerId');
      
      if (!sellerId) {
        console.error("No seller ID found in localStorage");
        return [];
      }
      
      console.log("Fetching seller orders for:", sellerId);

      // First, get the seller document to check if there are any orders
      const sellerRef = doc(db, "sellers", sellerId);
      const sellerDoc = await getDoc(sellerRef);

      if (!sellerDoc.exists()) {
        console.log("Seller document not found");
        return [];
      }

      const sellerData = sellerDoc.data();
      console.log("Seller data:", sellerData);

      // Query orders directly from the orders collection
      const ordersQuery = query(
        collection(db, "orders"),
        where("sellerId", "==", sellerId),
      );

      console.log("Executing orders query...");
      const ordersSnapshot = await getDocs(ordersQuery);
      console.log("Orders query completed, docs count:", ordersSnapshot.size);

      const ordersData = [];

      // Process each order document
      ordersSnapshot.forEach((doc) => {
        const orderData = doc.data();
        console.log("Found order:", doc.id, orderData);
        ordersData.push({
          id: doc.id,
          ...orderData,
        });
      });

      // If no orders found in the direct query, check the seller's orders array
      if (
        ordersData.length === 0 &&
        sellerData.orders &&
        sellerData.orders.length > 0
      ) {
        console.log(
          "No orders found in direct query, checking seller's orders array:",
          sellerData.orders,
        );

        // Fetch each order by ID from the seller's orders array
        for (const orderId of sellerData.orders) {
          const orderDoc = await getDoc(doc(db, "orders", orderId));
          if (orderDoc.exists()) {
            const orderData = orderDoc.data();
            console.log(
              "Found order from seller's orders array:",
              orderId,
              orderData,
            );
            ordersData.push({
              id: orderId,
              ...orderData,
            });
          } else {
            console.log("Order not found:", orderId);
          }
        }
      }

      // Sort orders by date (newest first) with proper type checking
      ordersData.sort((a, b) => {
        // Check if createdAt exists and has toDate method
        const dateA =
          a.createdAt && typeof a.createdAt.toDate === "function"
            ? a.createdAt.toDate()
            : a.createdAt
              ? new Date(a.createdAt)
              : new Date(0);

        const dateB =
          b.createdAt && typeof b.createdAt.toDate === "function"
            ? b.createdAt.toDate()
            : b.createdAt
              ? new Date(b.createdAt)
              : new Date(0);

        return dateB - dateA;
      });

      console.log("Total orders found:", ordersData.length);
      console.log("Orders data:", ordersData);

      setSellerOrders(ordersData);

      // After processing orders, count admin assigned orders
      const adminAssigned = ordersData.filter(
        (order) => order.assignedAt && order.assignedByAdmin === true,
      );
      setAdminAssignedOrdersCount(adminAssigned.length);

      return ordersData; // Return the data for promise chaining
    } catch (error) {
      console.error("Error fetching seller orders:", error);
      setSnackbar({
        open: true,
        message: "Failed to load orders. Please try again.",
        severity: "error",
      });
      throw error; // Re-throw the error for promise handling
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailsModalOpen(true);
  };

  const handleCloseOrderDetailsModal = () => {
    setIsOrderDetailsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      if (
        window.confirm(
          "Are you sure you want to permanently delete this order?",
        )
      ) {
        // Delete the order from Firestore
        await deleteDoc(doc(db, "orders", orderId));

        // Update local state to remove the order
        setSellerOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId),
        );

        setSnackbar({
          open: true,
          message: "Order deleted successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete order: " + error.message,
        severity: "error",
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);

      // Get seller ID from localStorage
      const sellerId = localStorage.getItem('sellerId');
      const sellerEmail = localStorage.getItem('sellerEmail');
      const sellerName = localStorage.getItem('sellerName') || sellerEmail;
      
      if (!sellerId) {
        throw new Error("Seller ID not found in localStorage");
      }

      // Get the order details
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);

      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }

      const orderData = orderDoc.data();

      // If the status is being changed to 'completed', add a special note for admin verification
      const isCompletionRequest = newStatus === "completed";

      const updatedStatus = isCompletionRequest
        ? "completion_requested"
        : newStatus;

      // Update the order with the new status
      await updateDoc(orderRef, {
        status: updatedStatus,
        statusHistory: arrayUnion({
          status: updatedStatus,
          timestamp: new Date().toISOString(),
          updatedBy: "seller",
          note: isCompletionRequest
            ? "Seller requested order completion - awaiting admin verification"
            : undefined,
        }),
        completionRequestedAt: isCompletionRequest
          ? serverTimestamp()
          : orderData.completionRequestedAt,
      });

      // If this is a completion request, also notify admin
      if (isCompletionRequest) {
        // Create a notification for the admin
        await addDoc(collection(db, "notifications"), {
          type: "completion_request",
          orderId: orderId,
          sellerId: sellerId,
          createdAt: serverTimestamp(),
          read: false,
          message: `Seller ${sellerName || sellerEmail} has requested completion approval for order #${orderData.orderNumber || orderId.substring(0, 8)}.`,
          priority: "high",
        });
      }

      // Update local state
      setSellerOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: updatedStatus,
                completionRequestedAt: isCompletionRequest
                  ? new Date()
                  : order.completionRequestedAt,
              }
            : order,
        ),
      );

      setSnackbar({
        open: true,
        message: isCompletionRequest
          ? "Order completion requested. Admin will review and approve to transfer funds to your wallet."
          : `Order status updated to ${newStatus}`,
        severity: "success",
      });

      // Close modal if open
      if (isOrderDetailsModalOpen) {
        handleCloseOrderDetailsModal();
      }

      // Refresh orders
      fetchSellerOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      setSnackbar({
        open: true,
        message: "Failed to update order status. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePickOrder = async (orderId) => {
    try {
      setLoading(true);
      
      // Get seller ID from localStorage
      const sellerId = localStorage.getItem('sellerId');
      
      if (!sellerId) {
        throw new Error("Seller ID not found in localStorage");
      }

      // Get the order details
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);

      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }

      const orderData = orderDoc.data();

      // Calculate total product price and profit from order items
      let totalProductPrice = 0;
      let totalAdditionalProfit = 0;

      if (orderData.items && Array.isArray(orderData.items)) {
        orderData.items.forEach((item) => {
          const itemPrice = Number(item.price || 0);
          const itemQuantity = Number(item.quantity || 1);

          totalProductPrice += itemPrice * itemQuantity;
          // Calculate 23% profit that will be added to pending but not deducted from wallet
          totalAdditionalProfit += itemPrice * 0.23 * itemQuantity;
        });
      }

      // Calculate the Grand Total (price + profit)
      const grandTotal = totalProductPrice + totalAdditionalProfit;

      // Get seller's current data
      const sellerRef = doc(db, "sellers", sellerId);
      const sellerDoc = await getDoc(sellerRef);

      if (!sellerDoc.exists()) {
        throw new Error("Seller data not found");
      }

      const sellerData = sellerDoc.data();
      const currentWalletBalance = Number(sellerData.walletBalance) || 0;
      const currentPendingAmount = Number(sellerData.pendingAmount) || 0;

      // Check if seller has enough balance
      if (currentWalletBalance < totalProductPrice) {
        setSnackbar({
          open: true,
          message: "Insufficient wallet balance to pick this order",
          severity: "error",
        });
        return;
      }

      // Calculate new amounts
      const newWalletBalance = currentWalletBalance - totalProductPrice;
      const newPendingAmount = currentPendingAmount + grandTotal; // Using Grand Total (price + profit)

      console.log("Order Pick - Wallet Calculations:", {
        currentWalletBalance,
        currentPendingAmount,
        totalProductPrice,
        totalAdditionalProfit,
        grandTotal,
        newWalletBalance,
        newPendingAmount,
      });

      // Update seller's wallet and pending amount
      await updateDoc(sellerRef, {
        walletBalance: newWalletBalance,
        pendingAmount: newPendingAmount,
      });

      // Update order status
      await updateDoc(orderRef, {
        status: "picked",
        statusHistory: arrayUnion({
          status: "picked",
          timestamp: new Date().toISOString(),
          updatedBy: "seller",
        }),
        pickedAt: serverTimestamp(),
        walletDeducted: totalProductPrice,
        pendingAdded: grandTotal, // Using Grand Total (price + profit)
        additionalProfit: totalAdditionalProfit,
      });

      // Update local state
      setSellerOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: "picked",
                pickedAt: new Date(),
                walletDeducted: totalProductPrice,
                pendingAdded: grandTotal, // Using Grand Total (price + profit)
                additionalProfit: totalAdditionalProfit,
              }
            : order,
        ),
      );

      // Update seller data in state
      setSellerData((prevData) => ({
        ...prevData,
        walletBalance: newWalletBalance,
        pendingAmount: newPendingAmount,
      }));

      setSnackbar({
        open: true,
        message: `Order picked successfully. $${totalProductPrice.toFixed(2)} deducted from wallet and $${grandTotal.toFixed(2)} added to pending (includes 23% profit of $${totalAdditionalProfit.toFixed(2)}).`,
        severity: "success",
      });

      // Refresh orders
      fetchSellerOrders();
    } catch (error) {
      console.error("Error picking order:", error);
      setSnackbar({
        open: true,
        message: "Failed to pick order. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "orders") {
      // Set loading state to true before fetching
      setLoading(true);

      // Fetch orders
      fetchSellerOrders().finally(() => {
        // Ensure loading state is set to false after fetching
        setLoading(false);
      });
    }
  }, [activeTab]);

  // Add a separate useEffect to fetch orders when component mounts
  useEffect(() => {
    // Fetch orders when component mounts
    console.log("Component mounted, fetching orders");
    fetchSellerOrders().catch((error) => {
      console.error("Error fetching orders on mount:", error);
    });
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (sellerProducts.length > 0) {
      const filtered = sellerProducts.filter((product) => {
        const nameMatch =
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          !searchQuery;
        const priceMatch =
          searchPrice === "" ||
          (searchPrice &&
            product.price &&
            Number(product.price) <= Number(searchPrice));
        return nameMatch && priceMatch;
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [sellerProducts, searchQuery, searchPrice]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    try {
      // Handle Firestore Timestamp objects
      if (timestamp.toDate && typeof timestamp.toDate === "function") {
        return new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(timestamp.toDate());
      }

      // Handle string timestamps or Date objects
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(date);
      }

      return "Invalid Date";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date Error";
    }
  };

  const renderOrdersContent = () => (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="medium">
          Orders Management
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            setLoading(true);
            fetchSellerOrders().finally(() => setLoading(false));
          }}
          startIcon={<RefreshIcon />}
        >
          Refresh Orders
        </Button>
      </Box>

      {/* console.log("Rendering orders content, orders:", sellerOrders) */}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : sellerOrders.length === 0 ? (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography color="textSecondary">
            No orders received yet. Orders will appear here once customers make
            purchases or admin assigns orders to you.
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Profit</TableCell>
                  <TableCell>Grand Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sellerOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    sx={{
                      bgcolor: order.assignedAt
                        ? alpha(theme.palette.secondary.light, 0.1)
                        : "inherit",
                      "&:hover": {
                        bgcolor: order.assignedAt
                          ? alpha(theme.palette.secondary.light, 0.2)
                          : alpha(theme.palette.primary.light, 0.1),
                      },
                    }}
                  >
                    <TableCell>
                      {order.orderNumber || order.id.substring(0, 8)}
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      {order.customerName || order.customerEmail || "Anonymous"}
                    </TableCell>
                    <TableCell>
                      $
                      {Number(order.total || order.totalAmount || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "medium",
                          color: "success.main",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        $
                        {(
                          Number(order.total || order.totalAmount || 0) * 0.23
                        ).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "medium",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        $
                        {(
                          Number(order.total || order.totalAmount || 0) +
                          Number(order.total || order.totalAmount || 0) * 0.23
                        ).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={
                          order.status === "completed"
                            ? "success"
                            : order.status === "processing"
                              ? "info"
                              : order.status === "assigned"
                                ? "primary"
                                : order.status === "cancelled"
                                  ? "error"
                                  : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {order.assignedByAdmin ? (
                        <Chip
                          label="Admin Assigned"
                          color="secondary"
                          size="small"
                        />
                      ) : (
                        <Chip label="Direct" color="primary" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {/* <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleViewOrderDetails(order)}
                        >
                          VIEW
                        </Button>
                        {order.status === "assigned" && ( */}
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => handlePickOrder(order.id)}
                          >
                            PICK
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Order Details Modal */}
      <Dialog
        open={isOrderDetailsModalOpen}
        onClose={handleCloseOrderDetailsModal}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              Order Details - #
              {selectedOrder.orderNumber || selectedOrder.id.substring(0, 8)}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Customer Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Name:</strong>{" "}
                      {selectedOrder.customerName || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong>{" "}
                      {selectedOrder.customerEmail || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Phone:</strong>{" "}
                      {selectedOrder.customerPhone || "N/A"}
                    </Typography>
                  </Box>

                  <Typography variant="subtitle1" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      {selectedOrder.shippingAddress?.street || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      {selectedOrder.shippingAddress?.city || ""}
                      {selectedOrder.shippingAddress?.city ? ", " : ""}
                      {selectedOrder.shippingAddress?.state || ""}{" "}
                      {selectedOrder.shippingAddress?.zip || ""}
                    </Typography>
                    <Typography variant="body2">
                      {selectedOrder.shippingAddress?.country || ""}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Order Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Order Date:</strong>{" "}
                      {formatDate(selectedOrder.createdAt)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {selectedOrder.status}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Payment Method:</strong>{" "}
                      {selectedOrder.paymentMethod || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Assignment:</strong>{" "}
                      {selectedOrder.assignedAt
                        ? "Assigned by Admin"
                        : "Direct Order"}
                    </Typography>
                    {selectedOrder.assignedAt && (
                      <Typography variant="body2">
                        <strong>Assigned Date:</strong>{" "}
                        {formatDate(selectedOrder.assignedAt)}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Order Items
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell align="center">Quantity</TableCell>
                          <TableCell align="right">Subtotal</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.items?.map((item, index) => (
                          <TableRow key={`order-item-${selectedOrder.id}-${index}-${item.id || item.name}`}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                              ${Number(item.price || 0).toFixed(2)}
                            </TableCell>
                            <TableCell align="center">
                              {item.quantity}
                            </TableCell>
                            <TableCell align="right">
                              $
                              {(
                                Number(item.price || 0) * (item.quantity || 1)
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} align="right">
                            <strong>Subtotal:</strong>
                          </TableCell>
                          <TableCell align="right">
                            ${Number(selectedOrder.subtotal || 0).toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={3} align="right">
                            <strong>Shipping:</strong>
                          </TableCell>
                          <TableCell align="right">
                            ${Number(selectedOrder.shipping || 0).toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={3} align="right">
                            <strong>Total:</strong>
                          </TableCell>
                          <TableCell align="right">
                            $
                            {Number(
                              selectedOrder.total ||
                                selectedOrder.totalAmount ||
                                0,
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Status History
                  </Typography>
                  <List dense>
                    {selectedOrder.statusHistory?.map((status, index) => (
                      <ListItem key={`status-history-${selectedOrder.id}-${index}-${status.timestamp}`}>
                        <ListItemText
                          primary={`${status.status.charAt(0).toUpperCase() + status.status.slice(1)}`}
                          secondary={`${new Date(status.timestamp).toLocaleString()} ${status.note ? `- ${status.note}` : ""}`}
                        />
                      </ListItem>
                    )) || (
                      <ListItem>
                        <ListItemText primary="No status history available" />
                      </ListItem>
                    )}
                  </List>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseOrderDetailsModal}>Close</Button>
              {selectedOrder.status !== "completed" &&
                selectedOrder.status !== "cancelled" && (
                  <>
                    <Button
                      color="primary"
                      onClick={() =>
                        handleUpdateOrderStatus(selectedOrder.id, "processing")
                      }
                    >
                      Mark as Processing
                    </Button>
                    <Button
                      color="success"
                      variant="contained"
                      onClick={() =>
                        handleUpdateOrderStatus(selectedOrder.id, "completed")
                      }
                    >
                      Mark as Completed
                    </Button>
                  </>
                )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );

  const renderPackageContent = () => (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="medium">
        Package Management
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography color="textSecondary">
          Create and manage your product packages here.
        </Typography>
      </Paper>
    </Container>
  );

  const renderSpreadPackagesContent = () => (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="medium">
        Spread Packages
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography color="textSecondary">
          Manage your spread package offerings and track their performance.
        </Typography>
      </Paper>
    </Container>
  );

  const renderAffiliateContent = () => (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="medium">
        Affiliate System
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography color="textSecondary">
          Set up and manage your affiliate program to boost sales.
        </Typography>
      </Paper>
    </Container>
  );

  // Create a new component for withdrawal content
  const WithdrawalContent = () => {
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("USDT");
    const [walletAddress, setWalletAddress] = useState("");
    const [withdrawNote, setWithdrawNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [withdrawHistory, setWithdrawHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [sellerData, setSellerData] = useState(null);
    // Add bank payment fields
    const [bankName, setBankName] = useState("");
    const [bankAccountName, setBankAccountName] = useState("");
    const [bankAccountNumber, setBankAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");

    // Function to fetch withdrawal history
    const fetchWithdrawalHistory = async () => {
      const sellerId = localStorage.getItem('sellerId');
      if (!sellerId) return;

      setHistoryLoading(true);
      try {
        // First try with a simpler query that doesn't require a composite index
        const withdrawalsQuery = query(
          collection(db, "withdrawalRequests"),
          where("sellerId", "==", sellerId),
        );

        // Get the documents
        const withdrawalDocs = await getDocs(withdrawalsQuery);

        // Process the data and sort manually instead of in the query
        const history = withdrawalDocs.docs
          .map((doc) => {
            const data = doc.data();

            // Make sure timestamp is properly converted to Date object
            let timestamp = new Date();
            if (data.timestamp) {
              timestamp = data.timestamp.toDate
                ? data.timestamp.toDate()
                : new Date(data.timestamp);
            }

            return {
              id: doc.id,
              ...data,
              timestamp,
            };
          })
          // Sort manually by timestamp descending
          .sort((a, b) => b.timestamp - a.timestamp);

        setWithdrawHistory(history);
      } catch (error) {
        console.error("Error fetching withdrawal history:", error);
      } finally {
        setHistoryLoading(false);
      }
    };

    // Function to fetch seller data
    const fetchSellerData = async () => {
      const sellerId = localStorage.getItem('sellerId');
      if (!sellerId) return;

      try {
        const sellerDoc = await getDoc(
          doc(db, "sellers", sellerId),
        );
        if (sellerDoc.exists()) {
          setSellerData(sellerDoc.data());
        }
      } catch (error) {
        console.error("Error fetching seller data:", error);
      }
    };

    // Fetch data when component mounts
    useEffect(() => {
      const sellerId = localStorage.getItem('sellerId');
      if (sellerId) {
        fetchSellerData();
        fetchWithdrawalHistory();
      }
    }, []);

    const handleSubmitWithdrawal = async () => {
      // Validate inputs
      if (
        !withdrawAmount ||
        isNaN(withdrawAmount) ||
        parseFloat(withdrawAmount) <= 0
      ) {
        alert("Please enter a valid withdrawal amount");
        return;
      }

      // Validate payment method specific fields
      if (paymentMethod === "Bank") {
        if (
          !bankName.trim() ||
          !bankAccountName.trim() ||
          !bankAccountNumber.trim() ||
          !ifscCode.trim()
        ) {
          alert("Please fill in all bank details");
          return;
        }
      } else if (!walletAddress.trim()) {
        alert("Please enter your wallet address");
        return;
      }

      const amountToWithdraw = parseFloat(withdrawAmount);
      const availableBalance = sellerData?.walletBalance || 0;

      // Check if the seller has enough balance
      if (amountToWithdraw > availableBalance) {
        alert(
          `Insufficient balance. Your available balance is $${availableBalance.toFixed(2)}`,
        );
        return;
      }

      setIsSubmitting(true);
      try {
        // Prepare payment details based on the method
        let paymentDetails = {};

        if (paymentMethod === "Bank") {
          paymentDetails = {
            bankName,
            bankAccountName,
            bankAccountNumber,
            ifscCode,
          };
        } else {
          paymentDetails = {
            walletAddress,
          };
        }

        // Add the withdrawal request to Firestore
        const sellerId = localStorage.getItem('sellerId');
        const sellerEmail = localStorage.getItem('sellerEmail');
        const sellerName = localStorage.getItem('sellerName') || "Unknown";
        
        if (!sellerId) {
          throw new Error("Seller ID not found in localStorage");
        }
        
        const withdrawalRef = await addDoc(
          collection(db, "withdrawalRequests"),
          {
            sellerId: sellerId,
            sellerName: sellerData?.name || sellerName,
            sellerEmail: sellerData?.email || sellerEmail,
            amount: amountToWithdraw,
            paymentMethod,
            paymentDetails,
            note: withdrawNote,
            status: "pending",
            timestamp: serverTimestamp(),
            approvedBy: null,
            approvalDate: null,
            rejectionReason: null,
          },
        );

        // Reset form
        setWithdrawAmount("");
        setWalletAddress("");
        setBankName("");
        setBankAccountName("");
        setBankAccountNumber("");
        setIfscCode("");
        setWithdrawNote("");

        // Refresh withdrawal history immediately
        setTimeout(() => {
          fetchWithdrawalHistory();
        }, 1000); // Small delay to ensure serverTimestamp is processed

        alert(
          "Withdrawal request submitted successfully. The admin will review your request.",
        );
      } catch (error) {
        console.error("Error submitting withdrawal request:", error);
        alert("Failed to submit withdrawal request. Please try again later.");
      } finally {
        setIsSubmitting(false);
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "approved":
          return "success";
        case "rejected":
          return "error";
        case "pending":
        default:
          return "warning";
      }
    };

    // For debugging purposes
    // console.log('Withdrawal history state:', withdrawHistory);
    // console.log('History loading state:', historyLoading);

    // console.log("Withdrawal history state:", withdrawHistory);
    // console.log("History loading state:", historyLoading);

    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="medium">
          Money Withdrawal
        </Typography>

        {/* Withdrawal Request Form */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Request a Withdrawal
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Available Balance:{" "}
              <strong>${(sellerData?.walletBalance || 0).toFixed(2)}</strong>
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount to Withdraw ($)"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                type="number"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                helperText={`Maximum: $${(sellerData?.walletBalance || 0).toFixed(2)}`}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                select
                required
              >
                <MenuItem value="USDT">USDT (TRC20)</MenuItem>
                <MenuItem value="Bitcoin">Bitcoin</MenuItem>
                <MenuItem value="Ethereum">Ethereum</MenuItem>
                <MenuItem value="PayPal">PayPal</MenuItem>
                <MenuItem value="Bank">Bank Transfer</MenuItem>
              </TextField>
            </Grid>

            {paymentMethod === "Bank" ? (
              // Bank payment fields
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bank Account Name"
                    value={bankAccountName}
                    onChange={(e) => setBankAccountName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bank Account Number"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="IFSC Code"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    required
                    helperText="Bank routing or SWIFT/BIC code"
                  />
                </Grid>
              </>
            ) : (
              // Crypto wallet address field
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Wallet Address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                  helperText={`Enter your ${paymentMethod} address or payment details`}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Note (Optional)"
                value={withdrawNote}
                onChange={(e) => setWithdrawNote(e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<WithdrawIcon />}
                onClick={handleSubmitWithdrawal}
                disabled={
                  isSubmitting ||
                  !withdrawAmount ||
                  parseFloat(withdrawAmount) <= 0 ||
                  parseFloat(withdrawAmount) >
                    (sellerData?.walletBalance || 0) ||
                  (paymentMethod === "Bank"
                    ? !bankName ||
                      !bankAccountName ||
                      !bankAccountNumber ||
                      !ifscCode
                    : !walletAddress)
                }
              >
                {isSubmitting ? "Submitting..." : "Request Withdrawal"}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Withdrawal History */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Withdrawal History
            </Typography>
            <Button
              startIcon={<RefreshIcon />}
              size="small"
              onClick={() => fetchWithdrawalHistory()}
              disabled={historyLoading}
            >
              Refresh
            </Button>
          </Box>

          {historyLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : withdrawHistory && withdrawHistory.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Note/Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {withdrawHistory.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        {request.timestamp.toLocaleDateString()}{" "}
                        {request.timestamp.toLocaleTimeString()}
                      </TableCell>
                      <TableCell>${request.amount.toFixed(2)}</TableCell>
                      <TableCell>{request.paymentMethod}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)
                          }
                          color={getStatusColor(request.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {request.status === "rejected" &&
                        request.rejectionReason ? (
                          <Tooltip
                            title={`Rejection reason: ${request.rejectionReason}`}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <InfoOutlined
                                fontSize="small"
                                color="error"
                                sx={{ mr: 1 }}
                              />
                              <Typography variant="body2" color="error">
                                Rejected:{" "}
                                {request.rejectionReason.substring(0, 30)}
                                {request.rejectionReason.length > 30
                                  ? "..."
                                  : ""}
                              </Typography>
                            </Box>
                          </Tooltip>
                        ) : (
                          <>
                            {request.paymentMethod === "Bank" &&
                            request.paymentDetails ? (
                              <Tooltip
                                title={`Bank: ${request.paymentDetails.bankName || "-"}, Account: ${request.paymentDetails.bankAccountName || "-"}, Number: ${request.paymentDetails.bankAccountNumber || "-"}, IFSC: ${request.paymentDetails.ifscCode || "-"}`}
                              >
                                <Box
                                  component="span"
                                  sx={{
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                  }}
                                >
                                  Bank Payment Details
                                </Box>
                              </Tooltip>
                            ) : request.paymentDetails?.walletAddress ? (
                              <Tooltip
                                title={request.paymentDetails.walletAddress}
                              >
                                <Box
                                  component="span"
                                  sx={{
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                  }}
                                >
                                  Wallet Address
                                </Box>
                              </Tooltip>
                            ) : request.walletAddress ? ( // Support for old database entries
                              <Tooltip title={request.walletAddress}>
                                <Box
                                  component="span"
                                  sx={{
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                  }}
                                >
                                  Wallet Address
                                </Box>
                              </Tooltip>
                            ) : (
                              request.note || "-"
                            )}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography color="textSecondary">
                No withdrawal history available.
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => fetchWithdrawalHistory()}
                >
                  Refresh History
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    );
  };

  // Replace the renderWithdrawContent function with a simpler version that renders the component
  const renderWithdrawContent = () => {
    return <WithdrawalContent />;
  };

  const renderConversationsContent = () => (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="medium">
        Conversations
      </Typography>
      <Chat isAdmin={false} />
    </Container>
  );

  const renderSettingsContent = () => (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="medium">
        Shop Settings
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Shop Information</Typography>
          <Button
            variant="outlined"
            color={isSettingsEditable ? "error" : "primary"}
            onClick={toggleSettingsEdit}
            startIcon={isSettingsEditable ? <CloseIcon /> : <EditIcon />}
          >
            {isSettingsEditable ? "Cancel" : "Edit"}
          </Button>
        </Box>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Shop Name"
            value={editableSellerData.shopName}
            onChange={(e) => handleSettingsChange("shopName", e.target.value)}
            margin="normal"
            disabled={!isSettingsEditable}
            required
            error={isSettingsEditable && !editableSellerData.shopName.trim()}
            helperText={
              isSettingsEditable && !editableSellerData.shopName.trim()
                ? "Shop name is required"
                : ""
            }
          />
          <TextField
            fullWidth
            label="Email"
            value={editableSellerData.email}
            onChange={(e) => handleSettingsChange("email", e.target.value)}
            margin="normal"
            disabled={!isSettingsEditable}
            required
            type="email"
            error={
              isSettingsEditable &&
              (!editableSellerData.email.trim() ||
                !editableSellerData.email.includes("@"))
            }
            helperText={
              isSettingsEditable &&
              (!editableSellerData.email.trim() ||
                !editableSellerData.email.includes("@"))
                ? "Please enter a valid email address"
                : ""
            }
          />
          <TextField
            fullWidth
            label="Phone"
            value={editableSellerData.phone}
            onChange={(e) => handleSettingsChange("phone", e.target.value)}
            margin="normal"
            disabled={!isSettingsEditable}
            required
            error={isSettingsEditable && !editableSellerData.phone.trim()}
            helperText={
              isSettingsEditable && !editableSellerData.phone.trim()
                ? "Phone number is required"
                : ""
            }
          />
          {isSettingsEditable && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              startIcon={<SaveIcon />}
              onClick={saveSettings}
              disabled={isSettingsSaving}
            >
              {isSettingsSaving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );

  const renderRefundsContent = () => (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="medium">
        Refund Requests
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography color="textSecondary">
          No refund requests received yet.
        </Typography>
      </Paper>
    </Container>
  );

  const renderProfileContent = () => (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="medium">
        Manage Profile
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Personal Information</Typography>
          <Button
            variant="outlined"
            color={isSettingsEditable ? "error" : "primary"}
            onClick={toggleSettingsEdit}
            startIcon={isSettingsEditable ? <CloseIcon /> : <EditIcon />}
          >
            {isSettingsEditable ? "Cancel" : "Edit"}
          </Button>
        </Box>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {/* Personal Information */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Your Name"
                value={editableSellerData.name}
                onChange={(e) => handleSettingsChange("name", e.target.value)}
                margin="normal"
                disabled={!isSettingsEditable}
                helperText="Optional: Enter your full name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Your Phone"
                value={editableSellerData.phone}
                onChange={(e) => handleSettingsChange("phone", e.target.value)}
                margin="normal"
                disabled={!isSettingsEditable}
                helperText="Optional: Enter your contact number"
              />
            </Grid>

            {/* Email Change */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Email Settings
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                value={editableSellerData.email}
                onChange={(e) => handleSettingsChange("email", e.target.value)}
                type="email"
                disabled={!isSettingsEditable}
                required
                error={
                  editableSellerData.email.trim() &&
                  !editableSellerData.email.includes("@")
                }
                helperText={
                  editableSellerData.email.trim() &&
                  !editableSellerData.email.includes("@")
                    ? "Please enter a valid email address"
                    : ""
                }
              />
            </Grid>

            {/* Password Change */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Change Password
              </Typography>
            </Grid>
            {isSettingsEditable && (
              <>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    value={editableSellerData.currentPassword}
                    onChange={(e) =>
                      handleSettingsChange("currentPassword", e.target.value)
                    }
                    helperText="Required only if changing password"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    value={editableSellerData.newPassword}
                    onChange={(e) =>
                      handleSettingsChange("newPassword", e.target.value)
                    }
                    helperText="Minimum 6 characters"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    value={editableSellerData.confirmPassword}
                    onChange={(e) =>
                      handleSettingsChange("confirmPassword", e.target.value)
                    }
                    error={
                      editableSellerData.newPassword !==
                      editableSellerData.confirmPassword
                    }
                    helperText={
                      editableSellerData.newPassword !==
                      editableSellerData.confirmPassword
                        ? "Passwords do not match"
                        : "Confirm your new password"
                    }
                  />
                </Grid>
              </>
            )}

            {/* Payment Methods */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Payment Methods
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Select your preferred payment methods
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editableSellerData.cashPayment}
                    onChange={(e) =>
                      handleSettingsChange("cashPayment", e.target.checked)
                    }
                    disabled={!isSettingsEditable}
                  />
                }
                label="Cash Payment"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editableSellerData.bankPayment}
                    onChange={(e) =>
                      handleSettingsChange("bankPayment", e.target.checked)
                    }
                    disabled={!isSettingsEditable}
                  />
                }
                label="Bank Payment"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editableSellerData.usdtPayment}
                    onChange={(e) =>
                      handleSettingsChange("usdtPayment", e.target.checked)
                    }
                    disabled={!isSettingsEditable}
                  />
                }
                label="USDT Payment"
              />
            </Grid>

            {/* Bank Details */}
            {editableSellerData.bankPayment && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Bank Details
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Fill all bank details if you want to enable bank payments
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    value={editableSellerData.bankName}
                    onChange={(e) =>
                      handleSettingsChange("bankName", e.target.value)
                    }
                    disabled={!isSettingsEditable}
                    helperText="Enter your bank name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bank Account Name"
                    value={editableSellerData.bankAccountName}
                    onChange={(e) =>
                      handleSettingsChange("bankAccountName", e.target.value)
                    }
                    disabled={!isSettingsEditable}
                    helperText="Enter the name on your bank account"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bank Account Number"
                    value={editableSellerData.bankAccountNumber}
                    onChange={(e) =>
                      handleSettingsChange("bankAccountNumber", e.target.value)
                    }
                    disabled={!isSettingsEditable}
                    helperText="Enter your bank account number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="IFSC Code"
                    value={editableSellerData.ifscCode}
                    onChange={(e) =>
                      handleSettingsChange("ifscCode", e.target.value)
                    }
                    disabled={!isSettingsEditable}
                    helperText="Enter your bank's IFSC code"
                  />
                </Grid>
              </>
            )}

            {/* USDT Details */}
            {editableSellerData.usdtPayment && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    USDT Details
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Fill all USDT details if you want to enable USDT payments
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="USDT Link"
                    value={editableSellerData.usdtLink}
                    onChange={(e) =>
                      handleSettingsChange("usdtLink", e.target.value)
                    }
                    disabled={!isSettingsEditable}
                    helperText="Enter your USDT payment link"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="USDT Address"
                    value={editableSellerData.usdtAddress}
                    onChange={(e) =>
                      handleSettingsChange("usdtAddress", e.target.value)
                    }
                    disabled={!isSettingsEditable}
                    helperText="Enter your USDT wallet address"
                  />
                </Grid>
              </>
            )}
          </Grid>

          {isSettingsEditable && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              startIcon={<SaveIcon />}
              onClick={saveSettings}
              disabled={isSettingsSaving}
            >
              {isSettingsSaving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboardContent();
      case "products":
        return renderProductsContent();
      case "orders":
        return renderOrdersContent();
      case "package":
        return renderPackageContent();
      case "spreadPackages":
        return renderSpreadPackagesContent();
      case "affiliate":
        return renderAffiliateContent();
      case "withdraw":
        return renderWithdrawContent();
      case "conversations":
        return renderConversationsContent();
      case "settings":
        return renderSettingsContent();
      case "refunds":
        return renderRefundsContent();
      case "profile":
        return renderProfileContent();
      default:
        return renderDashboardContent();
    }
  };

  const renderContent = () => {
    // If seller is frozen, only show conversations content
    if (sellerData?.status === 'frozen') {
      return activeTab === "conversations" 
        ? renderConversationsContent() 
        : <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Access restricted. Please navigate to the Conversations tab.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => setActiveTab("conversations")}
            >
              Go to Conversations
            </Button>
          </Box>;
    }

    if (activeTab === "dashboard") {
      return renderDashboardContent();
    } else if (activeTab === "products") {
      return renderProductsContent();
    } else if (activeTab === "orders") {
      // If a sub-tab is active, render that specific view
      if (activeSubTab === "allOrders") {
        return renderAllOrdersContent();
      } else if (activeSubTab === "directOrders") {
        return renderDirectOrdersContent();
      }
      // Default orders view if no sub-tab is selected
      return renderAllOrdersContent();
    } else if (activeTab === "package") {
      return renderPackageContent();
    } else if (activeTab === "spreadPackages") {
      return renderSpreadPackagesContent();
    } else if (activeTab === "affiliate") {
      return renderAffiliateContent();
    } else if (activeTab === "withdraw") {
      return renderWithdrawContent();
    } else if (activeTab === "conversations") {
      return renderConversationsContent();
    } else if (activeTab === "profile") {
      return renderProfileContent();
    } else if (activeTab === "settings") {
      return renderSettingsContent();
    } else if (activeTab === "refunds") {
      return renderRefundsContent();
    }
    // Default to dashboard if no tab matches
    return renderDashboardContent();
  };

  const renderAllOrdersContent = () => {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          All Orders
        </Typography>
        {renderOrdersTable(sellerOrders)}
      </Box>
    );
  };

  const renderAdminAssignedOrdersContent = () => {
    const adminAssignedOrders = sellerOrders.filter(
      (order) => order.assignedAt && order.assignedByAdmin === true,
    );

    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Admin Assigned Orders
        </Typography>
        {adminAssignedOrders.length > 0 ? (
          renderOrdersTable(adminAssignedOrders)
        ) : (
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body1">
              No admin assigned orders found.
            </Typography>
          </Paper>
        )}
      </Box>
    );
  };

  const renderDirectOrdersContent = () => {
    const directOrders = sellerOrders.filter(
      (order) => !order.assignedAt || order.assignedByAdmin !== true,
    );

    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Direct Orders
        </Typography>
        {directOrders.length > 0 ? (
          renderOrdersTable(directOrders)
        ) : (
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body1">No direct orders found.</Typography>
          </Paper>
        )}
      </Box>
    );
  };

  // Update the utility function to calculate order profit
  const calculateOrderProfit = (order) => {
    if (!order || !order.items || order.items.length === 0) {
      return 0;
    }

    // Return the admin-set profit if available
    if (order.profit) {
      return Number(order.profit);
    }

    // Calculate profit based on each item's price and cost (if available)
    let totalProfit = 0;
    order.items.forEach((item) => {
      // Get price from the item
      const price = Number(item.price || 0);

      // Get cost from the item, defaulting to 0 if not available
      const cost = Number(item.cost || 0);

      const quantity = parseInt(item.quantity || 1);

      // Calculate profit (price - cost) * quantity
      totalProfit += (price - cost) * quantity;
    });

    return totalProfit;
  };

  const renderOrdersTable = (orders) => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableCell sx={{ color: "white" }}>Order ID</TableCell>
              <TableCell sx={{ color: "white" }}>Date</TableCell>
              <TableCell sx={{ color: "white" }}>Customer</TableCell>
              <TableCell sx={{ color: "white" }}>Price</TableCell>
              <TableCell sx={{ color: "white" }}>Profit</TableCell>
              <TableCell sx={{ color: "white" }}>Grand Total</TableCell>
              <TableCell sx={{ color: "white" }}>Status</TableCell>
              <TableCell sx={{ color: "white" }}>Source</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  hover
                  sx={{
                    bgcolor: order.assignedAt
                      ? alpha(theme.palette.secondary.light, 0.1)
                      : "inherit",
                    "&:hover": {
                      bgcolor: order.assignedAt
                        ? alpha(theme.palette.secondary.light, 0.2)
                        : alpha(theme.palette.primary.light, 0.1),
                    },
                  }}
                >
                  <TableCell>
                    {order.orderNumber || order.id.substring(0, 8)}
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{order.customerName || "Anonymous"}</TableCell>
                  <TableCell>
                    ${Number(order.total || order.totalAmount || 0).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "medium",
                        color: "success.main",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      $
                      {(
                        Number(order.total || order.totalAmount || 0) * 0.23
                      ).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "medium",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      $
                      {(
                        Number(order.total || order.totalAmount || 0) +
                        Number(order.total || order.totalAmount || 0) * 0.23
                      ).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={
                        order.status === "completed"
                          ? "success"
                          : order.status === "processing"
                            ? "info"
                            : order.status === "assigned"
                              ? "primary"
                              : order.status === "cancelled"
                                ? "error"
                                : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {order.assignedByAdmin ? (
                      <Chip
                        label="Admin Assigned"
                        color="secondary"
                        size="small"
                      />
                    ) : (
                      <Chip label="Direct" color="primary" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {/* <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewOrderDetails(order)}
                      >
                        VIEW
                      </Button> */}
                      {order.status === "assigned" && (
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => handlePickOrder(order.id)}
                        >
                          PICK
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const handleResetPendingWallet = async () => {
    try {
      const sellerId = localStorage.getItem('sellerId');
      
      if (!sellerId) {
        throw new Error("Seller ID not found in localStorage");
      }
      
      const sellerDocRef = doc(db, "sellers", sellerId);
      await updateDoc(sellerDocRef, {
        pendingAmount: 0,
        lastUpdated: serverTimestamp(),
      });

      // Add transaction record
      await addDoc(collection(db, "transactions"), {
        sellerId: sellerId,
        amount: 0,
        type: "pending_reset",
        affectsRevenue: false,
        timestamp: serverTimestamp(),
        note: "Pending wallet reset to 0",
      });

      // Refresh seller data
      const sellerDoc = await getDoc(sellerDocRef);
      if (sellerDoc.exists()) {
        setSellerData(sellerDoc.data());
      }

      alert("Pending wallet has been reset to 0");
    } catch (error) {
      console.error("Error resetting pending wallet:", error);
      alert("Failed to reset pending wallet. Please try again.");
    }
  };

  // Clear search filters when dialog is closed
  const handleProductDialogClose = () => {
    setProductSearchQuery("");
    setProductPriceRange({ min: "", max: "" });
    setIsProductDialogOpen(false);
  };

  // Clear search filters function 
  const clearProductFilters = () => {
    setProductSearchQuery("");
    setProductPriceRange({ min: "", max: "" });
  };
//responsive sidebar
const [toogle, setToogle] = useState(true)


  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}

      <button className='absolute z-20 top-16 mt-1 left-3 flex items-start box-border justify-center px-3 py-1  rounded-lg bg-custom-blue text-white ' onClick={() => setToogle(!toogle)}>
                           
      <div className="flex items-center">
    {/* Hamburger/drawer icon using CSS */}
    <div className="space-y-1 mr-2">
      <div className="w-6 h-0.5 bg-white"></div>
      <div className="w-6 h-0.5 bg-white"></div>
      <div className="w-6 h-0.5 bg-white"></div>
    </div>
    {/* Optional text */}
    <span>Menu</span>
  </div>  
      </button>
      {/* <Box
        component="nav"
        sx={{
          width: 280,
          flexShrink: 0,
          position: "fixed", // Fix the sidebar position
          left: 0, // Align to left
          top: 0, // Align to top
          height: "100vh", // Full viewport height
          backgroundImage:
            "linear-gradient(to bottom, #1a237e, #283593, #303f9f)",
          color: "white",
          overflowY: "auto",
          boxShadow: "2px 0 20px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
          zIndex: 1200, // Ensure sidebar stays above other content
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          },
        }}
      > */}


      <Box
        component="nav"
        className={`md:w-64 ${toogle ? 'block' : 'hidden'} mt-12 fixed top-0 left-0  h-full bg-gradient-to-b from-[#1a237e] to-[#303f9f] text-white overflow-y-auto shadow-lg flex flex-col z-50`}
        style={{
          // Add custom styles that aren't available in Tailwind
          boxShadow: "2px 0 20px rgba(0, 0, 0, 0.2)",
          backgroundImage: `linear-gradient(to bottom, #1a237e, #283593, #303f9f)`,
        }}
      >

        <button className=' absolute mt-16 mt-1 z-50 left-3 flex items-start box-border justify-center px-3 py-1  rounded-lg bg-custom-blue text-white ' onClick={() => setToogle(!toogle)}>
                  X
                </button>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            Seller Dashboard
          </Typography>
          {sellerData?.shopName && (
            <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
              {sellerData.shopName}
            </Typography>
          )}
        </Box>

        <List component="nav" sx={{ px: 2, flexGrow: 1 }}>
          {[
            { icon: <HomeIcon />, text: "Dashboard", value: "dashboard" },
            { icon: <ProductIcon />, text: "Products", value: "products" },
            {
              icon: (
                <Badge
                  badgeContent={adminAssignedOrdersCount}
                  color="secondary"
                  invisible={adminAssignedOrdersCount === 0}
                >
                  <OrderIcon />
                </Badge>
              ),
              text: "Orders",
              value: "orders",
              subItems: [
                { text: "All Orders", value: "allOrders" },
                { text: "Direct Orders", value: "directOrders" },
              ],
            },
            {
              icon: <WithdrawIcon />,
              text: "Money Withdraw",
              value: "withdraw",
            },
            {
              icon: <ConversationsIcon />,
              text: "Conversations",
              value: "conversations",
            },
            { icon: <ProfileIcon />, text: "Manage Profile", value: "profile" },
            { icon: <SettingsIcon />, text: "Shop Setting", value: "settings" },
          ].map((item) => (
            <React.Fragment key={item.value}>
              <ListItemButton
                selected={activeTab === item.value && !activeSubTab}
                onClick={() => {
                  handleTabChange(item.value);
                  setActiveSubTab(null);
                }}
                disabled={sellerData?.status === 'frozen' && item.value !== 'conversations'}
                sx={{
                  mb: item.subItems ? 0 : 1,
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&.Mui-selected": {
                    backgroundColor: "rgba(255, 255, 255, 0.16)",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                  "&.Mui-disabled": {
                    opacity: 0.5,
                    pointerEvents: "none"
                  }
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight:
                      activeTab === item.value && !activeSubTab
                        ? "bold"
                        : "normal",
                    fontSize: "0.95rem",
                  }}
                />
                {item.subItems && (
                  <ExpandMoreIcon
                    sx={{
                      transform: expandedItems.includes(item.value)
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s",
                    }}
                  />
                )}
              </ListItemButton>

              {/* Sub-items */}
              {item.subItems && (
                <Collapse
                  in={expandedItems.includes(item.value)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItemButton
                        key={subItem.value}
                        selected={activeSubTab === subItem.value}
                        onClick={() =>
                          handleSubTabChange(item.value, subItem.value)
                        }
                        disabled={sellerData?.status === 'frozen'}
                        sx={{
                          pl: 4,
                          py: 0.75,
                          borderRadius: 2,
                          ml: 2,
                          mb: 0.5,
                          "&.Mui-selected": {
                            backgroundColor: "rgba(25, 118, 210, 0.08)",
                          },
                          "&.Mui-disabled": {
                            opacity: 0.5,
                            pointerEvents: "none"
                          }
                        }}
                      >
                        <ListItemText
                          primary={subItem.text}
                          primaryTypographyProps={{
                            fontSize: "0.9rem",
                            fontWeight:
                              activeSubTab === subItem.value
                                ? "medium"
                                : "normal",
                          }}
                        />
                        {subItem.badge > 0 && (
                          <Chip
                            label={subItem.badge}
                            size="small"
                            color="secondary"
                            sx={{
                              height: 20,
                              minWidth: 20,
                              fontSize: "0.7rem",
                            }}
                          />
                        )}
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>

        {/* Sign Out Button */}
        <Box sx={{ p: 2, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            onClick={() => auth.signOut()}
            startIcon={<LogoutIcon />}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.3)",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.8)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Box>

      {/* Main content - add margin to account for fixed sidebar */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: "30px", // Match sidebar width
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #f5f7ff, #ffffff)",
          overflowX: "hidden",
        }}
      >
        {sellerData?.status === 'frozen' && (
          <Alert 
            severity="warning" 
            variant="filled"
            sx={{ 
              mb: 2, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              }
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                Your account has been frozen
              </Typography>
              <Typography variant="body2">
                You can only access conversations. Contact admin support for more information.
              </Typography>
            </Box>
          </Alert>
        )}
        
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          renderContent()
        )}
      </Box>

      {/* Chat Window - adjust position to account for sidebar */}
      {/* <ChatWindow
        userRole="seller"
        recipientRole="admin"
        sx={{ marginLeft: "280px" }} // Match sidebar width
      /> */}

      {/* Snackbar - adjust position to account for sidebar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{ marginLeft: "280px" }} // Match sidebar width
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SellerDashboard;
