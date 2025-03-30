import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  ListItemButton,
  styled,
  useTheme,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  alpha,
  Tooltip,
  Zoom,
  useMediaQuery,
  LinearProgress,
  Fade,
  ButtonBase,
  CssBaseline,
  Stack,
  InputAdornment,
  FormHelperText,
  TablePagination,
  Alert,
  Snackbar,
  Link
} from '@mui/material';
import { 
  People as PeopleIcon,
  Store as StoreIcon,
  ShoppingCart as OrderIcon,
  AttachMoney as MoneyIcon,
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  Warehouse as StorehouseIcon,
  LocalShipping as PackageIcon,
  Share as SpreadIcon,
  Group as AffiliateIcon,
  AccountBalance as WithdrawIcon,
  Chat as ConversationsIcon,
  Settings as SettingsIcon,
  AssignmentReturn as RefundIcon,
  KeyboardArrowRight as ArrowRightIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon,
  ShoppingBag as SellersProductsIcon,
  Person as ProfileIcon,
  Edit as EditIcon,
  ArrowUpward as ArrowUpwardIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  MoreVert as MoreVertIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Payment as PaymentIcon,
  AccountBalance as AccountBalanceIcon,
  CurrencyBitcoin as CurrencyBitcoinIcon,
  Block as BlockIcon,
  Save as SaveIcon,
  LocalShipping as LocalShippingIcon,
  Visibility as VisibilityIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Delete as DeleteIcon,
  AssignmentInd as AssignmentIndIcon,
  InfoOutlined as InfoOutlinedIcon,
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, setDoc, addDoc, orderBy, onSnapshot, serverTimestamp, getDoc, arrayUnion, arrayRemove, increment, documentId } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Chat } from './ChatComponents';
import StatusUpdateModal from './StatusUpdateModal';
import WithdrawalRequestsManager from './WithdrawalRequestsManager';
import { addDummyProducts } from '../utils/dummyProducts';

const drawerWidth = 260;

// Calculate the navbar height to position the sidebar correctly
const navbarHeight = 64;

// Create a styled main content area
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3), 
    transition: theme.transitions.create(['margin', 'background'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    background: 'linear-gradient(to bottom, #f5f7ff, #ffffff)',
    ...(open && {
      transition: theme.transitions.create(['margin', 'background'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

// Enhanced styled components
const StyledDashboardCard = styled(Card)(({ theme, color }) => ({
      height: '100%',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 20,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
  background: color ? `linear-gradient(135deg, ${color}, ${alpha(color, 0.8)})` : theme.palette.background.paper,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '150px',
    height: '150px',
    background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '0 0 0 100%',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '120px',
    height: '120px',
    background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '0 100% 0 0',
  },
}));

const StyledSectionCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  overflow: 'visible',
  marginBottom: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  background: 'linear-gradient(to bottom right, #ffffff, #fafbff)',
  '&:hover': {
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-4px)',
  },
  '& .MuiCardHeader-root': {
    paddingBottom: theme.spacing(2),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    position: 'relative',
    background: 'linear-gradient(to right, rgba(63, 81, 181, 0.05), rgba(92, 107, 192, 0.02))',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '60px',
      height: 4,
      background: 'linear-gradient(to right, #3f51b5, #5c6bc0)',
      borderRadius: '0 0 4px 0',
      transition: 'width 0.3s ease'
    }
  },
  '&:hover .MuiCardHeader-root:after': {
    width: '120px',
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(3),
    '& .MuiTableContainer-root': {
      borderRadius: 16,
      boxShadow: 'none',
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    },
    '& .MuiTableHead-root .MuiTableCell-root': {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      color: theme.palette.text.primary,
      fontWeight: 600,
      borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    },
    '& .MuiTableBody-root .MuiTableRow-root:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.02),
    }
  }
}));

const AnimatedAvatar = styled(Avatar)(({ theme, bgColor }) => ({
  backgroundColor: bgColor || alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  width: 64,
  height: 64,
  transform: 'rotate(-5deg)',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'rotate(0deg) scale(1.1)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 36,
    transition: 'transform 0.3s ease',
  },
  '&:hover .MuiSvgIcon-root': {
    transform: 'scale(1.1) rotate(360deg)',
  }
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundImage: 'linear-gradient(135deg, #1a237e, #283593, #303f9f, #3949ab)',
    color: 'white',
    borderRight: 'none',
    boxShadow: '2px 0 20px rgba(0, 0, 0, 0.2)',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.1,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    }
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: 'none',
  overflow: 'hidden',
  '& .MuiTableCell-head': {
    backgroundImage: 'linear-gradient(to right, #3f51b5, #5c6bc0)',
    color: theme.palette.common.white,
    fontWeight: 600,
    padding: theme.spacing(1.5, 2),
    fontSize: '0.875rem',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  '& .MuiTableRow-root:nth-of-type(even)': {
    backgroundColor: alpha(theme.palette.primary.light, 0.04),
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.08),
  },
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
    padding: theme.spacing(1.5, 2),
  },
  '& .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-root': {
    borderBottom: 'none',
  }
}));

const StyledChip = styled(Chip)(({ theme, chipcolor }) => {
  const getColorStyles = () => {
    switch(chipcolor) {
      case 'active':
        return {
          bgcolor: alpha(theme.palette.success.main, 0.12),
          color: theme.palette.success.dark,
          borderColor: alpha(theme.palette.success.main, 0.3),
          '&:hover': {
            bgcolor: alpha(theme.palette.success.main, 0.2),
          }
        };
      case 'pending':
        return {
          bgcolor: alpha(theme.palette.warning.main, 0.12),
          color: theme.palette.warning.dark,
          borderColor: alpha(theme.palette.warning.main, 0.3),
          '&:hover': {
            bgcolor: alpha(theme.palette.warning.main, 0.2),
          }
        };
      case 'frozen':
      case 'canceled':
        return {
          bgcolor: alpha(theme.palette.error.main, 0.12),
          color: theme.palette.error.dark,
          borderColor: alpha(theme.palette.error.main, 0.3),
          '&:hover': {
            bgcolor: alpha(theme.palette.error.main, 0.2),
          }
        };
      default:
        return {
          bgcolor: alpha(theme.palette.grey[500], 0.12),
          color: theme.palette.grey[700],
          borderColor: alpha(theme.palette.grey[500], 0.3),
          '&:hover': {
            bgcolor: alpha(theme.palette.grey[500], 0.2),
          }
        };
    }
  };

  return {
    fontWeight: 600,
    borderRadius: 12,
    border: '1px solid',
    transition: 'all 0.2s ease',
    padding: '4px 12px',
    height: 28,
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      transform: 'translateY(-1px)'
    },
    ...getColorStyles()
  };
});

const SectionHeading = styled(Typography)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(1),
  fontWeight: 700,
  display: 'inline-block',
  '&:after': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 4,
    width: 60,
    backgroundImage: 'linear-gradient(to right, #3f51b5, #9c27b0)',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  '&:hover:after': {
    width: '100%',
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(10px)'
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)'
    }
  },
  animation: 'fadeIn 0.5s ease-out forwards'
}));

const ScrollToTopButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  right: 20,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  boxShadow: theme.shadows[5],
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  zIndex: 1000,
  transition: 'all 0.3s ease',
  transform: 'translateY(100px)',
  opacity: 0,
  '&.visible': {
    transform: 'translateY(0)',
    opacity: 1,
  }
}));

const StyledButton = styled(Button)(({ theme, color = 'primary', size = 'medium' }) => ({
  borderRadius: size === 'small' ? 8 : 12,
  textTransform: 'none',
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  fontWeight: 600,
  padding: size === 'small' ? theme.spacing(0.5, 2) : theme.spacing(1, 2.5),
  '&:hover': {
    transform: color === 'error' ? 'none' : 'translateY(-2px)',
    boxShadow: color === 'error' ? 'none' : '0 4px 12px rgba(0,0,0,0.15)'
  },
  '&.MuiButton-contained': {
    backgroundImage: color === 'primary' ? 
      'linear-gradient(135deg, #3f51b5, #5c6bc0)' : 
      color === 'success' ? 
        'linear-gradient(135deg, #4caf50, #66bb6a)' : 
        color === 'error' ? 
          'linear-gradient(135deg, #f44336, #e57373)' : undefined,
    '&:hover': {
      backgroundImage: color === 'primary' ? 
        'linear-gradient(135deg, #303f9f, #3f51b5)' : 
        color === 'success' ? 
          'linear-gradient(135deg, #388e3c, #4caf50)' : 
          color === 'error' ? 
            'linear-gradient(135deg, #d32f2f, #f44336)' : undefined,
    }
  },
  '&.MuiButton-outlined': {
    borderWidth: 2,
    '&:hover': {
      borderWidth: 2
    }
  }
}));

const DashboardCard = ({ title, value, icon, color, onClick }) => {
  return (
    <StyledDashboardCard 
      elevation={1} 
      color={color}
    onClick={onClick}
  >
    <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" position="relative" zIndex={1}>
          <Box sx={{ mr: 2 }}>
            <Typography 
              variant="subtitle2" 
              gutterBottom 
          sx={{ 
                fontWeight: 600, 
                color: color ? 'rgba(255,255,255,0.9)' : 'text.secondary',
                fontSize: '0.875rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                mb: 1
              }}
            >
            {title}
          </Typography>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 700, 
                color: color ? 'white' : 'text.primary',
                textShadow: color ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
            >
            {value}
          </Typography>
        </Box>
          <AnimatedAvatar
            bgColor={color ? 'rgba(255, 255, 255, 0.2)' : undefined}
            sx={{ 
              color: color ? 'white' : 'primary.main',
              boxShadow: color ? '0 4px 20px rgba(0,0,0,0.2)' : undefined
            }}
          >
            {icon}
          </AnimatedAvatar>
      </Box>
    </CardContent>
    </StyledDashboardCard>
);
};

const SectionCard = ({ title, children, action }) => (
  <StyledSectionCard elevation={1}>
    <CardHeader
      title={
        <Typography variant="h6" fontWeight="600" sx={{ 
          position: 'relative',
          display: 'inline-block',
          color: 'text.primary',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -4,
            left: 0,
            width: 40,
            height: 3,
            backgroundColor: 'primary.main',
            borderRadius: 1.5,
            transition: 'width 0.3s ease'
          },
          '&:hover:after': {
            width: '100%'
          }
        }}>
          {title}
        </Typography>
      }
      action={action}
      sx={{ px: 3, py: 2.5 }}
    />
    <CardContent sx={{ p: 3, pt: 2 }}>
      {children}
    </CardContent>
  </StyledSectionCard>
);

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
    background: 'linear-gradient(to bottom right, #ffffff, #fafbff)',
  },
  '& .MuiDialogTitle-root': {
    background: 'linear-gradient(to right, rgba(63, 81, 181, 0.05), rgba(92, 107, 192, 0.02))',
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    padding: theme.spacing(3),
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2, 3),
    background: alpha(theme.palette.background.default, 0.04),
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    '&.Mui-focused': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    }
  }
}));

