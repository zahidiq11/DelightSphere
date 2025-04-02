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
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Info as InfoIcon,
  AddShoppingCart as AddCartIcon,
  LocalOffer as OfferIcon,
  Search as SearchIcon,
  HomeOutlined,
  ElectricalServices,
  Checkroom,
  Toys
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import Footer from './Footer';

const DEFAULT_FALLBACK_IMAGE = 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=300';

const HomePage = ({ isAuthenticated, searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [error, setError] = useState(null);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);
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

  // Sample product data for non-authenticated users
  const sampleProductsData = useMemo(() => {
    const categories = [
      { 
        id: 'home-appliances', 
        name: 'Home Appliances',
        icon: <HomeOutlined />,
        products: Array.from({ length: 20 }, (_, i) => ({
          id: `ha-${i + 1}`,
          name: `${['Premium', 'Deluxe', 'Smart', 'Classic', 'Ultra'][i % 5]} ${['Blender', 'Coffee Maker', 'Toaster', 'Microwave', 'Vacuum', 'Air Purifier', 'Rice Cooker', 'Washing Machine', 'Refrigerator', 'Dishwasher'][i % 10]}`,
          description: `High-quality home appliance for modern living. Energy efficient and sleek design.`,
          price: Math.floor(80 + Math.random() * 300),
          imageUrl: `/images/home-appliance-${(i % 5) + 1}.jpg`,
          category: 'Home Appliances',
          uniqueKey: `sample-ha-${i}`,
          isFeatured: i < 3, // First 3 items are featured
          discountPercent: i % 5 === 0 ? Math.floor(10 + Math.random() * 20) : 0 // Every 5th item has discount
        }))
      },
      { 
        id: 'electronics', 
        name: 'Electronics',
        icon: <ElectricalServices />,
        products: Array.from({ length: 20 }, (_, i) => ({
          id: `el-${i + 1}`,
          name: `${['Pro', 'Ultra', 'Max', 'Lite', 'Elite'][i % 5]} ${['Laptop', 'Smartphone', 'Tablet', 'Headphones', 'Speaker', 'Monitor', 'Keyboard', 'Mouse', 'Camera', 'TV'][i % 10]}`,
          description: `Cutting-edge electronics with the latest technology and features.`,
          price: Math.floor(150 + Math.random() * 500),
          imageUrl: `/images/electronics-${(i % 5) + 1}.jpg`,
          category: 'Electronics',
          uniqueKey: `sample-el-${i}`,
          isFeatured: i < 3,
          discountPercent: i % 5 === 0 ? Math.floor(10 + Math.random() * 20) : 0
        }))
      },
      { 
        id: 'fashion', 
        name: 'Fashion',
        icon: <Checkroom />,
        products: Array.from({ length: 20 }, (_, i) => ({
          id: `fa-${i + 1}`,
          name: `${['Premium', 'Elegant', 'Casual', 'Designer', 'Classic'][i % 5]} ${i < 10 ? 'Men\'s' : 'Women\'s'} ${['T-Shirt', 'Jeans', 'Dress', 'Shoes', 'Watch', 'Jacket', 'Sunglasses', 'Bag', 'Hat', 'Scarf'][i % 10]}`,
          description: `Trendy and comfortable fashion pieces for everyday wear.`,
          price: Math.floor(30 + Math.random() * 150),
          imageUrl: `/images/fashion-${(i % 5) + 1}.jpg`,
          category: 'Fashion',
          uniqueKey: `sample-fa-${i}`,
          isFeatured: i < 3,
          discountPercent: i % 5 === 0 ? Math.floor(10 + Math.random() * 20) : 0
        }))
      },
      { 
        id: 'toys', 
        name: 'Toys',
        icon: <Toys />,
        products: Array.from({ length: 20 }, (_, i) => ({
          id: `to-${i + 1}`,
          name: `${['Educational', 'Interactive', 'Creative', 'Adventure', 'Classic'][i % 5]} ${['Building Blocks', 'Action Figure', 'Board Game', 'Puzzle', 'Remote Control Car', 'Doll', 'Plush Toy', 'Science Kit', 'Art Set', 'Robot'][i % 10]}`,
          description: `Fun and educational toys for children of all ages.`,
          price: Math.floor(20 + Math.random() * 100),
          imageUrl: `/images/toy-${(i % 5) + 1}.jpg`,
          category: 'Toys',
          uniqueKey: `sample-to-${i}`,
          isFeatured: i < 3,
          discountPercent: i % 5 === 0 ? Math.floor(10 + Math.random() * 20) : 0
        }))
      }
    ];
    
    // Better placeholder images with category matching
    const placeholderImages = [
      // Home Appliances - 20 unique images
      [
        'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=300', // coffee maker
        'https://images.pexels.com/photos/6758773/pexels-photo-6758773.jpeg?auto=compress&cs=tinysrgb&w=300', // blender
        'https://images.pexels.com/photos/4495798/pexels-photo-4495798.jpeg?auto=compress&cs=tinysrgb&w=300', // microwave
        'https://images.pexels.com/photos/4107142/pexels-photo-4107142.jpeg?auto=compress&cs=tinysrgb&w=300', // air purifier
        'https://images.pexels.com/photos/3780689/pexels-photo-3780689.jpeg?auto=compress&cs=tinysrgb&w=300', // toaster
        'https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg?auto=compress&cs=tinysrgb&w=300', // washing machine
        'https://images.pexels.com/photos/3637728/pexels-photo-3637728.jpeg?auto=compress&cs=tinysrgb&w=300', // refrigerator
        'https://images.pexels.com/photos/2451264/pexels-photo-2451264.jpeg?auto=compress&cs=tinysrgb&w=300', // dishwasher
        'https://images.pexels.com/photos/4108730/pexels-photo-4108730.jpeg?auto=compress&cs=tinysrgb&w=300', // vacuum
        'https://images.pexels.com/photos/7045379/pexels-photo-7045379.jpeg?auto=compress&cs=tinysrgb&w=300', // rice cooker
        'https://images.pexels.com/photos/5824883/pexels-photo-5824883.jpeg?auto=compress&cs=tinysrgb&w=300', // electric kettle
        'https://images.pexels.com/photos/5824527/pexels-photo-5824527.jpeg?auto=compress&cs=tinysrgb&w=300', // food processor
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=300', // mixer
        'https://images.pexels.com/photos/4108305/pexels-photo-4108305.jpeg?auto=compress&cs=tinysrgb&w=300', // juicer
        'https://images.pexels.com/photos/5825402/pexels-photo-5825402.jpeg?auto=compress&cs=tinysrgb&w=300', // oven
        'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=300', // fan
        'https://images.pexels.com/photos/7048043/pexels-photo-7048043.jpeg?auto=compress&cs=tinysrgb&w=300', // iron
        'https://images.pexels.com/photos/5824905/pexels-photo-5824905.jpeg?auto=compress&cs=tinysrgb&w=300', // pressure cooker
        'https://images.pexels.com/photos/4108771/pexels-photo-4108771.jpeg?auto=compress&cs=tinysrgb&w=300', // bread maker
        'https://images.pexels.com/photos/4108726/pexels-photo-4108726.jpeg?auto=compress&cs=tinysrgb&w=300'  // espresso machine
      ],
      // Electronics - 20 unique images
      [
        'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=300', // laptop
        'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=300', // smartphone
        'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=300', // tablet
        'https://images.pexels.com/photos/6636463/pexels-photo-6636463.jpeg?auto=compress&cs=tinysrgb&w=300', // headphones
        'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=300', // speakers
        'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=300', // monitor
        'https://images.pexels.com/photos/3937174/pexels-photo-3937174.jpeg?auto=compress&cs=tinysrgb&w=300', // keyboard
        'https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=300', // mouse
        'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300', // camera
        'https://images.pexels.com/photos/333984/pexels-photo-333984.jpeg?auto=compress&cs=tinysrgb&w=300', // tv
        'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=300', // gaming console
        'https://images.pexels.com/photos/144429/pexels-photo-144429.jpeg?auto=compress&cs=tinysrgb&w=300', // bluetooth speaker
        'https://images.pexels.com/photos/1037999/pexels-photo-1037999.jpeg?auto=compress&cs=tinysrgb&w=300', // smartwatch
        'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&cs=tinysrgb&w=300', // external hard drive
        'https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=300', // earbuds
        'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=300', // usb drive
        'https://images.pexels.com/photos/1841841/pexels-photo-1841841.jpeg?auto=compress&cs=tinysrgb&w=300', // router
        'https://images.pexels.com/photos/2885014/pexels-photo-2885014.jpeg?auto=compress&cs=tinysrgb&w=300', // graphics card
        'https://images.pexels.com/photos/40879/monitor-hard-drive-data-storage-40879.jpeg?auto=compress&cs=tinysrgb&w=300', // ssd
        'https://images.pexels.com/photos/392018/pexels-photo-392018.jpeg?auto=compress&cs=tinysrgb&w=300'  // drone
      ],
      // Fashion - 20 unique images
      [
        'https://images.pexels.com/photos/5868722/pexels-photo-5868722.jpeg?auto=compress&cs=tinysrgb&w=300', // men's t-shirt
        'https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg?auto=compress&cs=tinysrgb&w=300', // women's dress
        'https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg?auto=compress&cs=tinysrgb&w=300', // men's jeans
        'https://images.pexels.com/photos/6310924/pexels-photo-6310924.jpeg?auto=compress&cs=tinysrgb&w=300', // women's shoes
        'https://images.pexels.com/photos/6347546/pexels-photo-6347546.jpeg?auto=compress&cs=tinysrgb&w=300', // men's watch
        'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=300', // women's jacket
        'https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg?auto=compress&cs=tinysrgb&w=300', // men's sunglasses
        'https://images.pexels.com/photos/1204464/pexels-photo-1204464.jpeg?auto=compress&cs=tinysrgb&w=300', // women's bag
        'https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?auto=compress&cs=tinysrgb&w=300', // men's hat
        'https://images.pexels.com/photos/1078958/pexels-photo-1078958.jpeg?auto=compress&cs=tinysrgb&w=300', // women's scarf
        'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=300', // men's suit
        'https://images.pexels.com/photos/1558906/pexels-photo-1558906.jpeg?auto=compress&cs=tinysrgb&w=300', // women's blouse
        'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=300', // men's shoes
        'https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&w=300', // women's jewelry
        'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=300', // men's blazer
        'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=300', // women's hat
        'https://images.pexels.com/photos/1232459/pexels-photo-1232459.jpeg?auto=compress&cs=tinysrgb&w=300', // men's belt
        'https://images.pexels.com/photos/934673/pexels-photo-934673.jpeg?auto=compress&cs=tinysrgb&w=300', // women's sunglasses
        'https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg?auto=compress&cs=tinysrgb&w=300', // men's sneakers
        'https://images.pexels.com/photos/6046183/pexels-photo-6046183.jpeg?auto=compress&cs=tinysrgb&w=300'  // women's sweater
      ],
      // Toys - 20 unique images
      [
        'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=300', // action figures
        'https://images.pexels.com/photos/207891/pexels-photo-207891.jpeg?auto=compress&cs=tinysrgb&w=300', // building blocks
        'https://images.pexels.com/photos/12211/pexels-photo-12211.jpeg?auto=compress&cs=tinysrgb&w=300', // board game
        'https://images.pexels.com/photos/3662833/pexels-photo-3662833.jpeg?auto=compress&cs=tinysrgb&w=300', // puzzle
        'https://images.pexels.com/photos/1166473/pexels-photo-1166473.jpeg?auto=compress&cs=tinysrgb&w=300', // RC car
        'https://images.pexels.com/photos/1619841/pexels-photo-1619841.jpeg?auto=compress&cs=tinysrgb&w=300', // doll
        'https://images.pexels.com/photos/1319572/pexels-photo-1319572.jpeg?auto=compress&cs=tinysrgb&w=300', // plush toy
        'https://images.pexels.com/photos/2088233/pexels-photo-2088233.jpeg?auto=compress&cs=tinysrgb&w=300', // science kit
        'https://images.pexels.com/photos/159579/crayons-coloring-book-coloring-book-159579.jpeg?auto=compress&cs=tinysrgb&w=300', // art set
        'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=300', // robot
        'https://images.pexels.com/photos/4134784/pexels-photo-4134784.jpeg?auto=compress&cs=tinysrgb&w=300', // dinosaur toy
        'https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg?auto=compress&cs=tinysrgb&w=300', // toy car
        'https://images.pexels.com/photos/191360/pexels-photo-191360.jpeg?auto=compress&cs=tinysrgb&w=300', // train set
        'https://images.pexels.com/photos/226723/pexels-photo-226723.jpeg?auto=compress&cs=tinysrgb&w=300', // playground set
        'https://images.pexels.com/photos/1646761/pexels-photo-1646761.jpeg?auto=compress&cs=tinysrgb&w=300', // musical toy
        'https://images.pexels.com/photos/981077/pexels-photo-981077.jpeg?auto=compress&cs=tinysrgb&w=300', // stuffed animal
        'https://images.pexels.com/photos/255514/pexels-photo-255514.jpeg?auto=compress&cs=tinysrgb&w=300', // educational toy
        'https://images.pexels.com/photos/3661624/pexels-photo-3661624.jpeg?auto=compress&cs=tinysrgb&w=300', // play-doh
        'https://images.pexels.com/photos/1767434/pexels-photo-1767434.jpeg?auto=compress&cs=tinysrgb&w=300', // toy kitchen
        'https://images.pexels.com/photos/4613861/pexels-photo-4613861.jpeg?auto=compress&cs=tinysrgb&w=300'  // drone toy
      ]
    ];
    
    // Default fallback image for all categories
    const defaultFallbackImage = DEFAULT_FALLBACK_IMAGE;

    // Update the code that applies the images to ensure each product gets an image matching its name
    return categories.map((category, catIndex) => ({
      ...category,
      products: category.products.map((product, prodIndex) => {
        // Extract the product type from the name (e.g., "Deluxe Coffee Maker" → "Coffee Maker")
        const nameParts = product.name.split(' ');
        const productType = nameParts.length > 1 ? 
          nameParts.slice(1).join(' ').toLowerCase() : 
          nameParts[0].toLowerCase();
        
        // Find the appropriate image based on product type
        let imageIndex = 0;
        
        if (catIndex === 0) { // Home Appliances
          if (productType.includes('coffee maker')) imageIndex = 0;
          else if (productType.includes('blender')) imageIndex = 1;
          else if (productType.includes('microwave')) imageIndex = 2;
          else if (productType.includes('air purifier')) imageIndex = 3;
          else if (productType.includes('toaster')) imageIndex = 4;
          else if (productType.includes('washing machine')) imageIndex = 5;
          else if (productType.includes('refrigerator')) imageIndex = 6;
          else if (productType.includes('dishwasher')) imageIndex = 7;
          else if (productType.includes('vacuum')) imageIndex = 8;
          else if (productType.includes('rice cooker')) imageIndex = 9;
          else if (productType.includes('kettle')) imageIndex = 10;
          else if (productType.includes('food processor')) imageIndex = 11;
          else if (productType.includes('mixer')) imageIndex = 12;
          else if (productType.includes('juicer')) imageIndex = 13;
          else if (productType.includes('oven')) imageIndex = 14;
          else if (productType.includes('fan')) imageIndex = 15;
          else if (productType.includes('iron')) imageIndex = 16;
          else if (productType.includes('pressure cooker')) imageIndex = 17;
          else if (productType.includes('bread maker')) imageIndex = 18;
          else imageIndex = 19; // espresso machine or default
        } 
        else if (catIndex === 1) { // Electronics
          if (productType.includes('laptop')) imageIndex = 0;
          else if (productType.includes('smartphone')) imageIndex = 1;
          else if (productType.includes('tablet')) imageIndex = 2;
          else if (productType.includes('headphones')) imageIndex = 3;
          else if (productType.includes('speaker')) imageIndex = 4;
          else if (productType.includes('monitor')) imageIndex = 5;
          else if (productType.includes('keyboard')) imageIndex = 6;
          else if (productType.includes('mouse')) imageIndex = 7;
          else if (productType.includes('camera')) imageIndex = 8;
          else if (productType.includes('tv')) imageIndex = 9;
          else if (productType.includes('console')) imageIndex = 10;
          else if (productType.includes('bluetooth')) imageIndex = 11;
          else if (productType.includes('smartwatch')) imageIndex = 12;
          else if (productType.includes('hard drive')) imageIndex = 13;
          else if (productType.includes('earbuds')) imageIndex = 14;
          else if (productType.includes('usb')) imageIndex = 15;
          else if (productType.includes('router')) imageIndex = 16;
          else if (productType.includes('graphics')) imageIndex = 17;
          else if (productType.includes('ssd')) imageIndex = 18;
          else imageIndex = 19; // drone or default
        }
        else if (catIndex === 2) { // Fashion
          if (productType.includes('t-shirt') && product.name.toLowerCase().includes('men')) imageIndex = 0;
          else if (productType.includes('dress')) imageIndex = 1;
          else if (productType.includes('jeans') && product.name.toLowerCase().includes('men')) imageIndex = 2;
          else if (productType.includes('shoes') && product.name.toLowerCase().includes('women')) imageIndex = 3;
          else if (productType.includes('watch') && product.name.toLowerCase().includes('men')) imageIndex = 4;
          else if (productType.includes('jacket') && product.name.toLowerCase().includes('women')) imageIndex = 5;
          else if (productType.includes('sunglasses') && product.name.toLowerCase().includes('men')) imageIndex = 6;
          else if (productType.includes('bag') && product.name.toLowerCase().includes('women')) imageIndex = 7;
          else if (productType.includes('hat') && product.name.toLowerCase().includes('men')) imageIndex = 8;
          else if (productType.includes('scarf') && product.name.toLowerCase().includes('women')) imageIndex = 9;
          else if (productType.includes('suit')) imageIndex = 10;
          else if (productType.includes('blouse')) imageIndex = 11;
          else if (productType.includes('shoes') && product.name.toLowerCase().includes('men')) imageIndex = 12;
          else if (productType.includes('jewelry')) imageIndex = 13;
          else if (productType.includes('blazer')) imageIndex = 14;
          else if (productType.includes('hat') && product.name.toLowerCase().includes('women')) imageIndex = 15;
          else if (productType.includes('belt')) imageIndex = 16;
          else if (productType.includes('sunglasses') && product.name.toLowerCase().includes('women')) imageIndex = 17;
          else if (productType.includes('sneakers')) imageIndex = 18;
          else imageIndex = 19; // sweater or default
        }
        else { // Toys
          if (productType.includes('action figure')) imageIndex = 0;
          else if (productType.includes('building blocks')) imageIndex = 1;
          else if (productType.includes('board game')) imageIndex = 2;
          else if (productType.includes('puzzle')) imageIndex = 3;
          else if (productType.includes('remote control car')) imageIndex = 4;
          else if (productType.includes('doll')) imageIndex = 5;
          else if (productType.includes('plush')) imageIndex = 6;
          else if (productType.includes('science kit')) imageIndex = 7;
          else if (productType.includes('art set')) imageIndex = 8;
          else if (productType.includes('robot')) imageIndex = 9;
          else if (productType.includes('dinosaur')) imageIndex = 10;
          else if (productType.includes('car') && !productType.includes('remote control')) imageIndex = 11;
          else if (productType.includes('train')) imageIndex = 12;
          else if (productType.includes('playground')) imageIndex = 13;
          else if (productType.includes('musical')) imageIndex = 14;
          else if (productType.includes('stuffed')) imageIndex = 15;
          else if (productType.includes('educational')) imageIndex = 16;
          else if (productType.includes('play-doh')) imageIndex = 17;
          else if (productType.includes('kitchen')) imageIndex = 18;
          else imageIndex = 19; // drone toy or default
        }
        
        return {
          ...product,
          imageUrl: placeholderImages[catIndex][imageIndex],
          fallbackImage: defaultFallbackImage
        };
      })
    }));
  }, []);

  const handleCategoryChange = (event, newValue) => {
    setActiveCategory(newValue);
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      if (!isAuthenticated) {
        // We'll now show sample products even for non-authenticated users
        setLoading(false);
        return;
      }

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
  }, [isAuthenticated]);

  // Modified to show sample products for non-authenticated users
  const displayProductsWithKeys = useMemo(() => {
    if (!isAuthenticated) {
      // For non-authenticated users, filter the sample products
      let allProducts = sampleProductsData.flatMap(cat => cat.products);
      
      if (localSearchTerm) {
        const searchLower = localSearchTerm.toLowerCase().trim();
        allProducts = allProducts.filter(product => 
          product.name.toLowerCase().includes(searchLower) || 
          product.category.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
        );
      }
      
      return allProducts;
    }
    
    // For authenticated users, continue using real products
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
  }, [products, localSearchTerm, isAuthenticated, sampleProductsData]);

  // Get the products for the current category (for non-authenticated users)
  const currentCategoryProducts = useMemo(() => {
    if (isAuthenticated) return displayProductsWithKeys;
    
    if (localSearchTerm) return displayProductsWithKeys;
    
    return sampleProductsData[activeCategory]?.products || [];
  }, [isAuthenticated, displayProductsWithKeys, sampleProductsData, activeCategory, localSearchTerm]);

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
          imageUrl: product.imageUrl || DEFAULT_FALLBACK_IMAGE,
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
              Login to enjoy personalized recommendations and add products to your cart
            </Typography>
          </Box>
        )}

        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          {localSearchTerm ? 'Search Results' : 'Featured Products'}
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <Typography color="error">{error}</Typography>
          </Box>
        ) : !isAuthenticated && !localSearchTerm ? (
          <>
            {/* Category Tabs for Non-Authenticated Users */}
            <Box sx={{ mb: 4 }}>
              <Tabs 
                value={activeCategory} 
                onChange={handleCategoryChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    minWidth: { xs: 'auto', sm: 120 },
                  }
                }}
              >
                {sampleProductsData.map((category, index) => (
                  <Tab 
                    key={category.id} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {category.icon}
                        <span>{category.name}</span>
                      </Box>
                    } 
                    id={`tab-${index}`}
                    aria-controls={`tabpanel-${index}`}
                  />
                ))}
              </Tabs>
            </Box>
            
            {/* Render Category Products */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', ml: 1 }}>
                {sampleProductsData[activeCategory].name}
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {currentCategoryProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.uniqueKey}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'visible',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => navigate('/customer/login')}
                    onMouseEnter={() => setHoveredCard(product.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {product.isFeatured && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          bgcolor: 'error.main',
                          color: 'white',
                          borderRadius: '50%',
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          zIndex: 1,
                          boxShadow: 2
                        }}
                      >
                        HOT
                      </Box>
                    )}
                    {product.discountPercent > 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 10,
                          left: 0,
                          bgcolor: 'success.main',
                          color: 'white',
                          py: 0.5,
                          px: 1,
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          zIndex: 1,
                          boxShadow: 1
                        }}
                      >
                        {product.discountPercent}% OFF
                      </Box>
                    )}
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.imageUrl}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = product.fallbackImage || DEFAULT_FALLBACK_IMAGE;
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h2" noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, height: '40px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {product.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          ${product.discountPercent > 0 
                            ? (product.price * (1 - product.discountPercent/100)).toFixed(2)
                            : product.price}
                        </Typography>
                        {product.discountPercent > 0 && (
                          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                            ${product.price}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                    <Fade in={hoveredCard === product.id}>
                      <CardActions 
                        sx={{ 
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          bgcolor: 'rgba(0, 0, 0, 0.7)',
                          justifyContent: 'center',
                          p: 1
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/customer/login');
                          }}
                          sx={{ color: 'white' }}
                        >
                          Login to View
                        </Button>
                      </CardActions>
                    </Fade>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : displayProductsWithKeys.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              No products found matching your search criteria
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
                      image={product.imageUrl || DEFAULT_FALLBACK_IMAGE}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_FALLBACK_IMAGE;
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