// Enhanced OrderDetailsModal for admin view
const OrderDetailsModal = ({ open, order, onClose, onUpdateStatus }) => {
  if (!order) return null;

  const formatDate = (timestamp) => {
    try {
      // Check if timestamp is a Firestore timestamp
      if (timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toLocaleString();
      }
      // Check if timestamp is a Date object
      else if (timestamp instanceof Date) {
        return timestamp.toLocaleString();
      }
      // Check if timestamp is a number (seconds or milliseconds since epoch)
      else if (typeof timestamp === 'number') {
        // Adjust for seconds vs milliseconds
        const dateTimestamp = timestamp > 9999999999 ? timestamp : timestamp * 1000;
        return new Date(dateTimestamp).toLocaleString();
      }
      // Handle string dates or timestamps
      else if (timestamp) {
        return new Date(timestamp).toLocaleString();
      }
      // If no valid timestamp, return current date/time
      return new Date().toLocaleString();
    } catch (error) {
      console.error('Error formatting date:', error);
      // Return current date instead of 'Invalid date'
      return new Date().toLocaleString();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-modal={true}
      disablePortal={false}
      keepMounted
      container={document.body}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Order Details - #{order.orderNumber || order.id.substring(0, 8)}
          </Typography>
          <Chip
            label={order.status}
            color={
              order.status === 'completed' ? 'success' :
              order.status === 'processing' ? 'info' :
              order.status === 'assigned' ? 'primary' :
              order.status === 'cancelled' ? 'error' : 'default'
            }
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Customer Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Customer Information
            </Typography>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="textSecondary">Name:</Typography>
                <Typography variant="body1">{order.customerName || 'N/A'}</Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="textSecondary">Email:</Typography>
                <Typography variant="body1">{order.customerEmail || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Phone:</Typography>
                <Typography variant="body1">{order.customerPhone || 'N/A'}</Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Shipping Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Shipping Information
            </Typography>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="textSecondary">Delivery Address:</Typography>
                <Typography variant="body1">{order.shippingAddress || 'No address provided'}</Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="textSecondary">Order Date:</Typography>
                <Typography variant="body1">{formatDate(order.orderDate) || formatDate(order.createdAt) || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Payment Method:</Typography>
                <Typography variant="body1">{order.paymentMethod || 'Not specified'}</Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Order Items */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Order Items
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <img
                            src={item.imageUrl || '/images/placeholder.png'}
                            alt={item.name}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                              marginRight: 10,
                              borderRadius: 4
                            }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight="500">{item.name}</Typography>
                            {item.seller && (
                              <Typography variant="caption" color="text.secondary">
                                Seller: {item.seller.shopName || 'Unknown'}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>${parseFloat(item.price).toFixed(2)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell align="right">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="subtitle2">Total:</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" color="primary">
                        ${parseFloat(order.total).toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// Add the ProductModal component before the AdminDashboard component
const ProductModal = ({ open, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    stock: '',
    discount: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price ? String(product.price) : '',
        imageUrl: product.imageUrl || '',
        category: product.category || '',
        stock: product.stock ? String(product.stock) : '',
        discount: product.discount ? String(product.discount) : ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: '',
        stock: '',
        discount: ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const processedData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      discount: parseInt(formData.discount) || 0
    };

    onSave(processedData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            required
            fullWidth
            name="name"
            label="Product Name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            required
            fullWidth
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            name="imageUrl"
            label="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            required
            fullWidth
            name="category"
            label="Category"
            value={formData.category}
            onChange={handleChange}
            margin="normal"
            select
          >
            <MenuItem value="electronics">Electronics</MenuItem>
            <MenuItem value="clothing">Clothing</MenuItem>
            <MenuItem value="books">Books</MenuItem>
            <MenuItem value="home">Home & Garden</MenuItem>
            <MenuItem value="toys">Toys & Games</MenuItem>
            <MenuItem value="sports">Sports & Outdoors</MenuItem>
            <MenuItem value="beauty">Beauty & Personal Care</MenuItem>
            <MenuItem value="automotive">Automotive</MenuItem>
          </TextField>
          <TextField
            required
            fullWidth
            name="price"
            label="Price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            margin="normal"
            inputProps={{ min: 0, step: "0.01" }}
          />
          <TextField
            required
            fullWidth
            name="stock"
            label="Stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            margin="normal"
            inputProps={{ min: 0 }}
          />
          <TextField
            fullWidth
            name="discount"
            label="Discount (%)"
            type="number"
            value={formData.discount}
            onChange={handleChange}
            margin="normal"
            inputProps={{ min: 0, max: 100 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {product ? 'Save Changes' : 'Add Product'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // State declarations
  const [pendingSellers, setPendingSellers] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalSellers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewingCustomers, setIsViewingCustomers] = useState(false);
  const [isViewingProducts, setIsViewingProducts] = useState(false);
  const [sellers, setSellers] = useState([]);
  const [availableSellers, setAvailableSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedSellerId, setSelectedSellerId] = useState('');
  const [isSellerEditModalOpen, setIsSellerEditModalOpen] = useState(false);
  const [isViewingSellers, setIsViewingSellers] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [sellerWithProducts, setSellerWithProducts] = useState([]);
  const [sellersProductsLoading, setSellersProductsLoading] = useState(false);
  const [customerProfiles, setCustomerProfiles] = useState([]);
  const [selectedCustomerProfile, setSelectedCustomerProfile] = useState(null);
  const [isCustomerProfileModalOpen, setIsCustomerProfileModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedOrderInTable, setSelectedOrderInTable] = useState(null);
  const [isOrderTableModalOpen, setIsOrderTableModalOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const [isAssignOrderModalOpen, setIsAssignOrderModalOpen] = useState(false);
  const [orderToAssign, setOrderToAssign] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isStatusUpdateModalOpen, setIsStatusUpdateModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Create a ref for the payment method input
  const paymentMethodInputRef = useRef(null);
  
  // Helper function for date formatting
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    try {
      // Check if timestamp is a Firestore timestamp
      if (timestamp && typeof timestamp.toDate === 'function') {
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(timestamp.toDate());
      }
      // Check if timestamp is a Date object
      else if (timestamp instanceof Date) {
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(timestamp);
      }
      // Check if timestamp is a number (seconds or milliseconds since epoch)
      else if (typeof timestamp === 'number') {
        // Adjust for seconds vs milliseconds
        const dateTimestamp = timestamp > 9999999999 ? timestamp : timestamp * 1000;
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(new Date(dateTimestamp));
      }
      // Handle string dates or timestamps
      else if (timestamp) {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
          return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }).format(date);
        }
      }
      
      console.warn("Unable to format date:", timestamp);
      return "N/A";
    } catch (error) {
      console.error('Error formatting date:', error, timestamp);
      return "N/A";
    }
  };
  
  // Define a local placeholder image path
  const placeholderImage = process.env.PUBLIC_URL + '/images/product1.jpg';

  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin',
    email: 'admin@example.com',
    role: 'Administrator',
    lastLogin: new Date().toISOString()
  });

  // Add state for profile edit mode and dialog visibility
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);

  // Add these state declarations with the other state declarations in the main component (around line 810-870)
  const [sellersProductsPage, setSellersProductsPage] = useState(0);
  const [sellersProductsRowsPerPage, setSellersProductsRowsPerPage] = useState(10);

  // Add these state declarations near other state declarations
  const [sellersCache, setSellersCache] = useState({});
  const [lastSellersRefresh, setLastSellersRefresh] = useState(null);
  const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  // Add this with the other state variables
  const [sellerEmailSearch, setSellerEmailSearch] = useState('');
  const [orderEmailSearch, setOrderEmailSearch] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  
  useEffect(() => {
    if (activeTab === 'storehouse' || activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'sellersProducts') {
      fetchSellersWithProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  // Add a separate useEffect to fetch data on initial load
  useEffect(() => {
    fetchDashboardData();
    initializeProduct();
    
    // Fetch sellers and products for the Sellers Products section
    fetchSellers();
    fetchProducts();
    
    // Always fetch sellers with products on component mount
    fetchSellersWithProducts();
    
    // Fetch orders on mount
    fetchOrders();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchPendingSellers(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingSellers = async () => {
    try {
      const sellersRef = collection(db, 'sellers');
      const q = query(sellersRef, where('status', '==', 'pending'));
      const querySnapshot = await getDocs(q);
      
      const pendingSellers = [];
      querySnapshot.forEach((docSnapshot) => {
        pendingSellers.push({ id: docSnapshot.id, ...docSnapshot.data() });
      });
      
      setPendingSellers(pendingSellers);
    } catch (error) {
      console.error('Error fetching pending sellers:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch customers count
      const customersSnapshot = await getDocs(collection(db, 'customers'));
      const customersCount = customersSnapshot.size;

      // Fetch active sellers count
      const sellersRef = collection(db, 'sellers');
      const activeSellersQuery = query(sellersRef, where('status', '==', 'active'));
      const activeSellersSnapshot = await getDocs(activeSellersQuery);
      const activeSellersCount = activeSellersSnapshot.size;

      // Fetch orders count and calculate revenue
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const ordersCount = ordersSnapshot.size;
      
      let totalRevenue = 0;
      ordersSnapshot.forEach((doc) => {
        const orderData = doc.data();
        if (orderData.total) {
          totalRevenue += parseFloat(orderData.total);
        }
      });

      setStats({
        totalCustomers: customersCount,
        totalSellers: activeSellersCount,
        totalOrders: ordersCount,
        totalRevenue: totalRevenue.toFixed(2)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSellerApproval = async (sellerId, status) => {
    try {
      const sellerRef = doc(db, 'sellers', sellerId);
      await updateDoc(sellerRef, {
        status: status === 'approved' ? 'active' : status, // Set status to 'active' when approved
        approvalRequest: {
          status: status === 'approved' ? 'active' : status,
          updatedAt: new Date().toISOString()
        }
      });

      // Refresh the pending sellers list and stats
      await Promise.all([
        fetchPendingSellers(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Error updating seller status:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Fetch data based on the selected tab
    if (tab === 'sellersProducts') {
      fetchSellersWithProducts();
    } else if (tab === 'products' || tab === 'storehouse') {
      fetchProducts();
    }
  };

  const fetchCustomers = async () => {
    try {
      const customersSnapshot = await getDocs(collection(db, 'customers'));
      const customersData = [];
      customersSnapshot.forEach((docSnapshot) => {
        customersData.push({ id: docSnapshot.id, ...docSnapshot.data() });
      });
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleCustomerEdit = async (customerId, updatedData) => {
    try {
      const customerRef = doc(db, 'customers', customerId);
      await updateDoc(customerRef, updatedData);
      await fetchCustomers();
      setIsEditModalOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleCustomerDelete = async (customerId) => {
    try {
      await deleteDoc(doc(db, 'customers', customerId));
      await fetchCustomers();
      await fetchStats(); // Refresh the stats to update total customers
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const fetchSellers = async () => {
    try {
      const sellersRef = collection(db, 'sellers');
      // Modified query to include both active and frozen sellers
      const q = query(sellersRef, where('status', 'in', ['active', 'frozen']));
      const querySnapshot = await getDocs(q);
      
      const sellersData = [];
      querySnapshot.forEach((docSnapshot) => {
        const sellerData = docSnapshot.data();
        // Ensure all required fields are initialized
        if (!sellerData.paymentMethods) {
          sellerData.paymentMethods = [];
        }
        if (!sellerData.address) {
          sellerData.address = '';
        }
        // Make sure to include the actual password from Firestore
        sellersData.push({ 
          id: docSnapshot.id, 
          ...sellerData,
          password: sellerData.plainPassword || sellerData.password || 'N/A' // Try both password fields
        });
      });
      
      // Sort sellers by registration date (newest first)
      sellersData.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setSellers(sellersData);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching sellers data',
        severity: 'error'
      });
    }
  };

  const handleSellerEdit = async (sellerId, updatedData) => {
    try {
      const sellerRef = doc(db, 'sellers', sellerId);
      await updateDoc(sellerRef, updatedData);
      await fetchSellers();
      await fetchStats(); // Refresh stats to update active sellers count
      setIsSellerEditModalOpen(false);
      setSelectedSeller(null);
    } catch (error) {
      console.error('Error updating seller:', error);
    }
  };

  const handleSellerDelete = async (sellerId) => {
    try {
      await deleteDoc(doc(db, 'sellers', sellerId));
      await fetchSellers();
      await fetchStats(); // Refresh stats to update active sellers count
    } catch (error) {
      console.error('Error deleting seller:', error);
    }
  };

  const handleDeactivateSeller = async (sellerId) => {
    try {
      // Use the more consistent handleUpdateSellerStatus function
      await handleUpdateSellerStatus(sellerId, 'frozen');
      
      // Refresh stats (already handled in handleUpdateSellerStatus)
      await fetchStats();
    } catch (error) {
      console.error('Error deactivating seller:', error);
      alert('Failed to deactivate seller. Please try again.');
    }
  };

  const initializeProduct = async () => {
    try {
      const productRef = doc(db, 'products', '1');
      const productDoc = await getDoc(productRef);

      if (!productDoc.exists()) {
        // Only create if product doesn't exist
        await setDoc(productRef, {
          id: '1',
          name: 'Toy Car',
          description: 'A beautiful and durable toy car for children. Perfect for playtime and collecting. Features smooth rolling wheels and detailed design.',
          imageUrl: process.env.PUBLIC_URL + '/images/product1.jpg',
          price: 20,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        // console.log('Product initialized successfully');
      }
      
      // Fetch products to refresh the display
      await fetchProducts();
    } catch (error) {
      console.error('Error initializing product:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      const querySnapshot = await getDocs(productsRef);
      
      const productsData = [];
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        // Add default cost if not present (50% of price)
        const price = parseFloat(data.price) || 0;
        const cost = data.cost ? parseFloat(data.cost) : price * 0.5;
        
        productsData.push({ 
          id: docSnapshot.id, 
          ...data,
          price: price,
          cost: cost
        });
      });
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchSellersWithProducts = async (forceRefresh = false) => {
    setSellersProductsLoading(true);
    
    try {
      // Check if we have valid cached data
      const currentTime = new Date().getTime();
      if (
        !forceRefresh && 
        lastSellersRefresh && 
        (currentTime - lastSellersRefresh < CACHE_EXPIRY_TIME) && 
        sellerWithProducts.length > 0
      ) {
        // Use cached data if it's less than 5 minutes old
        setSellersProductsLoading(false);
        return;
      }

      // Fetch all sellers first (with a smaller payload)
      const sellersQuery = query(
        collection(db, 'sellers')
        // Firebase v9 doesn't support select like this
      );
      const sellersSnapshot = await getDocs(sellersQuery);
      
      // Initialize an array to collect all product IDs from all sellers
      let allProductIds = [];
      let sellerMap = {};
      
      // Collect all product IDs and build a seller lookup map
      sellersSnapshot.docs.forEach(sellerDoc => {
        const sellerData = {
          id: sellerDoc.id,
          ...sellerDoc.data()
        };
        
        // Only process sellers who have products
        if (sellerData.products && sellerData.products.length > 0) {
          // Add product IDs to the collection list
          allProductIds = [...allProductIds, ...sellerData.products];
          
          // Map each product ID to its seller
          sellerData.products.forEach(productId => {
            sellerMap[productId] = {
              id: sellerData.id,
              name: sellerData.name || 'Unnamed Seller',
              shopName: sellerData.shopName || 'Unnamed Shop',
              email: sellerData.email || 'No email'
            };
          });
        }
      });
      
      // If no products found, set empty array and return early
      if (allProductIds.length === 0) {
        setSellerWithProducts([]);
        setSellersProductsLoading(false);
        setLastSellersRefresh(currentTime);
        return;
      }
      
      // Filter out duplicate product IDs to avoid fetching the same product multiple times
      const uniqueProductIds = [...new Set(allProductIds)];
      
      // Check if we have any cached products we can use
      let productsToBeFetched = [];
      let cachedResults = [];
      
      if (sellersCache && Object.keys(sellersCache).length > 0) {
        uniqueProductIds.forEach(productId => {
          if (sellersCache[productId]) {
            // Use cached product data
            cachedResults.push({
              ...sellersCache[productId],
              seller: sellerMap[productId]
            });
          } else {
            // Need to fetch this product
            productsToBeFetched.push(productId);
          }
        });
      } else {
        productsToBeFetched = uniqueProductIds;
      }
      
      // Fetch products in larger batches to reduce round trips
      const batchSize = 20; // Increased from 10 to 20
      let productResults = [...cachedResults]; // Start with cached results
      
      // Process product IDs in batches
      for (let i = 0; i < productsToBeFetched.length; i += batchSize) {
        const batch = productsToBeFetched.slice(i, i + batchSize);
        
        // Using an in query for multiple documents at once
        if (batch.length > 0) {
          const productsQuery = query(
            collection(db, 'products'),
            where(documentId(), 'in', batch)
            // Firebase v9 doesn't support select like this
          );
          
          const productsSnapshot = await getDocs(productsQuery);
          
          // Process the results
          productsSnapshot.docs.forEach(productDoc => {
            const productId = productDoc.id;
            const productData = productDoc.data();
            
            if (sellerMap[productId]) {
              // Store in the cache
              setSellersCache(prev => ({
                ...prev,
                [productId]: {
                  id: productId,
                  ...productData
                }
              }));
              
              // Add to results
              productResults.push({
                id: productId,
                ...productData,
                seller: sellerMap[productId]
              });
            }
          });
        }
      }
      
      setSellerWithProducts(productResults);
      setLastSellersRefresh(currentTime);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching sellers with products:', error);
    } finally {
      setSellersProductsLoading(false);
    }
  };

  const handleRemoveProductFromSeller = async (sellerId, productId) => {
    try {
      // Get the seller document
      const sellerRef = doc(db, 'sellers', sellerId);
      const sellerDoc = await getDoc(sellerRef);
      
      if (!sellerDoc.exists()) {
        alert('Seller not found');
        return;
      }
      
      const sellerData = sellerDoc.data();
      
      // Check if the seller has the product
      if (!sellerData.products || !sellerData.products.includes(productId)) {
        alert('This product is not associated with this seller');
        return;
      }
      
      // Remove the product from the seller's products array
      const updatedProducts = sellerData.products.filter(id => id !== productId);
      
      // Update the seller document
      await updateDoc(sellerRef, {
        products: updatedProducts
      });
      
      // Update the local state immediately to avoid waiting for a full reload
      setSellerWithProducts(prevProducts => 
        prevProducts.filter(product => 
          !(product.id === productId && product.seller.id === sellerId)
        )
      );
      
      // Success notification
      setSnackbar({
        open: true,
        message: 'Product removed from seller successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error removing product from seller:', error);
      setSnackbar({
        open: true,
        message: 'Failed to remove product from seller: ' + error.message,
        severity: 'error'
      });
    }
  };

  // Function to assign a product to a seller (for testing)
  const assignProductToSeller = async (sellerId, productId) => {
    try {
      // Get the seller document
      const sellerRef = doc(db, 'sellers', sellerId);
      const sellerDoc = await getDoc(sellerRef);
      
      if (!sellerDoc.exists()) {
        console.error('Seller not found');
        return;
      }
      
      const sellerData = sellerDoc.data();
      
      // Check if the seller already has the product
      const currentProducts = sellerData.products || [];
      if (currentProducts.includes(productId)) {
        console.log('Seller already has this product');
        return;
      }
      
      // Add the product to the seller's products array
      const updatedProducts = [...currentProducts, productId];
      
      // Update the seller document
      await updateDoc(sellerRef, {
        products: updatedProducts
      });
      
      console.log(`Product ${productId} assigned to seller ${sellerId}`);
      
      // Refresh the sellers with products data
      await fetchSellersWithProducts();
    } catch (error) {
      console.error('Error assigning product to seller:', error);
    }
  };

  const handleProductEdit = async (productData) => {
    try {
      setLoading(true);
      
      if (editingProduct) {
        // Updating existing product
        const updatedData = {
          ...editingProduct,
          ...productData,
          updatedAt: serverTimestamp(),
        };

        // Remove any undefined or null values
        Object.keys(updatedData).forEach(key => {
          if (updatedData[key] === undefined || updatedData[key] === null) {
            delete updatedData[key];
          }
        });

        // Update in Firestore
        const productRef = doc(db, 'products', editingProduct.id);
        await updateDoc(productRef, updatedData);

        // Update local state
        setProducts(prevProducts => 
          prevProducts.map(p => 
            p.id === editingProduct.id ? { ...p, ...updatedData } : p
          )
        );

        setSnackbar({
          open: true,
          message: 'Product updated successfully',
          severity: 'success'
        });
      } else {
        // Adding new product
        const newProduct = {
          ...productData,
          isDummy: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'products'), newProduct);
        const addedProduct = { id: docRef.id, ...newProduct };
        
        setProducts(prevProducts => [...prevProducts, addedProduct]);

        setSnackbar({
          open: true,
          message: 'Product added successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setSnackbar({
        open: true,
        message: 'Error updating product: ' + error.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setProductModalOpen(false);
      setEditingProduct(null);
    }
  };

  const handleProductDelete = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      await fetchProducts();
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const fetchCustomerProfiles = async () => {
    try {
      setLoading(true);
      const customersRef = collection(db, 'customers');
      const customersSnapshot = await getDocs(customersRef);
      
      const profiles = [];
      customersSnapshot.forEach((doc) => {
        profiles.push({ id: doc.id, ...doc.data() });
      });
      
      setCustomerProfiles(profiles);
    } catch (error) {
      console.error('Error fetching customer profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerProfileUpdate = async (customerId, updatedData) => {
    try {
      const customerRef = doc(db, 'customers', customerId);
      await updateDoc(customerRef, updatedData);
      
      setSnackbar({
        open: true,
        message: 'Customer profile updated successfully!',
        severity: 'success'
      });
      
      // Refresh customer profiles
      fetchCustomerProfiles();
      setIsCustomerProfileModalOpen(false);
    } catch (error) {
      console.error('Error updating customer profile:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update customer profile',
        severity: 'error'
      });
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersRef = collection(db, 'orders');
      const ordersQuery = query(
        ordersRef,
        orderBy('createdAt', 'desc')
      );
      
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData = [];
      let pendingCount = 0;
      
      ordersSnapshot.forEach((doc) => {
        const orderData = doc.data();
        // Properly handle Firestore timestamp conversion
        const createdAt = orderData.createdAt && typeof orderData.createdAt.toDate === 'function'
          ? orderData.createdAt.toDate()
          : orderData.createdAt
            ? new Date(orderData.createdAt)
            : new Date();
            
        ordersData.push({ 
          id: doc.id, 
          ...orderData,
          createdAt: createdAt
        });
        
        if (orderData.status === 'pending') {
          pendingCount++;
        }
      });
      
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      setPendingOrdersCount(pendingCount);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.code === 'failed-precondition' || error.message.includes('requires an index')) {
        alert('Please wait while we set up the database. This may take a few minutes. If the issue persists, please contact support.');
        // Provide link to create index
        // console.log('Create the required index here:', error.message.split('https')[1]);
      } else {
      setSnackbar({
        open: true,
        message: 'Failed to fetch orders',
        severity: 'error'
      });
      }
    } finally {
      setLoading(false);
    }
  };

  // Track guarantee money amounts even outside the orders tab
  useEffect(() => {
    const fetchGuaranteeMoneyCount = async () => {
      try {
        const ordersRef = collection(db, 'orders');
        const pendingOrdersQuery = query(
          ordersRef,
          where('status', '==', 'pending')
        );
        
        const pendingOrdersSnapshot = await getDocs(pendingOrdersQuery);
        setPendingOrdersCount(pendingOrdersSnapshot.size);
      } catch (error) {
        console.error('Error fetching guarantee money count:', error);
        if (error.code === 'failed-precondition' || error.message.includes('requires an index')) {
          // Silent fail for index creation
          // console.log('Create the required index here:', error.message.split('https')[1]);
        }
      }
    };

    const unsubscribe = onSnapshot(
      query(
        collection(db, 'orders'),
        where('status', '==', 'pending')
      ),
      (snapshot) => {
        setPendingOrdersCount(snapshot.size);
      },
      (error) => {
        console.error('Error in guarantee money listener:', error);
      }
    );

    fetchGuaranteeMoneyCount();
    
    return () => unsubscribe();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      
      // Get the order details
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        throw new Error('Order not found');
      }
      
      const orderData = orderDoc.data();
      const now = new Date();
      
      // Update the order status
      await updateDoc(orderRef, {
        status: newStatus,
        statusHistory: arrayUnion({
          status: newStatus,
          timestamp: now.toISOString(),
          updatedBy: 'admin',
          note: `Status updated to ${newStatus} by admin`
        })
      });
      
      // If the new status is 'completed' and the order has a seller, transfer the pending amount to the seller's wallet
      if (newStatus === 'completed' && orderData.sellerId) {
        // Check if this order has been picked by a seller and has a pending amount
        if (orderData.pickedAt && orderData.pendingAdded) {
          const pendingAmount = Number(orderData.pendingAdded) || 0;
          
          if (pendingAmount > 0) {
            // Get the seller's current data
            const sellerRef = doc(db, 'sellers', orderData.sellerId);
            const sellerDoc = await getDoc(sellerRef);
            
            if (sellerDoc.exists()) {
              const sellerData = sellerDoc.data();
              const currentWalletBalance = Number(sellerData.walletBalance) || 0;
              const currentPendingAmount = Number(sellerData.pendingAmount) || 0;
              
              // Calculate new balances
              const newWalletBalance = currentWalletBalance + pendingAmount;
              const newPendingAmount = Math.max(0, currentPendingAmount - pendingAmount);
              
              // Update seller's wallet and pending amounts
              await updateDoc(sellerRef, {
                walletBalance: newWalletBalance,
                pendingAmount: newPendingAmount,
                lastUpdated: serverTimestamp()
              });
              
              // Add a transaction record
              await addDoc(collection(db, 'transactions'), {
                orderId: orderId,
                sellerId: orderData.sellerId,
                amount: pendingAmount,
                type: 'order_completed',
                timestamp: serverTimestamp(),
                description: `Order #${orderData.orderNumber || orderId.substring(0, 8)} completed. ${pendingAmount.toFixed(2)} transferred from pending to wallet.`
              });
              
              // Update the order with transfer information
              await updateDoc(orderRef, {
                pendingTransferred: pendingAmount,
                transferredAt: serverTimestamp()
              });
              
              // console.log(`Transferred $${pendingAmount.toFixed(2)} from pending to wallet for seller ${orderData.sellerId}`);
            }
          }
        }
      }

      // Refresh orders list
      await fetchOrders();

      setSnackbar({
        open: true,
        message: `Order status updated to ${newStatus}${newStatus === 'completed' ? ' and pending amount transferred to seller wallet' : ''}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update order status',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailsModalOpen(true);
  };

  const handleCloseOrderDetailsModal = () => {
    setIsOrderDetailsModalOpen(false);
    setSelectedOrder(null);
  };

  const renderDashboardContent = () => {
    return (
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Total Customers"
              value={stats.totalCustomers}
              icon={<PeopleIcon />}
              color="#3f51b5"
              onClick={() => handleTabChange('customers')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Active Sellers"
              value={stats.totalSellers}
              icon={<StoreIcon />}
              color="#f44336"
              onClick={() => handleTabChange('sellers')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Guarantee Money"
              value={pendingOrdersCount}
              icon={<LocalShippingIcon />}
              color="#ff9800"
              onClick={() => handleTabChange('orders')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Total Revenue"
              value={`$${stats.totalRevenue}`}
              icon={<MoneyIcon />}
              color="#4caf50"
              onClick={() => handleTabChange('revenue')}
            />
          </Grid>
        </Grid>
        
        {/* Pending sellers section with improved styling */}
        {pendingSellers.length > 0 && (
          <SectionCard 
            title="Pending Seller Approval Requests" 
            action={
              <StyledButton 
                startIcon={<RefreshIcon />} 
                size="small" 
                onClick={fetchPendingSellers} 
                variant="outlined"
              >
                Refresh
              </StyledButton>
            }
          >
            <StyledTableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
                    <TableCell>Shop Name</TableCell>
                    <TableCell>Seller Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
                    <TableCell>Registration Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>View Password</TableCell>
                    <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
                  {pendingSellers.map((seller) => (
                    <TableRow key={seller.id} hover>
                <TableCell>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {seller.shopName}
                        </Typography>
                    </TableCell>
                      <TableCell>{seller.name}</TableCell>
                      <TableCell>{seller.email}</TableCell>
                      <TableCell>{seller.phone}</TableCell>
                    <TableCell>
                        {new Date(seller.createdAt).toLocaleDateString()}
                    </TableCell>
                      <TableCell>{seller.status}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {seller.plainPassword || seller.password || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Approve Seller">
                          <StyledButton
                            variant="contained"
                        size="small"
                            color="success"
                            onClick={() => handleSellerApproval(seller.id, 'active')}
                            sx={{ mr: 1 }}
                            startIcon={<CheckCircleIcon />}
                          >
                            Approve
                          </StyledButton>
                        </Tooltip>
                        <Tooltip title="Reject Application">
                          <StyledButton
                    variant="outlined"
                            color="error"
                    size="small"
                    onClick={() => {
                              if (window.confirm('Are you sure you want to reject this seller?')) {
                                handleSellerApproval(seller.id, 'rejected');
                              }
                    }}
                            startIcon={<CancelIcon />}
                          >
                            Reject
                          </StyledButton>
                        </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
            </StyledTableContainer>
    </SectionCard>
        )}

        {/* Quick Actions Section */}
        <SectionCard title="Quick Actions">
              <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Box 
                sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
                    borderColor: 'primary.main',
                  }
                }}
                onClick={() => handleTabChange('orders')}
              >
                <Avatar sx={{ bgcolor: alpha('#2196F3', 0.1), color: '#2196F3', mr: 2 }}>
                  <OrderIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">Manage Orders</Typography>
                    <Typography variant="body2" color="text.secondary">
                    View and update customer orders
                    </Typography>
                    </Box>
                    </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box 
                sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
                    borderColor: 'primary.main',
                  }
                }}
                onClick={() => handleTabChange('products')}
              >
                <Avatar sx={{ bgcolor: alpha('#4CAF50', 0.1), color: '#4CAF50', mr: 2 }}>
                  <ProductsIcon />
                </Avatar>
                                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">Manage Products</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add, edit or remove products
                                    </Typography>
                                </Box>
                              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box 
                sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
                    borderColor: 'primary.main',
                  }
                }}
                onClick={() => handleTabChange('sellersProducts')}
              >
                <Avatar sx={{ bgcolor: alpha('#9C27B0', 0.1), color: '#9C27B0', mr: 2 }}>
                  <SellersProductsIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">Seller Products</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage seller product assignments
                      </Typography>
                  </Box>
                </Box>
            </Grid>
            </Grid>
        </SectionCard>
      </Box>
    );
  };

  const renderTabContent = () => {
    if (activeTab === 'dashboard') {
      if (isViewingSellers) {
        return (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, ml: 0 }}>
              <Typography variant="h4" gutterBottom fontWeight="medium">
                Seller Management
              </Typography>
              <Button 
                startIcon={<ArrowBackIcon />} 
                variant="outlined" 
                onClick={() => setIsViewingSellers(false)}
              >
                Back to Dashboard
              </Button>
            </Box>

            <SectionCard 
              title="All Sellers"
              action={
                <Button 
                  startIcon={<RefreshIcon />} 
                  variant="outlined" 
                  size="small"
                  onClick={fetchSellers}
                >
                  Refresh
                </Button>
              }
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Shop Name</TableCell>
                      <TableCell>Seller Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Registration Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>View Password</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sellers.map((seller) => (
                      <TableRow key={seller.id}>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {seller.shopName}
                          </Typography>
                        </TableCell>
                        <TableCell>{seller.name}</TableCell>
                        <TableCell>{seller.email}</TableCell>
                        <TableCell>{seller.phone}</TableCell>
                        <TableCell>
                          {new Date(seller.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{seller.status}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {seller.plainPassword || seller.password || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => {
                              const sellerWithDefaults = {
                                ...seller,
                                address: seller.address || '',
                                paymentMethods: seller.paymentMethods || []
                              };
                              setSelectedSeller(sellerWithDefaults);
                              setIsSellerEditModalOpen(true);
                            }}
                            sx={{ mr: 1 }}
                            startIcon={<EditIcon />}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to remove this seller?')) {
                                handleSellerDelete(seller.id);
                              }
                            }}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </SectionCard>
          </Box>
        );
      }

      if (isViewingCustomers) {
        return (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, ml: 0 }}>
              <Typography variant="h4" gutterBottom fontWeight="medium">
                Customer Management
              </Typography>
              <Button 
                startIcon={<ArrowBackIcon />} 
                variant="outlined" 
                onClick={() => setIsViewingCustomers(false)}
              >
                Back to Dashboard
              </Button>
            </Box>

            <SectionCard title="All Customers">
              <TableContainer>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Registration Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.address}</TableCell>
                        <TableCell>
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setIsEditModalOpen(true);
                            }}
                            sx={{ mr: 1 }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to remove this customer?')) {
                                handleCustomerDelete(customer.id);
                              }
                            }}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </SectionCard>

            {/* Edit Customer Modal */}
            <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
              <DialogTitle>Edit Customer</DialogTitle>
              <DialogContent>
                <Box component="form" sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    defaultValue={selectedCustomer?.name}
                    margin="normal"
                    onChange={(e) => {
                      setSelectedCustomer({
                        ...selectedCustomer,
                        name: e.target.value
                      });
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    defaultValue={selectedCustomer?.email}
                    margin="normal"
                    onChange={(e) => {
                      setSelectedCustomer({
                        ...selectedCustomer,
                        email: e.target.value
                      });
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    defaultValue={selectedCustomer?.phone}
                    margin="normal"
                    onChange={(e) => {
                      setSelectedCustomer({
                        ...selectedCustomer,
                        phone: e.target.value
                      });
                    }}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button 
                  onClick={() => handleCustomerEdit(selectedCustomer.id, {
                    name: selectedCustomer.name,
                    email: selectedCustomer.email,
                    phone: selectedCustomer.phone
                  })}
                  variant="contained"
                >
                  Save Changes
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        );
      }

      return (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, ml: 0 }}>
            <Typography variant="h4" fontWeight="medium">
              Admin Dashboard
            </Typography>
            <Button 
              startIcon={<RefreshIcon />} 
              variant="outlined" 
              onClick={fetchDashboardData}
              disabled={loading}
            >
              Refresh Data
            </Button>
          </Box>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard 
                title="Total Customers" 
                value={stats.totalCustomers} 
                icon={<PeopleIcon fontSize="large" />} 
                color="#4CAF50"
                onClick={() => {
                  setIsViewingCustomers(true);
                  fetchCustomers();
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard 
                title="Active Sellers" 
                value={stats.totalSellers} 
                icon={<StoreIcon fontSize="large" />} 
                color="#2196F3"
                onClick={() => {
                  setIsViewingSellers(true);
                  fetchSellers();
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard 
                title="Total Orders" 
                value={stats.totalOrders} 
                icon={<OrderIcon fontSize="large" />} 
                color="#FF9800"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard 
                title="Total Revenue" 
                value={`$${stats.totalRevenue}`} 
                icon={<MoneyIcon fontSize="large" />} 
                color="#9C27B0"
              />
            </Grid>
          </Grid>

          <SectionCard 
            title="Pending Seller Approvals" 
            action={
              <Badge 
                badgeContent={pendingSellers.length} 
                color="error" 
                sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 20, minWidth: 20 } }}
              >
                <Typography variant="subtitle2" color="primary">
                  {pendingSellers.length} {pendingSellers.length === 1 ? 'Request' : 'Requests'}
                </Typography>
              </Badge>
            }
          >
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>Shop Name</TableCell>
                    <TableCell>Seller Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Registration Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>View Password</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingSellers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Box py={3}>
                          <Typography color="textSecondary">
                            No pending approval requests
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    pendingSellers.map((seller) => (
                      <TableRow key={seller.id}>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {seller.shopName}
                          </Typography>
                        </TableCell>
                        <TableCell>{seller.name}</TableCell>
                        <TableCell>{seller.email}</TableCell>
                        <TableCell>{seller.phone}</TableCell>
                        <TableCell>
                          {new Date(seller.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{seller.status}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {seller.plainPassword || seller.password || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleSellerApproval(seller.id, 'approved')}
                            sx={{ mr: 1 }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleSellerApproval(seller.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </SectionCard>

          <SectionCard title="Recent Activity">
            <Typography color="textSecondary">
              No recent activity to display
            </Typography>
          </SectionCard>
        </Box>
      );
    } else if (activeTab === 'sellerProfiles') {
      return renderSellerProfilesContent();
    } else if (activeTab === 'products') {
      return (
        <Box sx={{ width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Products Management
          </Typography>
          <SectionCard title="All Products">
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                View all products below. To edit or delete products, please go to the Product Storehouse section.
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product ID</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>
                        <Box
                          component="img"
                          src={product.imageUrl}
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = placeholderImage;
                          }}
                          sx={{
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 1,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            backgroundColor: '#f5f5f5',
                            display: 'block',
                            border: '1px solid #e0e0e0'
                          }}
                          loading="lazy"
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>${product.price || 20}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </SectionCard>
        </Box>
      );
    } else if (activeTab === 'storehouse') {
      return (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Product Storehouse</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={handleGenerateDummyProducts}
                disabled={loading}
              >
                Generate 200 Dummy Products
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingProduct(null);
                  setProductModalOpen(true);
                }}
              >
                Add New Product
              </Button>
            </Box>
          </Box>
          <SectionCard title="Inventory">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product ID</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>
                        <Box
                          component="img"
                          src={product.imageUrl}
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = placeholderImage;
                          }}
                          sx={{
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 1,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            backgroundColor: '#f5f5f5',
                            display: 'block',
                            border: '1px solid #e0e0e0'
                          }}
                          loading="lazy"
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>${product.price || 0}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => {
                            setEditingProduct(product);
                            setProductModalOpen(true);
                          }}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this product?')) {
                              handleProductDelete(product.id);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </SectionCard>

          <ProductModal
            open={productModalOpen}
            onClose={() => {
              setProductModalOpen(false);
              setEditingProduct(null);
            }}
            product={editingProduct}
            onSave={handleProductEdit}
          />
        </Box>
      );
    } else if (activeTab === 'orders') {
      return renderOrdersContent();
    } else if (activeTab === 'package') {
      return (
        <Box sx={{ width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Package Management
          </Typography>
          <SectionCard title="All Packages">
            <Typography color="textSecondary">
              Package management features will appear here
            </Typography>
          </SectionCard>
        </Box>
      );
    } else if (activeTab === 'spreadPackages') {
      return (
        <Box sx={{ width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Spread Packages
          </Typography>
          <SectionCard title="All Spread Packages">
            <Typography color="textSecondary">
              Spread package features will appear here
            </Typography>
          </SectionCard>
        </Box>
      );
    } else if (activeTab === 'affiliate') {
      return (
        <Box sx={{ width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Affiliate System
          </Typography>
          <SectionCard title="Affiliate Management">
            <Typography color="textSecondary">
              Affiliate system features will appear here
            </Typography>
          </SectionCard>
        </Box>
      );
    } else if (activeTab === 'withdraw') {
      return (
        <Box sx={{ width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Money Withdrawal Requests
          </Typography>
          <WithdrawalRequestsManager />
        </Box>
      );
    } else if (activeTab === 'conversations') {
      return (
        <Box sx={{ width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Conversations
          </Typography>
          <Chat isAdmin={true} />
        </Box>
      );
    } else if (activeTab === 'settings') {
      return (
        <Box sx={{ width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Shop Settings
          </Typography>
          <SectionCard title="General Settings">
            <Typography color="textSecondary">
              Shop settings will appear here
            </Typography>
          </SectionCard>
        </Box>
      );
    } else if (activeTab === 'refunds') {
      return (
        <Box sx={{ width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Received Refund Requests
          </Typography>
          <SectionCard title="All Refund Requests">
            <Typography color="textSecondary">
              Refund request features will appear here
            </Typography>
          </SectionCard>
        </Box>
      );
    } else if (activeTab === 'sellersProducts') {
      return renderSellersProductsContent();
    } else if (activeTab === 'customerProfiles') {
      return renderCustomerProfilesContent();
    } else if (activeTab === 'sellerProfiles') {
      return renderSellerProfilesContent();
    } else if (activeTab === 'addMoney') {
      return <AddMoneyForm />;
    } else if (activeTab === 'adminProfile') {
      return (
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1a237e', fontWeight: 'bold' }}>
            Admin Profile
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: '#1a237e', mr: 2 }}>
                        <ProfileIcon />
                      </Avatar>
                      <Typography variant="h6">Profile Information</Typography>
                    </Box>
                  }
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body1">{adminProfile.name}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">{adminProfile.email}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Role
                      </Typography>
                      <Typography variant="body1">{adminProfile.role}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Last Login
                      </Typography>
                      <Typography variant="body1">
                        {new Date(adminProfile.lastLogin).toLocaleString()}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEditProfileOpen}
                    sx={{
                      bgcolor: '#1a237e',
                      '&:hover': {
                        bgcolor: '#283593',
                      },
                    }}
                  >
                    Edit Profile
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: '#1a237e', mr: 2 }}>
                        <SettingsIcon />
                      </Avatar>
                      <Typography variant="h6">Security Settings</Typography>
                    </Box>
                  }
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={handleChangePasswordOpen}
                      sx={{ borderColor: '#1a237e', color: '#1a237e' }}
                    >
                      Change Password
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SettingsIcon />}
                      sx={{ borderColor: '#1a237e', color: '#1a237e' }}
                    >
                      Two-Factor Authentication
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Edit Profile Dialog */}
          <Dialog open={isEditProfileOpen} onClose={handleEditProfileClose} maxWidth="sm" fullWidth>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EditIcon sx={{ mr: 1, color: '#1a237e' }} />
                <Typography variant="h6">Edit Profile</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              {profileUpdateSuccess ? (
                <Alert severity="success" sx={{ my: 2 }}>
                  Profile updated successfully!
                </Alert>
              ) : (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Name"
                    name="name"
                    value={profileFormData.name}
                    onChange={handleProfileInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Email"
                    name="email"
                    type="email"
                    value={profileFormData.email}
                    onChange={handleProfileInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Role"
                    name="role"
                    value={profileFormData.role}
                    onChange={handleProfileInputChange}
                    sx={{ mb: 2 }}
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEditProfileClose} color="primary">
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateProfile} 
                color="primary" 
                variant="contained"
                disabled={profileUpdateSuccess}
                sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#283593' } }}
              >
                {profileUpdateSuccess ? 'Updated' : 'Save Changes'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Change Password Dialog */}
          <Dialog open={isChangePasswordOpen} onClose={handleChangePasswordClose} maxWidth="sm" fullWidth>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SettingsIcon sx={{ mr: 1, color: '#1a237e' }} />
                <Typography variant="h6">Change Password</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              {passwordUpdateSuccess ? (
                <Alert severity="success" sx={{ my: 2 }}>
                  Password updated successfully!
                </Alert>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {passwordError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {passwordError}
                    </Alert>
                  )}
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordFormData.currentPassword}
                    onChange={handlePasswordInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordFormData.newPassword}
                    onChange={handlePasswordInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordFormData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    error={passwordFormData.confirmPassword !== passwordFormData.newPassword && passwordFormData.confirmPassword !== ''}
                    helperText={passwordFormData.confirmPassword !== passwordFormData.newPassword && passwordFormData.confirmPassword !== '' ? 'Passwords do not match' : ''}
                    sx={{ mb: 2 }}
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleChangePasswordClose} color="primary">
                Cancel
              </Button>
              <Button 
                onClick={handleUpdatePassword} 
                color="primary" 
                variant="contained" 
                disabled={passwordUpdateSuccess}
                sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#283593' } }}
              >
                {passwordUpdateSuccess ? 'Updated' : 'Update Password'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      );
    } else if (activeTab === 'spreadPackages') {
      return (
        <Box sx={{ width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Spread Packages
          </Typography>
          <SectionCard title="All Spread Packages">
            <Typography color="textSecondary">
              Spread package features will appear here
            </Typography>
          </SectionCard>
        </Box>
      );
    } else if (activeTab === 'viewSellerProfile') {
      return (
        <Box sx={{ width: '100%' }}>
          <Typography variant="h4" gutterBottom fontWeight="medium">
            Seller Profiles
          </Typography>
          <SectionCard title="All Sellers">
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Shop Name</TableCell>
                    <TableCell>Registration Date</TableCell>
                    <TableCell>Wallet Balance</TableCell>
                    {/* <TableCell>Pending Wallet</TableCell> */}
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sellers.map((seller) => (
                    <TableRow key={seller.id}>
                      <TableCell>{seller.name}</TableCell>
                      <TableCell>{seller.email}</TableCell>
                      <TableCell>{seller.phone || 'N/A'}</TableCell>
                      <TableCell>{seller.shopName || 'N/A'}</TableCell>
                      <TableCell>
                        {seller.registrationDate ? new Date(seller.registrationDate.toDate()).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        ${(seller.walletBalance || 0).toFixed(2)}
                      </TableCell>
                      {/* <TableCell>
                        ${(seller.pendingWallet || 0).toFixed(2)}
                      </TableCell> */}
                      <TableCell>
                        <Tooltip title={`Click to ${seller.status?.toLowerCase() === 'active' ? 'freeze' : 'activate'} seller`}>
                          <Chip 
                            label={seller.status?.toLowerCase() || 'active'} 
                            color={seller.status?.toLowerCase() === 'active' ? 'success' : 'error'}
                            size="small"
                            onClick={() => {
                              const newStatus = seller.status?.toLowerCase() === 'active' ? 'frozen' : 'active';
                              const action = newStatus === 'active' ? 'activate' : 'freeze';
                              
                              if (window.confirm(`Are you sure you want to ${action} this seller?`)) {
                                handleUpdateSellerStatus(seller.id, newStatus);
                              }
                            }}
                            sx={{ 
                              cursor: 'pointer',
                              '&:hover': { 
                                opacity: 0.8,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
                              },
                              transition: 'all 0.2s',
                              fontWeight: 'medium'
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          onClick={() => setSelectedSeller(seller)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditSeller(seller)}
                          color="secondary"
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </SectionCard>
        </Box>
      );
    }
    
    return null;
  };

  const renderSellerProfilesContent = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Seller Profiles
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Shop Name</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Wallet Balance</TableCell>
              <TableCell>Seller Country</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sellers.map((seller) => (
              <TableRow key={seller.id}>
                <TableCell>{seller.name || 'No Name'}</TableCell>
                <TableCell>{seller.email}</TableCell>
                <TableCell>{seller.phone}</TableCell>
                <TableCell>{seller.shopName}</TableCell>
                <TableCell>{seller.createdAt ? formatDate(seller.createdAt) : 'N/A'}</TableCell>
                <TableCell>${(seller.walletBalance || 0).toFixed(2)}</TableCell>
                <TableCell>{seller.country || 'N/A'}</TableCell>
                <TableCell>
                  <Chip 
                    label={seller.status || 'pending'} 
                    color={seller.status === 'active' ? 'success' :
                           seller.status === 'pending' ? 'warning' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditSeller(seller)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to remove this seller?')) {
                          handleSellerDelete(seller.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                    {seller.status === 'active' && (
                      <Button
                        variant="outlined"
                        color="warning"
                        size="small"
                        startIcon={<BlockIcon />}
                        onClick={() => handleDeactivateSeller(seller.id)}
                      >
                        Deactivate
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderSellersProductsContent = () => {
    // Filter products based on search term if it exists
    const filteredProducts = sellerEmailSearch 
      ? sellerWithProducts.filter(product => 
          product.seller && 
          product.seller.email && 
          product.seller.email.toLowerCase().includes(sellerEmailSearch.toLowerCase())
        )
      : sellerWithProducts;
      
    // Calculate pagination based on filtered products
    const startIndex = sellersProductsPage * sellersProductsRowsPerPage;
    const endIndex = startIndex + sellersProductsRowsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Handle page change
    const handleSellersProductsPageChange = (event, newPage) => {
      setSellersProductsPage(newPage);
    };
    
    // Handle rows per page change
    const handleSellersProductsRowsPerPageChange = (event) => {
      setSellersProductsRowsPerPage(parseInt(event.target.value, 10));
      setSellersProductsPage(0);
    };
    
    // Force refresh data
    const handleForceRefresh = () => {
      fetchSellersWithProducts(true); // Pass true to force refresh
    };
    
    return (
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" gutterBottom fontWeight="medium">
          Sellers Products
        </Typography>
        
        <SectionCard title="All Sellers Products">
          {/* Add search bar */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <TextField
              label="Search by Seller Email"
              variant="outlined"
              size="small"
              fullWidth
              value={sellerEmailSearch}
              onChange={(e) => {
                setSellerEmailSearch(e.target.value);
                setSellersProductsPage(0); // Reset to first page on search
              }}
              sx={{ maxWidth: 400, mr: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: sellerEmailSearch ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSellerEmailSearch('');
                        setSellersProductsPage(0);
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }}
            />
            <Button 
              startIcon={<RefreshIcon />} 
              onClick={handleForceRefresh}
              disabled={sellersProductsLoading}
              variant="outlined"
            >
              Refresh
            </Button>
          </Box>
          
          {sellersProductsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Seller Name</TableCell>
                      <TableCell>Seller Email</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedProducts.map((product) => (
                      <TableRow key={`${product.id}-${product.seller.id}`}>
                        <TableCell>
                          <Box
                            component="img"
                            src={product.imageUrl}
                            alt={product.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = process.env.PUBLIC_URL + '/images/product1.jpg';
                            }}
                            sx={{
                              width: 60,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 1
                            }}
                            loading="lazy"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.description?.substring(0, 50)}{product.description?.length > 50 ? '...' : ''}
                          </Typography>
                        </TableCell>
                        <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                        <TableCell>{product.category || 'Uncategorized'}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {product.seller.shopName || 'Unnamed Shop'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {product.seller.name || 'No name'}
                          </Typography>
                        </TableCell>
                        <TableCell>{product.seller.email || 'No email'}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleRemoveProductFromSeller(product.seller.id, product.id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                          <Typography color="text.secondary">
                            {sellerEmailSearch 
                              ? `No products found for seller email containing "${sellerEmailSearch}"` 
                              : 'No products available'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {filteredProducts.length > 0 && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredProducts.length}
                  rowsPerPage={sellersProductsRowsPerPage}
                  page={sellersProductsPage}
                  onPageChange={handleSellersProductsPageChange}
                  onRowsPerPageChange={handleSellersProductsRowsPerPageChange}
                />
              )}
            </>
          )}
        </SectionCard>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            {filteredProducts.length} products from 
            {sellerEmailSearch 
              ? ` sellers matching "${sellerEmailSearch}"` 
              : ' various sellers'}
            {lastSellersRefresh && (
              <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: 'gray' }}>
                (Last updated: {new Date(lastSellersRefresh).toLocaleTimeString()})
              </span>
            )}
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderOrdersContent = () => {
    return (
        <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
              Orders Management
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              setLoading(true);
              fetchOrders().finally(() => setLoading(false));
            }}
          >
            Refresh Orders
          </Button>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search by customer email"
            value={orderEmailSearch}
            onChange={(e) => setOrderEmailSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
              ),
              endAdornment: orderEmailSearch ? (
                <IconButton size="small" onClick={() => setOrderEmailSearch('')}>
                  <CloseIcon />
                </IconButton>
              ) : null
            }}
            size="small"
          />
        </Box>
        
        <Paper sx={{ width: '100%', overflow: 'hidden', mb: 4 }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="orders table">
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Product Names</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Shipping Address</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>{order.orderNumber || order.id.substring(0, 8)}</TableCell>
                      <TableCell>{order.customerName || order.customerEmail || 'Anonymous'}</TableCell>
                      <TableCell>{order.customerEmail || 'No email'}</TableCell>
                      <TableCell>
                        <Tooltip title={order.items?.map(item => `${item.name} (x${item.quantity})`).join('\n') || 'No products'}>
                          <span>
                            {order.items?.map(item => item.name).join(', ').slice(0, 30)}
                            {order.items && order.items.join(', ').length > 30 ? '...' : ''}
                            {!order.items && 'No products'}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <Tooltip title={String(order.shippingAddress || 'No address provided')}>
                          <span>
                            {String(order.shippingAddress || 'No address').slice(0, 20)}
                            {order.shippingAddress && String(order.shippingAddress).length > 20 ? '...' : ''}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{order.customerPhone || 'No phone'}</TableCell>
                      <TableCell>${parseFloat(order.total).toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={
                            order.status === 'completed' ? 'success' :
                            order.status === 'processing' ? 'info' :
                            order.status === 'assigned' ? 'primary' :
                            order.status === 'cancelled' ? 'error' : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                      {order.sellerId ? (
                        <Tooltip title="View seller details">
                          <Chip 
                            label={sellers.find(s => s.id === order.sellerId)?.email || 'Unknown Seller'} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            onClick={() => {
                              // View seller details logic here
                              handleTabChange('sellerProfiles');
                              // Additional logic to focus on this seller
                            }}
                          />
                        </Tooltip>
                      ) : (
                        <Chip label="Unassigned" size="small" color="default" variant="outlined" />
                      )}
                      </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                        <IconButton
                          size="small"
                            color="primary"
                            onClick={() => handleViewDetails(order)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Update Status">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsStatusUpdateModalOpen(true);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {order.status !== 'cancelled' && (
                          <Tooltip title={order.sellerId ? "Reassign Order" : "Assign to Seller"}>
                            <IconButton 
                              size="small" 
                              color={order.sellerId ? "secondary" : "success"}
                              onClick={() => handleOpenAssignModal(order)}
                            >
                              <AssignmentIndIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredOrders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          </Paper>

        {/* Order Details Modal */}
        <OrderDetailsModal
          open={isOrderTableModalOpen}
          order={selectedOrderInTable}
          onClose={() => {
            setIsOrderTableModalOpen(false);
            setSelectedOrderInTable(null);
          }}
          onUpdateStatus={handleUpdateOrderStatus}
        />
        
        {/* Assign Order Modal */}
        <AssignOrderModal
          open={isAssignOrderModalOpen}
          order={orderToAssign}
          onClose={handleCloseAssignModal}
          onAssign={handleAssignOrder}
        />
        
        {/* Status Update Modal */}
        <StatusUpdateModal
          open={isStatusUpdateModalOpen}
          order={selectedOrder}
          onClose={() => {
            setIsStatusUpdateModalOpen(false);
            setSelectedOrder(null);
          }}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      </Box>
    );
  };

  const renderCustomerProfilesContent = () => (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom fontWeight="medium">
        Customer Profiles
      </Typography>
      <SectionCard title="All Customer Profiles">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customerProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>{profile.name}</TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>{profile.phone}</TableCell>
                  <TableCell>{profile.address}</TableCell>
                  <TableCell>{new Date(profile.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setSelectedCustomerProfile(profile);
                        setIsCustomerProfileModalOpen(true);
                      }}
                    >
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SectionCard>
    </Box>
  );

  // Function to handle scroll to top
  const scrollToTop = () => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Add scroll event listener to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.querySelector('main');
      if (mainContent) {
        setShowScrollTop(mainContent.scrollTop > 300);
      }
    };

    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (mainContent) {
        mainContent.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleUpdateSellerStatus = async (sellerId, newStatus) => {
    try {
      // Normalize the status to lowercase
      const normalizedStatus = newStatus.toLowerCase();
      
      await updateDoc(doc(db, 'sellers', sellerId), {
        status: normalizedStatus,
        updatedAt: serverTimestamp()
      });

      // Update local state
      setSellers(sellers.map(seller => 
        seller.id === sellerId 
          ? { ...seller, status: normalizedStatus }
          : seller
      ));

      // Refresh data that might be affected by status change
      fetchSellersWithProducts();

      // Show success message
      setSnackbar({
        open: true,
        message: `Seller ${normalizedStatus === 'active' ? 'activated' : 'frozen'} successfully`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating seller status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update seller status',
        severity: 'error'
      });
    }
  };

  const AddMoneyForm = () => {
    const [sellers, setSellers] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    // Add the missing handler functions
    const handleSellerChange = (event) => {
      setSelectedSeller(event.target.value);
    };

    const handleAmountChange = (event) => {
      // Ensure only positive numbers are entered
      const value = event.target.value;
      if (value === '' || (Number(value) >= 0 && !value.includes('.'))) {
        setAmount(value);
      }
    };

    // Fetch sellers when component mounts
    useEffect(() => {
      fetchSellersList();
    }, []);

    const fetchSellersList = async () => {
      setLoading(true);
      try {
        const sellersSnapshot = await getDocs(collection(db, 'sellers'));
        const sellersList = sellersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSellers(sellersList);
      } catch (error) {
        console.error('Error fetching sellers:', error);
        alert('Failed to load sellers. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    const handleAddMoney = async () => {
      if (!selectedSeller || !amount) {
        alert('Please select a seller and enter an amount.');
        return;
      }
      
      if (parseFloat(amount) <= 0) {
        alert('Please enter a valid amount greater than 0.');
        return;
      }
      
      setLoading(true);
      try {
        const sellerDocRef = doc(db, 'sellers', selectedSeller);
        const sellerDoc = await getDoc(sellerDocRef);
        
        if (!sellerDoc.exists()) {
          alert('Seller not found.');
          setLoading(false);
          return;
        }
        
        const sellerData = sellerDoc.data();
        const currentBalance = sellerData.walletBalance || 0;
        const currentRevenue = sellerData.totalRevenue || 0;
        const amountToAdd = parseFloat(amount);
        
        // Calculate new values
        const newBalance = currentBalance + amountToAdd;
        const newRevenue = currentRevenue + amountToAdd;

        // Update both wallet balance and revenue
        await updateDoc(sellerDocRef, {
          walletBalance: newBalance,
          totalRevenue: newRevenue,
          lastUpdated: serverTimestamp()
        });

        // Add transaction record
        await addDoc(collection(db, 'transactions'), {
          sellerId: selectedSeller,
          amount: amountToAdd,
          type: 'admin_deposit',
          affectsRevenue: true,
          timestamp: serverTimestamp(),
          previousBalance: currentBalance,
          newBalance: newBalance,
          previousRevenue: currentRevenue,
          newRevenue: newRevenue,
          note: 'Manual deposit by admin'
        });

        // Refresh stats to update revenue display
        fetchStats();
        
        alert(`Successfully updated:\n- Added $${amountToAdd.toFixed(2)} to wallet\n- New Balance: $${newBalance.toFixed(2)}\n- New Revenue: $${newRevenue.toFixed(2)}`);
        setSelectedSeller('');
        setAmount('');
        
      } catch (error) {
        console.error('Error adding funds:', error);
        alert('Failed to add funds. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Add Money to Seller's Wallet
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="seller-select-label">Select Seller</InputLabel>
            <Select
              labelId="seller-select-label"
              id="seller-select"
              value={selectedSeller}
              label="Select Seller"
              onChange={handleSellerChange}
            >
              {sellers.map(seller => (
                <MenuItem key={seller.id} value={seller.id}>
                  {seller.name || 'Unnamed'} - {seller.email} (Current Balance: ${seller.walletBalance ? seller.walletBalance.toFixed(2) : '0.00'})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddMoney}
            disabled={!selectedSeller || !amount}
            fullWidth
          >
            ADD MONEY TO WALLET
          </Button>
        </Paper>
      </Box>
    );
  };

  // Add the AddMoneyForm to the sidebar
  const renderSidebarContent = () => (
    <Box sx={{ mt: 2 }}>
      <List>
        <ListItemButton 
          onClick={() => handleTabChange('dashboard')}
          selected={activeTab === 'dashboard'}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              },
            },
          }}
        >
          <ListItemIcon>
            <DashboardIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton 
          onClick={() => handleTabChange('adminProfile')}
          selected={activeTab === 'adminProfile'}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              },
            },
          }}
        >
          <ListItemIcon>
            <ProfileIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Admin Profile" />
        </ListItemButton>

        {/* Other sidebar items */}
        <ListItem button onClick={() => setActiveTab('addMoney')}>
          <ListItemText primary="Add Money" />
        </ListItem>
      </List>
    </Box>
  );

  // Add a function to handle opening the assign order modal
  const handleOpenAssignModal = async (order) => {
    try {
      setOrderToAssign(order);
      // Fetch active sellers
      const sellersRef = collection(db, 'sellers');
      const q = query(sellersRef, where('status', '==', 'active'));
      const querySnapshot = await getDocs(q);
      
      const activeSellers = [];
      querySnapshot.forEach((doc) => {
        activeSellers.push({ id: doc.id, ...doc.data() });
      });
      
      setAvailableSellers(activeSellers);
      setIsAssignOrderModalOpen(true);
    } catch (error) {
      console.error('Error fetching available sellers:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch available sellers',
        severity: 'error'
      });
    }
  };

  // Add a function to handle closing the assign order modal
  const handleCloseAssignModal = () => {
    setIsAssignOrderModalOpen(false);
    setOrderToAssign(null);
  };

  // Add a function to handle assigning an order to a seller
  const handleAssignOrder = async () => {
    if (!orderToAssign) {
      alert('No order selected.');
      return;
    }

    // If no seller is selected and there's a current seller, this is an unassign operation
    const isUnassigning = !selectedSellerId && orderToAssign.sellerId;

    setAssignLoading(true);
    try {
      console.log(isUnassigning ? "Unassigning order from seller" : "Assigning order to seller:", selectedSellerId);
      console.log("Order data:", orderToAssign);
      
      // Get the current timestamp
      const now = new Date();
      
      // Update the order
      const orderRef = doc(db, 'orders', orderToAssign.id);
      
      if (isUnassigning) {
        // Unassign the order
        await updateDoc(orderRef, {
          sellerId: null,
          assignedAt: null,
          assignedBy: null,
          status: 'pending',
          statusHistory: arrayUnion({
            status: 'unassigned',
            timestamp: now.toISOString(),
            note: 'Unassigned by admin'
          })
        });

        // Remove order from previous seller's orders list
        if (orderToAssign.sellerId) {
          const prevSellerRef = doc(db, 'sellers', orderToAssign.sellerId);
          const prevSellerDoc = await getDoc(prevSellerRef);
          
          if (prevSellerDoc.exists()) {
            const prevSellerData = prevSellerDoc.data();
            const updatedOrders = (prevSellerData.orders || []).filter(id => id !== orderToAssign.id);
            await updateDoc(prevSellerRef, { orders: updatedOrders });
          }
        }
      } else {
        // Assign the order to new seller
        await updateDoc(orderRef, {
          sellerId: selectedSellerId,
          assignedAt: now,
          assignedBy: 'admin',
          status: 'assigned',
          statusHistory: arrayUnion({
            status: 'assigned',
            timestamp: now.toISOString(),
            note: `Manually ${orderToAssign.sellerId ? 're-assigned' : 'assigned'} to seller by admin`
          })
        });

        // If there was a previous seller, remove the order from their list
        if (orderToAssign.sellerId && orderToAssign.sellerId !== selectedSellerId) {
          const prevSellerRef = doc(db, 'sellers', orderToAssign.sellerId);
          const prevSellerDoc = await getDoc(prevSellerRef);
          
          if (prevSellerDoc.exists()) {
            const prevSellerData = prevSellerDoc.data();
            const updatedOrders = (prevSellerData.orders || []).filter(id => id !== orderToAssign.id);
            await updateDoc(prevSellerRef, { orders: updatedOrders });
          }
        }

        // Add order to new seller's list
        const sellerRef = doc(db, 'sellers', selectedSellerId);
        const sellerDoc = await getDoc(sellerRef);
        
        if (sellerDoc.exists()) {
          const sellerData = sellerDoc.data();
          const currentOrders = sellerData.orders || [];
          
          if (!currentOrders.includes(orderToAssign.id)) {
            await updateDoc(sellerRef, {
              orders: [...currentOrders, orderToAssign.id]
            });
          }
        }
      }

      // Refresh orders list
      await fetchOrders();
      
      alert(isUnassigning ? 'Order successfully unassigned!' : 'Order successfully assigned to seller!');
      handleCloseAssignModal();
    } catch (error) {
      console.error('Error managing order assignment:', error);
      alert('Failed to manage order assignment. Please try again.');
    } finally {
      setAssignLoading(false);
    }
  };

  // Update the AssignOrderModal component
  const AssignOrderModal = ({ open, order, onClose, onAssign }) => {
    if (!order) return null;
    
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Assign Order to Seller</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Select Seller</InputLabel>
              <Select
                value={selectedSellerId}
                onChange={(e) => setSelectedSellerId(e.target.value)}
                label="Select Seller"
              >
                {availableSellers.map((seller) => (
                  <MenuItem key={seller.id} value={seller.id}>
                    {seller.name || seller.shopName || 'Unnamed Seller'}
                    <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                      ({seller.email || 'No email'})
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleAssignOrder}
            variant="contained"
            color="primary"
            disabled={assignLoading}
            startIcon={assignLoading ? <CircularProgress size={20} /> : null}
          >
            {assignLoading ? 'Assigning...' : 'Assign Order'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Add pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Add State and functions to fetch and display seller address and payment methods
  const [sellerDetails, setSellerDetails] = useState({ address: '', paymentMethods: [] });

  const fetchSellerDetails = async (sellerId) => {
    try {
      const sellerDoc = await getDoc(doc(db, 'sellers', sellerId));
      if (sellerDoc.exists()) {
        const data = sellerDoc.data();
        setSellerDetails({
          address: data.address || 'Not provided',
          paymentMethods: data.paymentMethods || [],
        });
      }
    } catch (error) {
      console.error('Error fetching seller details:', error);
    }
  };

  useEffect(() => {
    if (selectedSeller) {
      fetchSellerDetails(selectedSeller.id);
    }
  }, [selectedSeller]);

  // Handle edit profile dialog open
  const handleEditProfileOpen = () => {
    setProfileFormData({
      name: adminProfile.name,
      email: adminProfile.email,
      role: adminProfile.role
    });
    setIsEditProfileOpen(true);
    setProfileUpdateSuccess(false);
  };

  // Handle edit profile dialog close
  const handleEditProfileClose = () => {
    setIsEditProfileOpen(false);
  };

  // Handle change password dialog open
  const handleChangePasswordOpen = () => {
    setPasswordFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setIsChangePasswordOpen(true);
    setPasswordUpdateSuccess(false);
  };

  // Handle change password dialog close
  const handleChangePasswordClose = () => {
    setIsChangePasswordOpen(false);
  };

  // Handle profile form input changes
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password form input changes
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (passwordError) {
      setPasswordError('');
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      // In a real app, you would update the profile in the database
      // For this demo, we'll just update the local state
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAdminProfile(prev => ({
        ...prev,
        name: profileFormData.name,
        email: profileFormData.email,
        role: profileFormData.role
      }));
      
      setProfileUpdateSuccess(true);
      
      // Close the dialog after a short delay
      setTimeout(() => {
        setIsEditProfileOpen(false);
        setProfileUpdateSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Handle password update
  const handleUpdatePassword = async () => {
    try {
      // Validate passwords
      if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
        setPasswordError('New passwords do not match');
        return;
      }
      
      if (passwordFormData.newPassword.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return;
      }
      
      // In a real app, you would validate the current password and update it in the database
      // For this demo, we'll just simulate a successful update
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPasswordUpdateSuccess(true);
      
      // Clear form and close the dialog after a short delay
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setPasswordUpdateSuccess(false);
        setPasswordFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }, 1500);
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError('Failed to update password');
    }
  };

  const handleGenerateDummyProducts = async () => {
    try {
      setLoading(true);
      const result = await addDummyProducts();
      if (result) {
        await fetchProducts();
        setSnackbar({
          open: true,
          message: 'Successfully added 200 dummy products',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error generating dummy products:', error);
      setSnackbar({
        open: true,
        message: 'Failed to generate dummy products',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle editing seller
  const handleEditSeller = (seller) => {
    setSelectedSeller(seller);
    setIsSellerEditModalOpen(true);
  };

  // First add the form ref near other refs
  const formRef = useRef(null);

  // Update the handleUpdateSeller function
  const handleUpdateSeller = async () => {
    if (!selectedSeller || !formRef.current) return;

    try {
      setLoading(true);
      
      // Get form elements using the ref
      const form = formRef.current;
      
      // Debug form structure
      console.log('Form structure:', form);
      console.log('Form elements:', form.elements);
      
      // Get values directly from form elements
      const nameInput = form.querySelector('input[name="name"]');
      const phoneInput = form.querySelector('input[name="phone"]');
      const shopNameInput = form.querySelector('input[name="shopName"]');
      const statusSelect = form.querySelector('select[name="status"]');
      const addressInput = form.querySelector('textarea[name="address"]');
      const passwordInput = form.querySelector('input[name="password"]');
      const countryInput = form.querySelector('input[name="country"]');
      
      console.log('Password input found:', passwordInput);
      console.log('Password value:', passwordInput?.value);
      
      const updatedData = {
        name: nameInput?.value || selectedSeller.name,
        phone: phoneInput?.value || selectedSeller.phone,
        shopName: shopNameInput?.value || selectedSeller.shopName,
        status: statusSelect?.value || selectedSeller.status,
        address: addressInput?.value || selectedSeller.address,
        country: countryInput?.value || selectedSeller.country,
        updatedAt: serverTimestamp()
      };

      // Handle password update
      const password = passwordInput?.value?.trim();
      if (password) {
        updatedData.password = password;
        updatedData.plainPassword = password; // Store plaintext password for admin view
        console.log('Updating password to:', password); // Debug log
        
        try {
          // Import needed Firebase auth functions
          const { getAuth, updatePassword, EmailAuthProvider } = await import('firebase/auth');
          
          // Update the seller's password in Firebase Authentication
          const auth = getAuth();
          const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = await import('firebase/auth');
          
          // Get the seller's email
          const sellerEmail = selectedSeller.email;
          
          // Use admin special privilege to update user password in auth
          // This is a workaround since we don't have admin SDK in client side
          try {
            // Custom auth token would be the proper way, but we'll use a workaround
            // Create a functions call to a cloud function that updates the user password
            // For now, we'll update Firestore and notify user they need to use password reset
            
            // Add a flag to indicate password was reset by admin
            updatedData.passwordResetByAdmin = true;
            updatedData.passwordResetAt = serverTimestamp();
            updatedData.requirePasswordChange = true;
            
            setSnackbar({
              open: true,
              message: 'Password updated in database. Note: The seller will need to use this new password for login.',
              severity: 'warning'
            });
          } catch (authError) {
            console.error('Error updating Firebase Auth password:', authError);
          }
        } catch (importError) {
          console.error('Error importing Firebase Auth functions:', importError);
        }
      }

      console.log('Updating seller with data:', updatedData); // Debug log
      console.log('Seller ID:', selectedSeller.id); // Debug log
      
      const sellerRef = doc(db, 'sellers', selectedSeller.id);
      await updateDoc(sellerRef, updatedData);
      
      // Force refresh sellers list to get updated data
      await fetchSellers();

      setIsSellerEditModalOpen(false);
      setSelectedSeller(null);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Seller profile updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating seller:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update seller profile: ' + error.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Display seller details in the UI
  const [toogle, setToogle] = useState(false)

  // Add this effect to filter orders by email
  useEffect(() => {
    if (orders.length > 0) {
      if (orderEmailSearch.trim() === '') {
        setFilteredOrders(orders);
      } else {
        const filtered = orders.filter(order => 
          order.customerEmail && 
          order.customerEmail.toLowerCase().includes(orderEmailSearch.toLowerCase())
        );
        setFilteredOrders(filtered);
      }
      // Reset pagination to first page when filter changes
      setPage(0);
    } else {
      setFilteredOrders([]);
    }
  }, [orders, orderEmailSearch]);

  return (
<Box className={'relative'} sx={{ display: 'flex', flexDirection: 'column', height: '100%', mt: `${navbarHeight}px` }}>      {/* Main content area with sidebar */}

      <button className='absolute z-20 -top-10 left-0 flex items-start box-border justify-center px-3 py-1  rounded-lg bg-custom-blue text-white ' onClick={() => setToogle(!toogle)}>
              
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
      <Box sx={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
        <Drawer

         className={`md:w-64  ${toogle ? `block` : `hidden`}`}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#f7f7f7',
              borderRight: '1px solid #e0e0e0',
              top: `${navbarHeight}px`, // Position below navbar
              height: `calc(100% - ${navbarHeight}px)`, // Adjust height
              overflowY: 'auto',
            },
          }}
          variant="permanent"
          anchor="left"
          open={true}
        >
          <Box sx={{ overflow: 'auto' }}>
            <List>

            <div className='w-full relative h-10'>
                <button className='absolute left-3 flex items-start box-border justify-center px-3 py-1  rounded-lg bg-custom-blue text-white ' onClick={() => setToogle(!toogle)}>
                  X
                </button>
              </div>

              <ListItemButton 
                selected={activeTab === 'dashboard'} 
                onClick={() => handleTabChange('dashboard')}
                sx={{ 
                  '&.Mui-selected': { backgroundColor: '#edf3fd', color: '#3b82f6' },
                  '&.Mui-selected:hover': { backgroundColor: '#e5effd' },
                  borderRadius: '4px',
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon>
                  <HomeIcon color={activeTab === 'dashboard' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>

              <ListItemButton 
                selected={activeTab === 'products'} 
                onClick={() => handleTabChange('products')}
                sx={{ 
                  '&.Mui-selected': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.16)',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                    transform: 'scale(1.03)',
                  },
                  '&.Mui-selected:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                  borderRadius: '8px',
                  mx: 1,
                  mb: 0.5,
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  <ProductsIcon color={activeTab === 'products' ? 'white' : 'inherit'} />
                </ListItemIcon>
                <ListItemText 
                  primary="Products" 
                  primaryTypographyProps={{ 
                    fontWeight: activeTab === 'products' ? 'bold' : 'normal' 
                  }} 
                />
              </ListItemButton>

              <ListItemButton 
                selected={activeTab === 'sellersProducts'} 
                onClick={() => {
                  handleTabChange('sellersProducts');
                  fetchSellersWithProducts();
                }}
                sx={{ 
                  '&.Mui-selected': { backgroundColor: '#edf3fd', color: '#3b82f6' },
                  '&.Mui-selected:hover': { backgroundColor: '#e5effd' },
                  borderRadius: '4px',
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon>
                  <SellersProductsIcon color={activeTab === 'sellersProducts' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Sellers Products" />
              </ListItemButton>

              <ListItemButton 
                selected={activeTab === 'storehouse'} 
                onClick={() => handleTabChange('storehouse')}
                sx={{ 
                  '&.Mui-selected': { backgroundColor: '#edf3fd', color: '#3b82f6' },
                  '&.Mui-selected:hover': { backgroundColor: '#e5effd' },
                  borderRadius: '4px',
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon>
                  <StorehouseIcon color={activeTab === 'storehouse' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Product Storehouse" />
              </ListItemButton>

              <ListItemButton 
                selected={activeTab === 'orders'} 
                onClick={() => handleTabChange('orders')}
                sx={{ 
                  '&.Mui-selected': { backgroundColor: '#edf3fd', color: '#3b82f6' },
                  '&.Mui-selected:hover': { backgroundColor: '#e5effd' },
                  borderRadius: '4px',
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon>
                  <Badge 
                    badgeContent={pendingOrdersCount} 
                    color="error"
                    max={99}
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.6rem',
                        height: '16px',
                        minWidth: '16px',
                      }
                    }}
                  >
                  <OrderIcon color={activeTab === 'orders' ? 'primary' : 'inherit'} />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Orders" />
              </ListItemButton>

              {/* <ListItemButton 
                selected={activeTab === 'package'} 
                onClick={() => handleTabChange('package')}
                sx={{ 
                  '&.Mui-selected': { backgroundColor: '#edf3fd', color: '#3b82f6' },
                  '&.Mui-selected:hover': { backgroundColor: '#e5effd' },
                  borderRadius: '4px',
                  mx: 1,
                  mb: 0.5
                }}
              >
                <ListItemIcon>
                  <PackageIcon color={activeTab === 'package' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Package" />
              </ListItemButton> */}

              {/* <ListItemButton 
                selected={activeTab === 'spreadPackages'} 
                onClick={() => handleTabChange('spreadPackages')}
                sx={{ 
                  '&.Mui-selected': { backgroundColor: '#edf3fd', color: '#3b82f6' },
                  '&.Mui-selected:hover': { backgroundColor: '#e5effd' },
                  borderRadius: '4px',
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon>
                  <SpreadIcon color={activeTab === 'spreadPackages' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Spread Packages" />
              </ListItemButton> */}

              {/* <ListItemButton 
                selected={activeTab === 'affiliate'} 
                onClick={() => handleTabChange('affiliate')}
                sx={{ 
                  '&.Mui-selected': { backgroundColor: '#edf3fd', color: '#3b82f6' },
                  '&.Mui-selected:hover': { backgroundColor: '#e5effd' },
                  borderRadius: '4px',
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon>
                  <AffiliateIcon color={activeTab === 'affiliate' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Affiliate System" />
              </ListItemButton> */}

              <ListItemButton 
                selected={activeTab === 'withdraw'} 
                onClick={() => handleTabChange('withdraw')}
                sx={{ 
                  '&.Mui-selected': { backgroundColor: '#edf3fd', color: '#3b82f6' },
                  '&.Mui-selected:hover': { backgroundColor: '#e5effd' },
                  borderRadius: '4px',
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon>
                  <WithdrawIcon color={activeTab === 'withdraw' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Money Withdraw" />
              </ListItemButton>

              <ListItemButton 
                selected={activeTab === 'conversations'} 
                onClick={() => handleTabChange('conversations')}
                sx={{ 
                  '&.Mui-selected': { backgroundColor: '#edf3fd', color: '#3b82f6' },
                  '&.Mui-selected:hover': { backgroundColor: '#e5effd' },
                  borderRadius: '4px',
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon>
                  <ConversationsIcon color={activeTab === 'conversations' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Conversations" />
              </ListItemButton>

              {/* <ListItemButton 
                selected={activeTab === 'adminProfile'} 
                onClick={() => handleTabChange('adminProfile')}
                sx={{ 
                  '&.Mui-selected': { backgroundColor: '#edf3fd', color: '#3b82f6' },
                  '&.Mui-selected:hover': { backgroundColor: '#e5effd' },
                  borderRadius: '4px',
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon>
                  <ProfileIcon color={activeTab === 'adminProfile' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Admin Profile" />
              </ListItemButton> */}

              <ListItemButton 
                selected={activeTab === 'viewSellerProfile'} 
                onClick={() => handleTabChange('viewSellerProfile')}
                sx={{ 
                  '&.Mui-selected': { backgroundColor: '#edf3fd', color: '#3b82f6' },
                  '&.Mui-selected:hover': { backgroundColor: '#e5effd' },
                  borderRadius: '4px',
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon>
                  <StoreIcon color={activeTab === 'viewSellerProfile' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="View Seller Profile" />
              </ListItemButton>

              {/* <ListItemButton 
                selected={activeTab === 'settings'} 
                onClick={() => handleTabChange('settings')}
                sx={{ 
                  '&.Mui-selected': { backgroundColor: '#edf3fd', color: '#3b82f6' },
                  '&.Mui-selected:hover': { backgroundColor: '#e5effd' },
                  borderRadius: '4px',
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon>
                  <SettingsIcon color={activeTab === 'settings' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Shop Setting" />
              </ListItemButton> */}

              {/* <ListItemButton 
                selected={activeTab === 'refunds'} 
                onClick={() => handleTabChange('refunds')}
                sx={{ 
                  '&.Mui-selected': { backgroundColor: '#edf3fd', color: '#3b82f6' },
                  '&.Mui-selected:hover': { backgroundColor: '#e5effd' },
                  borderRadius: '4px',
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon>
                  <RefundIcon color={activeTab === 'refunds' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Received Refund Request" />
              </ListItemButton> */}
{/* 
              <ListItemButton 
                selected={activeTab === 'sellerProfiles'} 
                onClick={() => {
                  handleTabChange('sellerProfiles');
                  fetchSellers();
                }}
                sx={{ 
                  '&.Mui-selected': { backgroundColor: '#edf3fd', color: '#3b82f6' },
                  '&.Mui-selected:hover': { backgroundColor: '#e5effd' },
                  borderRadius: '4px',
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon>
                  <StoreIcon color={activeTab === 'sellerProfiles' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Seller Profiles" />
              </ListItemButton> */}

              <ListItemButton 
                selected={activeTab === 'customerProfiles'} 
                onClick={() => {
                  handleTabChange('customerProfiles');
                  fetchCustomerProfiles();
                }}
                sx={{ 
                  '&.Mui-selected': { backgroundColor: '#edf3fd', color: '#3b82f6' },
                  '&.Mui-selected:hover': { backgroundColor: '#e5effd' },
                  borderRadius: '4px',
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon>
                  <ProfileIcon color={activeTab === 'customerProfiles' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Customer Profiles" />
              </ListItemButton>

              <ListItem button onClick={() => setActiveTab('addMoney')}>
                <ListItemText primary="Add Money" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Main open={true} sx={{ 
          mt: 0,
          pl: 0,
          ml: 0,
          width: `calc(100% - ${drawerWidth}px)`,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          position: 'relative', // Add position relative
          minHeight: `calc(100vh - ${navbarHeight}px)`, // Ensure minimum height
          background: 'linear-gradient(to bottom, #f5f7ff, #ffffff)',
          overflowY: 'auto',
          pb: 6
        }}>
          {renderTabContent()}
          {/* <ChatWindow userRole="admin" recipientRole="seller" /> */}
          <ScrollToTopButton 
            className={showScrollTop ? 'visible' : ''}
            onClick={scrollToTop}
            size="large"
          >
            <ArrowUpwardIcon />
          </ScrollToTopButton>
        </Main>
      </Box>
      <ProductModal
        open={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSave={handleProductEdit}
      />

      {/* Seller Details Modal */}
      <Dialog 
        open={!!selectedSeller} 
        onClose={() => setSelectedSeller(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Seller Details
          <IconButton
            aria-label="close"
            onClick={() => setSelectedSeller(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CancelIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedSeller && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                  <Typography variant="body1">{selectedSeller.name}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                  <Typography variant="body1">{selectedSeller.email}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                  <Typography variant="body1">{selectedSeller.phone || 'N/A'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">Shop Name</Typography>
                  <Typography variant="body1">{selectedSeller.shopName || 'N/A'}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">Registration Date</Typography>
                  <Typography variant="body1">
                    {selectedSeller.registrationDate 
                      ? new Date(selectedSeller.registrationDate.toDate()).toLocaleDateString() 
                      : 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Chip 
                    label={selectedSeller.status || 'Active'} 
                    color={selectedSeller.status === 'Active' ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
              </Grid>
              {selectedSeller.address && (
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                    <Typography variant="body1">{selectedSeller.address}</Typography>
                  </Box>
                </Grid>
              )}
              
              {/* Payment Methods Section */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Payment Methods
                  </Typography>
                  <Grid container spacing={2}>
                    {/* Cash Payment */}
                    {selectedSeller.cashPayment && (
                      <Grid item xs={12}>
                        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <MoneyIcon sx={{ mr: 1, color: 'success.main' }} />
                            <Typography variant="subtitle2">Cash Payment</Typography>
                          </Box>
                          <Typography variant="body2" color="textSecondary">
                            Accepts cash payments
                          </Typography>
                        </Paper>
                      </Grid>
                    )}

                    {/* Bank Payment */}
                    {selectedSeller.bankPayment && (
                      <Grid item xs={12}>
                        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AccountBalanceIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle2">Bank Details</Typography>
                          </Box>
                          <Grid container spacing={1}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">
                                Bank Name:
                              </Typography>
                              <Typography variant="body1">
                                {selectedSeller.bankName || 'N/A'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">
                                Account Name:
                              </Typography>
                              <Typography variant="body1">
                                {selectedSeller.bankAccountName || 'N/A'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">
                                Account Number:
                              </Typography>
                              <Typography variant="body1">
                                {selectedSeller.bankAccountNumber || 'N/A'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">
                                IFSC Code:
                              </Typography>
                              <Typography variant="body1">
                                {selectedSeller.ifscCode || 'N/A'}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    )}

                    {/* USDT Payment */}
                    {selectedSeller.usdtPayment && (
                      <Grid item xs={12}>
                        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CurrencyBitcoinIcon sx={{ mr: 1, color: 'warning.main' }} />
                            <Typography variant="subtitle2">USDT Details</Typography>
                          </Box>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">
                                USDT Address:
                              </Typography>
                              <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                                {selectedSeller.usdtAddress || 'N/A'}
                              </Typography>
                            </Grid>
                            {selectedSeller.usdtLink && (
                              <Grid item xs={12}>
                                <Typography variant="body2" color="textSecondary">
                                  USDT Payment Link:
                                </Typography>
                                <Link
                                  href={selectedSeller.usdtLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{ wordBreak: 'break-all' }}
                                >
                                  {selectedSeller.usdtLink}
                                </Link>
                              </Grid>
                            )}
                          </Grid>
                        </Paper>
                      </Grid>
                    )}

                    {!selectedSeller.cashPayment && !selectedSeller.bankPayment && !selectedSeller.usdtPayment && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          No payment methods configured
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Grid>

              {/* ID Proof Section */}
              {selectedSeller.documentType && selectedSeller.idProof && (
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      ID Proof ({selectedSeller.documentType})
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            Front Side
                          </Typography>
                          {selectedSeller.idProof.frontImage ? (
                            <Box
                              component="img"
                              src={selectedSeller.idProof.frontImage}
                              alt="ID Front"
                              sx={{
                                width: '100%',
                                maxHeight: 200,
                                objectFit: 'contain',
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: 1,
                                cursor: 'pointer'
                              }}
                              onClick={() => window.open(selectedSeller.idProof.frontImage, '_blank')}
                            />
                          ) : (
                            <Typography variant="body2" color="error">
                              Front image not available
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            Back Side
                          </Typography>
                          {selectedSeller.idProof.backImage ? (
                            <Box
                              component="img"
                              src={selectedSeller.idProof.backImage}
                              alt="ID Back"
                              sx={{
                                width: '100%',
                                maxHeight: 200,
                                objectFit: 'contain',
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: 1,
                                cursor: 'pointer'
                              }}
                              onClick={() => window.open(selectedSeller.idProof.backImage, '_blank')}
                            />
                          ) : (
                            <Typography variant="body2" color="error">
                              Back image not available
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSeller(null)}>Close</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => {
              handleEditSeller(selectedSeller);
              setSelectedSeller(null);
            }}
          >
            Edit Profile
          </Button>
        </DialogActions>
      </Dialog>

      {/* Seller Edit Modal */}
      <Dialog 
        open={isSellerEditModalOpen} 
        onClose={() => setIsSellerEditModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Seller Profile
          <IconButton
            aria-label="close"
            onClick={() => setIsSellerEditModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CancelIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedSeller && (
            <form ref={formRef}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    defaultValue={selectedSeller.name}
                    variant="outlined"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    defaultValue={selectedSeller.email}
                    variant="outlined"
                    margin="normal"
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    defaultValue={selectedSeller.phone}
                    variant="outlined"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="New Password"
                    name="password"
                    id="seller-password"
                    type="text"
                    defaultValue=""
                    variant="outlined"
                    margin="normal"
                    helperText="Leave blank to keep current password"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Shop Name"
                    name="shopName"
                    defaultValue={selectedSeller.shopName}
                    variant="outlined"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Country"
                    name="country"
                    defaultValue={selectedSeller.country}
                    variant="outlined"
                    margin="normal"
                    required
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      defaultValue={selectedSeller.status || 'Active'}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                      <MenuItem value="Suspended">Suspended</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    defaultValue={selectedSeller.address}
                    variant="outlined"
                    margin="normal"
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </form>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSellerEditModalOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleUpdateSeller}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard; 
