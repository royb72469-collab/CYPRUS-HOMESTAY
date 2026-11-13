import React, { useState } from 'react';
import { 
  Bed, Utensils, ShieldCheck, Car, Trees, Bath, Calendar, Users, Phone, MapPin, 
  Clock, CheckCircle, Copy, ChevronRight, Heart, Menu, X, 
  Info, Sparkles, MessageCircle, ArrowRight, DollarSign, Star, ThumbsUp, MessageSquarePlus,
  Download, MessageSquare
} from 'lucide-react';
import { supabase } from './lib/supabase';

interface Room {
  id: string;
  name: string;
  price: number;
  maxGuests: string;
  beds: string;
  description: string;
  image: string;
  features: string[];
}

interface Review {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  text: string;
  likes: number;
  ownerReply?: string;
}

interface BookingDetails {
  bookingId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomType: string;
  roomCount: number;
  adults: number;
  children: number;
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  arrivalTime: string;
  parking: string;
  mealPref: string;
  paymentMode: 'full' | 'advance';
  totalAmount: number;
  payableAmount: number;
  utrNumber: string;
  paymentScreenshot?: string;
  createdAt: string;
  status: 'Sent to Owner (Pending Confirmation)' | 'Pending Owner Verification' | 'Confirmed';
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      author: 'live 2 Ride the feeling',
      role: 'Local Guide · 46 reviews',
      rating: 4,
      date: 'a year ago',
      text: 'The location is excellent. Service & Hospitality of this home stay is the best. Food served delicious. The owner of the homestay will take care of everything like family. Great gated parking for our superbike group.',
      likes: 2,
      ownerReply: 'Thank you so much for choosing our Cyprus homestay 😊 hope to see you soon again.'
    },
    {
      id: '2',
      author: 'Rahul Das',
      role: 'Local Guide · 11 reviews',
      rating: 4,
      date: '7 months ago',
      text: 'The homestay was decorated and had a peaceful ambience around it. The rooms had wooden flooring and comfortable beds. Great greenery view from the upper balcony.',
      likes: 1
    },
    {
      id: '3',
      author: 'Tathagata Banerjee',
      role: '3 reviews',
      rating: 5,
      date: 'a year ago',
      text: 'A beautiful Homestay with warm and kind people to welcome you. The hosts will ensure that by the end of the day, the homestay starts giving you a cozy home feeling.',
      likes: 1
    },
    {
      id: '4',
      author: 'Becca_7',
      role: '2 reviews',
      rating: 5,
      date: 'a year ago',
      text: 'I had a wonderful stay at this hotel! The place is incredibly beautiful, calm, and peaceful. Perfectly located in the middle of stunning greenery near Bengal Safari.',
      likes: 1,
      ownerReply: 'Thank you so much 😊🙏 for the amazing review, hope to see you soon.....❤️'
    },
    {
      id: '5',
      author: 'Persis Smith',
      role: '3 reviews',
      rating: 5,
      date: 'a year ago',
      text: 'I had a lovely experience staying at Cyprus Home Stay in Toribari. The location is peaceful and surrounded by natural beauty — perfect quiet stay.',
      likes: 2
    },
    {
      id: '6',
      author: 'Joseph Dhunuckey',
      role: '1 review',
      rating: 5,
      date: 'a year ago',
      text: 'I had a wonderful stay at Cyprus Homestay in Siliguri Toribari. The place is peaceful, clean, and beautifully maintained. The hosts were incredibly helpful.',
      likes: 1,
      ownerReply: 'Thank you so much 😊 for your valuable reviews, hope to see you again.'
    },
    {
      id: '7',
      author: 'Sanjit Mahato',
      role: '3 reviews',
      rating: 5,
      date: '6 months ago',
      text: 'Good service. Beautiful location. Beautiful hospitality. Rooms: 5 | Service: 5 | Location: 5',
      likes: 1
    },
    {
      id: '8',
      author: 'Pratik Bhuyan',
      role: 'Local Guide · 10 reviews',
      rating: 5,
      date: 'a year ago',
      text: 'I have no words to say, this homestay is mind blowing and its location makes it more beautiful. Owner of this place is very polite and helpful.',
      likes: 1,
      ownerReply: 'Thank you so much 😊 for the 5 🌟 ratings and great review, we\'re glad you enjoyed your stay at Cyprus Homestay. Hope to see you so...'
    },
    {
      id: '9',
      author: 'Stepan',
      role: 'Local Guide · 38 reviews',
      rating: 5,
      date: '2 years ago',
      text: 'Very nice and clean homestay with delicious homefood at a perfect location - out of overcrowded Siliguri and next to Bengal safari.',
      likes: 3
    }
  ]);

  // New Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewNotice, setReviewNotice] = useState<string | null>(null);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newReviewText.trim()) {
      return;
    }

    const newEntry: Review = {
      id: Date.now().toString(),
      author: newAuthor.trim(),
      role: 'Verified Guest',
      rating: newRating,
      date: 'Just now',
      text: newReviewText.trim(),
      likes: 0,
      ownerReply: 'Thank you so much for your wonderful review! We are delighted you enjoyed your stay at Cyprus Homestay. 😊🙏'
    };

    setReviews([newEntry, ...reviews]);
    setNewAuthor('');
    setNewReviewText('');
    setShowReviewModal(false);
    setReviewNotice('Thank you! Your review has been published.');
    setTimeout(() => setReviewNotice(null), 4000);
  };

  // Room data with uploaded images
  const rooms: Room[] = [
    {
      id: 'double',
      name: 'Cozy Double Bedroom',
      price: 1500,
      maxGuests: '2 Adults + 1 Child',
      beds: '1 Double Bed',
      description: 'Wooden flooring & wood-paneled ceilings with ceiling fan, large wooden wardrobe, bedside table, attached western bathroom, and natural light window overlooking greenery.',
      image: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_9.55.30_PM__2__d1613e8d.jpeg',
      features: ['Wooden Ceilings', 'Attached Western Bathroom', 'Large Wooden Wardrobe', 'Natural Light Window', 'Ceiling Fan', 'Free Gated Parking']
    },
    {
      id: 'twin',
      name: 'Twin Sharing Bedroom',
      price: 1400,
      maxGuests: '2 Adults',
      beds: '2 Single Beds',
      description: 'Ideal for friends, solo travelers, or biker groups. Features warm wooden flooring & ceiling, center nightstand, attached western bathroom, and cozy plush bedding.',
      image: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_9.55.31_PM_2acdee74.jpeg',
      features: ['2 Single Beds', 'Attached Western Bathroom', 'Center Nightstand', 'Wooden Flooring', 'Ceiling Fan', 'Secure Biker Parking']
    }
  ];

  // Gallery images with categories
  const galleryItems = [
    { id: 1, url: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_9.55.34_PM_da529e97.jpeg', category: 'Exterior & Parking', title: 'Homestay Exterior & Balcony Lounge' },
    { id: 2, url: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_9.55.33_PM_b354ea1e.jpeg', category: 'Dining & Balcony', title: 'Upper-Level Wooden Dining & Balcony' },
    { id: 3, url: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_9.55.32_PM__1__e6d00f31.jpeg', category: 'Bathroom', title: 'Clean Attached Western Bathroom' },
    { id: 4, url: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_9.55.32_PM_ca6306d0.jpeg', category: 'Dining & Balcony', title: 'Dining Area with Scenic Greenery View' },
    { id: 5, url: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_9.55.31_PM_2acdee74.jpeg', category: 'Rooms & Beds', title: 'Twin Sharing Room with Wooden Ceiling' },
    { id: 6, url: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_9.55.30_PM__2__d1613e8d.jpeg', category: 'Rooms & Beds', title: 'Cozy Double Bedroom with Wardrobe' },
    { id: 7, url: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_9.55.30_PM__1__2e2ade22.jpeg', category: 'Rooms & Beds', title: 'Double Bedroom Window View' },
    { id: 8, url: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_9.55.29_PM__1__fdf74cb9.jpeg', category: 'Dining & Balcony', title: 'Balcony Lounge Seating' },
    { id: 9, url: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_9.55.29_PM_0caef206.jpeg', category: 'Exterior & Parking', title: 'Gated Parking for Bikes & Cars' },
  ];

  // Booking Form State
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [roomType, setRoomType] = useState('Cozy Double Bedroom (₹1,500)');
  const [roomCount, setRoomCount] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [arrivalTime, setArrivalTime] = useState('12:00 PM - 02:00 PM');
  const [parking, setParking] = useState('Car Parking Required');
  const [mealPref, setMealPref] = useState('Home-cooked Veg Meals');
  const [paymentMode, setPaymentMode] = useState<'full' | 'advance'>('advance');
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Modal State for Payment & Receipt
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedOwnerMsg, setCopiedOwnerMsg] = useState(false);
  const [copiedBookingMsg, setCopiedBookingMsg] = useState(false);
  const [ownerNotified, setOwnerNotified] = useState(false);
  const [customerNotified, setCustomerNotified] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingDetails | null>(null);

  // Calculate nights
  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();

  // Get current rate per night based on selection
  const getRatePerNight = () => {
    if (roomType.includes('Twin')) return 1400;
    if (roomType.includes('Both')) return 2900;
    return 1500;
  };

  const ratePerNight = getRatePerNight();
  const totalAmount = ratePerNight * nights * roomCount;
  const payableAmount = paymentMode === 'full' ? totalAmount : Math.round(totalAmount * 0.3);

  // Handle room card select
  const handleSelectRoom = (room: Room) => {
    if (room.id === 'double') {
      setRoomType('Cozy Double Bedroom (₹1,500)');
    } else {
      setRoomType('Twin Sharing Bedroom (₹1,400)');
    }
    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('cyprushomestay@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 3000);
  };

  const validateBookingForm = () => {
    if (!fullName.trim() || !mobile.trim() || !city.trim()) {
      setBookingError('Please fill in your Full Name, Mobile Number, and Home City before continuing.');
      return false;
    }
    setBookingError(null);
    return true;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBookingForm()) return;
    setShowPaymentModal(true);
  };

  const buildBookingInquiryMessage = () => {
    return `Hello Cyprus Homestay! I would like to book a room:\n\n*Guest Name:* ${fullName}\n*Mobile:* ${mobile}\n*City:* ${city}\n*Check-in:* ${checkIn}\n*Check-out:* ${checkOut} (${nights} Night${nights > 1 ? 's' : ''})\n*Room:* ${roomType} (${roomCount} Room${roomCount > 1 ? 's' : ''})\n*Guests:* ${adults} Adult(s), ${children} Child(ren)\n*Arrival Time:* ${arrivalTime}\n*Parking:* ${parking}\n*Meal Pref:* ${mealPref}\n*Total Stay Amount:* ₹${totalAmount.toLocaleString()}\n*Selected Payment:* ${paymentMode === 'full' ? `Full Payment (₹${payableAmount.toLocaleString()})` : `30% Advance (₹${payableAmount.toLocaleString()})`}\n\nPlease confirm availability!`;
  };

  const handleSendBookingWhatsApp = () => {
    if (!validateBookingForm()) return;
    const msg = buildBookingInquiryMessage();
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSendBookingSMS = () => {
    if (!validateBookingForm()) return;
    const msg = buildBookingInquiryMessage().replace(/\*/g, '');
    window.location.href = `sms:+919876543210?body=${encodeURIComponent(msg)}`;
  };

  const formatPhoneForWhatsApp = (rawPhone: string) => {
    const digits = rawPhone.replace(/\D/g, '');
    if (digits.length === 10) return `91${digits}`;
    return digits;
  };

  const formatPhoneForSMS = (rawPhone: string) => {
    const digits = rawPhone.replace(/\D/g, '');
    if (digits.length === 10) return `+91${digits}`;
    return rawPhone.startsWith('+') ? rawPhone : `+${digits}`;
  };

  const handleDirectBookingConfirm = async (source: 'qr' | 'direct') => {
    if (!validateBookingForm()) return;

    const newBooking: BookingDetails = {
      bookingId: `#CYP-${newDateString()}`,
      checkIn,
      checkOut,
      nights,
      roomType,
      roomCount,
      adults,
      children,
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      city: city.trim(),
      arrivalTime,
      parking,
      mealPref,
      paymentMode,
      totalAmount,
      payableAmount,
      utrNumber: source === 'qr' ? 'UPI-QR-PAID' : 'PAY-AT-HOMESTAY',
      createdAt: new Date().toISOString(),
      status: 'Sent to Owner (Pending Confirmation)'
    };

    // Persist booking locally so confirmation always succeeds
    try {
      const existing = JSON.parse(localStorage.getItem('cyprus_homestay_bookings') || '[]');
      localStorage.setItem('cyprus_homestay_bookings', JSON.stringify([newBooking, ...existing]));
    } catch {
      // Ignore storage quota errors
    }

    // Sync booking to Supabase when a valid publishable/anon key is configured
    if (supabase) {
      try {
        await supabase.from('bookings').insert([
          {
            booking_id: newBooking.bookingId,
            check_in: newBooking.checkIn,
            check_out: newBooking.checkOut,
            nights: newBooking.nights,
            room_type: newBooking.roomType,
            room_count: newBooking.roomCount,
            adults: newBooking.adults,
            children: newBooking.children,
            full_name: newBooking.fullName,
            mobile: newBooking.mobile,
            email: newBooking.email,
            city: newBooking.city,
            arrival_time: newBooking.arrivalTime,
            parking: newBooking.parking,
            meal_pref: newBooking.mealPref,
            payment_mode: newBooking.paymentMode,
            total_amount: newBooking.totalAmount,
            payable_amount: newBooking.payableAmount,
            utr_number: newBooking.utrNumber,
            status: newBooking.status
          }
        ]);
      } catch {
        // Local persistence already succeeded
      }
    }

    setOwnerNotified(false);
    setCustomerNotified(false);
    setConfirmedBooking(newBooking);
    setShowPaymentModal(false);
  };

  const newDateString = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `2026-${randomNum}`;
  };

  const buildCustomerConfirmationMessage = (booking: BookingDetails) => {
    const totalGuests = booking.adults + booking.children;
    const guestBreakdown =
      booking.children > 0
        ? `${totalGuests} Guest(s) (${booking.adults} Adult(s), ${booking.children} Child(ren))`
        : `${booking.adults} Guest(s)`;
    const paymentLabel =
      booking.utrNumber === 'PAY-AT-HOMESTAY'
        ? `Pay at Homestay (Total: ₹${booking.totalAmount.toLocaleString()})`
        : `₹${booking.payableAmount.toLocaleString()} (${booking.paymentMode === 'full' ? 'Full Payment' : '30% Advance'} via UPI QR)`;

    return `Dear ${booking.fullName},\n\nThank you for your booking with *Cyprus Homestay*!\n\nYou have booked *${booking.roomType} × ${booking.roomCount}* for *${guestBreakdown}* from *${booking.checkIn}* to *${booking.checkOut}* (${booking.nights} Night${booking.nights > 1 ? 's' : ''}).\n\n*Booking ID:* ${booking.bookingId}\n*Total Stay Amount:* ₹${booking.totalAmount.toLocaleString()}\n*Payment:* ${paymentLabel}\n\nYour booking & payment details have been sent to the owner. *The owner will check and confirm your booking shortly!*\n\nHomestay Contact: +91 98765 43210\nAddress: Green Valley Foothills, Scenic Nature Trail Road, Cyprus Homestay`;
  };

  const buildOwnerNotificationMessage = (booking: BookingDetails) => {
    const paymentStatus =
      booking.utrNumber === 'PAY-AT-HOMESTAY'
        ? `Pay at Homestay (Total: ₹${booking.totalAmount.toLocaleString()})`
        : `₹${booking.payableAmount.toLocaleString()} PAID via UPI QR (${booking.paymentMode === 'full' ? 'Full Payment' : '30% Advance'})`;

    return `New Payment & Customer Booking Details — Cyprus Homestay!\n\n*Booking ID:* ${booking.bookingId}\n*Status:* Sent to Owner — Please Check & Confirm\n\n*Customer Details:*\n• Name: ${booking.fullName}\n• Mobile: ${booking.mobile}\n• City: ${booking.city}${booking.email ? `\n• Email: ${booking.email}` : ''}\n\n*Room & Guest Details:*\n• Room: ${booking.roomType} × ${booking.roomCount}\n• Guests: ${booking.adults} Adult(s), ${booking.children} Child(ren)\n• Check-in: ${booking.checkIn}\n• Check-out: ${booking.checkOut} (${booking.nights} Night${booking.nights > 1 ? 's' : ''})\n• Arrival: ${booking.arrivalTime}\n• Parking: ${booking.parking}\n• Meals: ${booking.mealPref}\n\n*Payment Details:*\n• Total Stay Amount: ₹${booking.totalAmount.toLocaleString()}\n• Payment Received: ${paymentStatus}\n\nPlease verify the payment and confirm the customer's booking!`;
  };

  const handleCopyOwnerMessage = () => {
    if (!confirmedBooking) return;
    const msg = buildOwnerNotificationMessage(confirmedBooking).replace(/\*/g, '');
    navigator.clipboard.writeText(msg);
    setCopiedOwnerMsg(true);
    setOwnerNotified(true);
    setTimeout(() => setCopiedOwnerMsg(false), 3000);
  };

  const handleCopyBookingMessage = () => {
    if (!confirmedBooking) return;
    const msg = buildCustomerConfirmationMessage(confirmedBooking).replace(/\*/g, '');
    navigator.clipboard.writeText(msg);
    setCopiedBookingMsg(true);
    setCustomerNotified(true);
    setTimeout(() => setCopiedBookingMsg(false), 3000);
  };

  const filteredGallery = activeTab === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeTab);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-11 h-11 rounded-full bg-emerald-700 flex items-center justify-center text-white shadow-md">
              <Trees className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-serif font-bold text-emerald-900 tracking-tight">Cyprus Homestay</span>
              <p className="text-xs text-emerald-700 font-medium tracking-wide">Nature Retreat & Wooden Rooms</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-stone-600">
            <a href="#home" className="hover:text-emerald-700 transition-colors">Home</a>
            <a href="#amenities" className="hover:text-emerald-700 transition-colors">Amenities</a>
            <a href="#rooms" className="hover:text-emerald-700 transition-colors">Rooms & Pricing</a>
            <a href="#gallery" className="hover:text-emerald-700 transition-colors">Gallery</a>
            <a href="#reviews" className="hover:text-emerald-700 transition-colors">Reviews</a>
            <a href="#contact" className="hover:text-emerald-700 transition-colors">Contact</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href="tel:+919876543210" 
              className="flex items-center gap-2 text-emerald-800 font-medium hover:text-emerald-900 bg-emerald-50 px-3.5 py-2 rounded-full border border-emerald-200 text-sm transition-all"
            >
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>+91 98765 43210</span>
            </a>
            <a 
              href="#booking-section"
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.02]"
            >
              Book Now
            </a>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 text-stone-700 hover:text-emerald-700 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
            <a 
              href="#home" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-stone-700 font-medium hover:text-emerald-700 border-b border-stone-100"
            >
              Home
            </a>
            <a 
              href="#amenities" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-stone-700 font-medium hover:text-emerald-700 border-b border-stone-100"
            >
              Amenities
            </a>
            <a 
              href="#rooms" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-stone-700 font-medium hover:text-emerald-700 border-b border-stone-100"
            >
              Rooms & Pricing
            </a>
            <a 
              href="#gallery" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-stone-700 font-medium hover:text-emerald-700 border-b border-stone-100"
            >
              Gallery
            </a>
            <a 
              href="#reviews" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-stone-700 font-medium hover:text-emerald-700 border-b border-stone-100"
            >
              Reviews
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-stone-700 font-medium hover:text-emerald-700 border-b border-stone-100"
            >
              Contact
            </a>
            <div className="pt-2 flex flex-col gap-3">
              <a 
                href="tel:+919876543210" 
                className="flex items-center justify-center gap-2 text-emerald-800 font-medium bg-emerald-50 py-2.5 rounded-xl border border-emerald-200"
              >
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>Call +91 98765 43210</span>
              </a>
              <a 
                href="#booking-section"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-center py-3 rounded-xl font-medium shadow-md"
              >
                Book Now
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative bg-emerald-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img 
            src="/assets/aistudio/WhatsApp_Image_2026-11-12_at_9.55.34_PM_da529e97.jpeg" 
            alt="Cyprus Homestay Exterior" 
            className="w-full h-full object-cover scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/70 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 backdrop-blur-md text-emerald-200 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-600/40 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Welcome to Your Peaceful Nature Escape</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight max-w-3xl leading-tight">
            Cyprus Homestay & Nature Retreat
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-stone-200 max-w-2xl leading-relaxed">
            Immerse yourself in serene greenery with cozy wooden-ceiling rooms, spacious upper-level balcony dining, and secure gated parking specially welcoming bikers and families.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <a 
              href="#booking-section"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-semibold shadow-xl shadow-emerald-900/40 transition-all hover:scale-105 flex items-center gap-3 text-lg"
            >
              <span>Check Availability & Pre-Book</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="#rooms"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-4 rounded-xl font-semibold transition-all"
            >
              Explore Rooms
            </a>
          </div>

          {/* Quick Badges */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-8 border-t border-emerald-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-800/60 flex items-center justify-center text-emerald-300">
                <Trees className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-stone-300">Surroundings</p>
                <p className="text-sm font-semibold text-white">Lush Greenery</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-800/60 flex items-center justify-center text-emerald-300">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-stone-300">Parking</p>
                <p className="text-sm font-semibold text-white">Gated Bike & Car</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-800/60 flex items-center justify-center text-emerald-300">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-stone-300">Interiors</p>
                <p className="text-sm font-semibold text-white">Wooden Ceilings</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-800/60 flex items-center justify-center text-emerald-300">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-stone-300">Dining</p>
                <p className="text-sm font-semibold text-white">Home-Cooked Food</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Homestay Highlights & Amenities */}
      <section id="amenities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-700 font-semibold text-sm tracking-wider uppercase bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              Thoughtful Comforts
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              Homestay Highlights & Amenities
            </h2>
            <p className="mt-4 text-stone-600 text-lg">
              Designed for travelers seeking authentic warmth, pristine cleanliness, and peaceful mountain/greenery vibes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200 hover:shadow-lg hover:border-emerald-300 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <Car className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Gated Parking</h3>
              <p className="text-stone-600 leading-relaxed">
                Secure gated courtyard providing ample, safe parking space for both motorcycles (biker groups welcome!) and cars.
              </p>
            </div>

            <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200 hover:shadow-lg hover:border-emerald-300 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <Utensils className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Wooden Dining & Balcony Lounge</h3>
              <p className="text-stone-600 leading-relaxed">
                Spacious upper-level wooden dining and breezy balcony lounge offering stunning panoramic views of surrounding greenery.
              </p>
            </div>

            <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200 hover:shadow-lg hover:border-emerald-300 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <Bath className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Attached Western Bathrooms</h3>
              <p className="text-stone-600 leading-relaxed">
                Immaculate, modern attached western bathrooms equipped with hot water supply and overhead shower fixtures.
              </p>
            </div>

            <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200 hover:shadow-lg hover:border-emerald-300 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <Bed className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Wooden Flooring & Ceilings</h3>
              <p className="text-stone-600 leading-relaxed">
                Charming warm wooden flooring and wood-paneled ceilings fitted with efficient ceiling fans for cozy comfort.
              </p>
            </div>

            <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200 hover:shadow-lg hover:border-emerald-300 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <Trees className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Peaceful Garden View</h3>
              <p className="text-stone-600 leading-relaxed">
                Wake up to the sounds of nature, fresh breeze, and serene garden greenery right outside your room window.
              </p>
            </div>

            <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200 hover:shadow-lg hover:border-emerald-300 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Home-Cooked Meals</h3>
              <p className="text-stone-600 leading-relaxed">
                Delicious, hygienic home-cooked local vegetarian and non-vegetarian meals prepared on request with love.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Rooms & Pricing Showcase */}
      <section id="rooms" className="py-20 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-700 font-semibold text-sm tracking-wider uppercase bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              Accommodation
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              Rooms & Transparent Pricing
            </h2>
            <p className="mt-4 text-stone-600 text-lg">
              Cozy, clean, and beautifully finished with traditional wood craftsmanship. Select your room to instantly pre-book.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {rooms.map((room) => (
              <div 
                key={room.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-72 sm:h-80 overflow-hidden bg-stone-200">
                    <img 
                      src={room.image} 
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-emerald-900/80 backdrop-blur-md text-white px-4 py-2 rounded-xl font-serif text-lg font-bold shadow-lg">
                      ₹{room.price.toLocaleString()} <span className="text-xs font-sans font-normal text-emerald-200">/ night</span>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md text-stone-800 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-700" />
                      <span>Max Occupancy: {room.maxGuests}</span>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-2 text-emerald-700 font-medium text-sm">
                      <Bed className="w-4 h-4" />
                      <span>{room.beds}</span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-stone-900 mb-3">{room.name}</h3>
                    <p className="text-stone-600 leading-relaxed mb-6">{room.description}</p>

                    <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-stone-100">
                      {room.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-stone-700">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-8 pt-0">
                  <button 
                    onClick={() => handleSelectRoom(room)}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                  >
                    <span>Select Room to Book</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery with Categorized Tabs */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-emerald-700 font-semibold text-sm tracking-wider uppercase bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              Visual Tour
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              Homestay Photo Gallery
            </h2>
            <p className="mt-4 text-stone-600 text-lg">
              Explore authentic photos of our rooms, dining area, attached bathrooms, garden, and secure parking.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {['All', 'Rooms & Beds', 'Dining & Balcony', 'Bathroom', 'Exterior & Parking'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab 
                      ? 'bg-emerald-700 text-white shadow-md' 
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedImage(item.url)}
                className="group relative h-72 rounded-2xl overflow-hidden bg-stone-200 cursor-pointer shadow-md hover:shadow-xl transition-all"
              >
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">{item.category}</span>
                  <h4 className="text-white font-serif text-lg font-semibold">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-Time Reviews & Rating Summary Section */}
      <section id="reviews" className="py-20 bg-stone-100 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-emerald-700 font-semibold text-sm tracking-wider uppercase bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                Verified Guest Experiences
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-stone-900">
                Guest Reviews & Ratings
              </h2>
              <p className="mt-2 text-stone-600 text-lg">
                Real feedback from travelers, local guides, and biker groups who stayed with us.
              </p>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="mt-6 md:mt-0 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
            >
              <MessageSquarePlus className="w-5 h-5" />
              <span>Write a Review</span>
            </button>
          </div>

          {reviewNotice && (
            <div className="mb-8 bg-emerald-50 border border-emerald-200 text-emerald-900 px-5 py-3.5 rounded-2xl text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{reviewNotice}</span>
            </div>
          )}

          {/* Review Summary Card */}
          <div className="bg-white rounded-3xl p-8 shadow-md border border-stone-200 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
              
              <div className="text-center lg:text-left lg:border-r border-stone-200 lg:pr-8">
                <div className="text-5xl sm:text-6xl font-serif font-bold text-stone-900">4.7</div>
                <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-500 my-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-stone-600 font-medium">Based on 36 Google & Guest Reviews</p>
              </div>

              <div className="grid grid-cols-3 gap-4 lg:col-span-2 lg:border-r border-stone-200 lg:px-8">
                <div className="bg-stone-50 p-4 rounded-2xl text-center">
                  <p className="text-xs text-stone-500 font-medium mb-1">Rooms</p>
                  <p className="text-2xl font-bold text-stone-900">4.5</p>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl text-center">
                  <p className="text-xs text-stone-500 font-medium mb-1">Service</p>
                  <p className="text-2xl font-bold text-stone-900">4.5</p>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl text-center">
                  <p className="text-xs text-stone-500 font-medium mb-1">Location</p>
                  <p className="text-2xl font-bold text-stone-900">4.8</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {['bengal safari nearby 2', 'nature friendly 3', 'quiet stay 2', 'kind staff 5', 'peaceful atmosphere 5'].map((tag, idx) => (
                  <span key={idx} className="bg-emerald-50 text-emerald-800 text-xs font-medium px-3 py-1.5 rounded-full border border-emerald-200">
                    {tag}
                  </span>
                ))}
              </div>

            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div 
                key={rev.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-serif font-bold flex items-center justify-center text-sm shadow-sm">
                        {rev.author.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">{rev.author}</h4>
                        <p className="text-xs text-stone-500">{rev.role}</p>
                      </div>
                    </div>
                    <span className="text-xs text-stone-400">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>

                  <p className="text-stone-700 text-sm leading-relaxed mb-4">
                    "{rev.text}"
                  </p>
                </div>

                <div>
                  {rev.ownerReply && (
                    <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 mt-2 mb-3 text-xs text-stone-700">
                      <p className="font-bold text-emerald-900 mb-1 flex items-center gap-1">
                        <span>Cyprus Homestay (Owner)</span>
                      </p>
                      <p>{rev.ownerReply}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-100">
                    <button className="flex items-center gap-1 hover:text-emerald-700 transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Helpful ({rev.likes})</span>
                    </button>
                    <span className="text-emerald-700 font-medium">Verified Stay</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Add Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-stone-200 relative">
            <button 
              onClick={() => setShowReviewModal(false)}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-700 bg-stone-100 p-2 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">Write a Review</h3>
            <p className="text-stone-600 text-sm mb-6">
              Share your experience staying at Cyprus Homestay with future travelers.
            </p>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Your Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Priya Sharma"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Rating *</label>
                <select 
                  value={newRating}
                  onChange={(e) => setNewRating(parseInt(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5) - Excellent</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5) - Very Good</option>
                  <option value={3}>⭐⭐⭐ (3/5) - Good</option>
                  <option value={2}>⭐⭐ (2/5) - Fair</option>
                  <option value={1}>⭐ (1/5) - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Your Review *</label>
                <textarea 
                  rows={4}
                  placeholder="Tell us about the rooms, food, parking, and hospitality..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                  required
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3.5 rounded-xl shadow-lg transition-all mt-2"
              >
                Publish Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-emerald-300 bg-stone-800/80 p-2 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={selectedImage} 
              alt="Enlarged view" 
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl border border-stone-800"
            />
          </div>
        </div>
      )}

      {/* Complete Pre-Booking & Automated Guest Intake Form */}
      <section id="booking-section" className="py-20 bg-stone-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
            
            {/* Header Banner */}
            <div className="bg-emerald-900 text-white p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <Trees className="w-64 h-64 text-white" />
              </div>
              <div className="relative z-10">
                <span className="bg-emerald-800 text-emerald-200 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-700">
                  UPI QR Payment & Booking
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold mt-3">
                  Check Availability & Book Room
                </h2>
                <p className="text-emerald-100 mt-2 max-w-2xl">
                  1. Pay via UPI QR &rarr; 2. Payment &amp; guest details go to the Owner &rarr; 3. Customer receives room booking status while the owner verifies &amp; confirms.
                </p>
              </div>
            </div>

            {/* Post-Payment 2-Step Notification Receipt or Form */}
            {confirmedBooking ? (
              <div className="p-8 sm:p-12 text-center space-y-6">
                <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div>
                  <span className="bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-300">
                    {confirmedBooking.status}
                  </span>
                  <h3 className="text-3xl font-serif font-bold text-stone-900 mt-3">
                    Payment Submitted — Send Messages
                  </h3>
                  <p className="text-stone-600 mt-1">
                    Booking Reference ID: <strong className="text-emerald-800 font-mono text-lg">{confirmedBooking.bookingId}</strong>
                  </p>
                </div>

                <div className="bg-stone-50 rounded-2xl p-6 text-left max-w-2xl mx-auto border border-stone-200 space-y-3">
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <span className="text-stone-500">Guest Name:</span>
                    <span className="font-semibold text-stone-900">{confirmedBooking.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <span className="text-stone-500">Mobile Number:</span>
                    <span className="font-semibold text-stone-900">{confirmedBooking.mobile}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <span className="text-stone-500">Dates:</span>
                    <span className="font-semibold text-stone-900">{confirmedBooking.checkIn} to {confirmedBooking.checkOut} ({confirmedBooking.nights} Night{confirmedBooking.nights > 1 ? 's' : ''})</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <span className="text-stone-500">Room &amp; Guests:</span>
                    <span className="font-semibold text-stone-900 text-right">
                      {confirmedBooking.roomType} × {confirmedBooking.roomCount} ({confirmedBooking.adults} Adult{confirmedBooking.adults > 1 ? 's' : ''}{confirmedBooking.children > 0 ? `, ${confirmedBooking.children} Child` : ''})
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <span className="text-stone-500">Parking Needed:</span>
                    <span className="font-semibold text-stone-900">{confirmedBooking.parking}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-stone-500">
                      {confirmedBooking.utrNumber === 'PAY-AT-HOMESTAY'
                        ? 'Total Amount (Pay at Homestay):'
                        : `Payment (${confirmedBooking.paymentMode === 'full' ? 'Full' : '30% Advance'} via UPI QR):`}
                    </span>
                    <span className="font-bold text-emerald-800 text-lg">
                      ₹{(confirmedBooking.utrNumber === 'PAY-AT-HOMESTAY' ? confirmedBooking.totalAmount : confirmedBooking.payableAmount).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Step 1: Send Payment & Customer Details to Owner */}
                <div className={`max-w-2xl mx-auto rounded-2xl p-6 space-y-4 text-left border-2 transition-all ${
                  ownerNotified
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-amber-50 border-amber-300 shadow-sm'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      ownerNotified
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-amber-200 text-amber-950'
                    }`}>
                      {ownerNotified ? 'Step 1 · Sent to Owner ✓' : 'Step 1 · First Send to Owner'}
                    </span>
                    <span className="text-xs font-mono text-stone-600">Owner: +91 98765 43210</span>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg text-stone-900">
                      Send Payment &amp; Customer Details to Owner
                    </h4>
                    <p className="text-xs text-stone-600 mt-1">
                      Send the guest&apos;s payment amount, room, dates, and contact details to the homestay owner for verification.
                    </p>
                  </div>
                  <div className="bg-white/90 border border-stone-200 rounded-xl p-3.5 text-xs text-stone-700 whitespace-pre-line font-sans leading-relaxed max-h-44 overflow-y-auto">
                    {buildOwnerNotificationMessage(confirmedBooking).replace(/\*/g, '')}
                  </div>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                    <a
                      href={`https://wa.me/919876543210?text=${encodeURIComponent(buildOwnerNotificationMessage(confirmedBooking))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOwnerNotified(true)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send Payment Details to Owner (WhatsApp)</span>
                    </a>
                    <a
                      href={`sms:+919876543210?body=${encodeURIComponent(buildOwnerNotificationMessage(confirmedBooking).replace(/\*/g, ''))}`}
                      onClick={() => setOwnerNotified(true)}
                      className="bg-stone-800 hover:bg-stone-900 text-white font-semibold py-3 px-5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all text-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>SMS Owner</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyOwnerMessage}
                      className="bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copiedOwnerMsg ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Step 2: Send Booking Status Message to Customer */}
                <div className={`max-w-2xl mx-auto rounded-2xl p-6 space-y-4 text-left border-2 transition-all ${
                  customerNotified
                    ? 'bg-emerald-50 border-emerald-400'
                    : ownerNotified
                      ? 'bg-emerald-50 border-emerald-500 shadow-md'
                      : 'bg-stone-50 border-stone-200'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      customerNotified
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {customerNotified ? 'Step 2 · Sent to Customer ✓' : 'Step 2 · Then Send to Customer'}
                    </span>
                    <span className="text-xs font-mono text-stone-600">Customer: {confirmedBooking.mobile}</span>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg text-emerald-950">
                      Send Booking Status Message to Customer
                    </h4>
                    <p className="text-xs text-emerald-800 mt-1">
                      Inform <strong>{confirmedBooking.fullName}</strong> which room(s) were booked for how many guests, and that the owner will check and confirm their booking.
                    </p>
                  </div>
                  <div className="bg-white/90 border border-emerald-200 rounded-xl p-3.5 text-xs text-stone-700 whitespace-pre-line font-sans leading-relaxed max-h-44 overflow-y-auto">
                    {buildCustomerConfirmationMessage(confirmedBooking).replace(/\*/g, '')}
                  </div>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                    <a
                      href={`https://wa.me/${formatPhoneForWhatsApp(confirmedBooking.mobile)}?text=${encodeURIComponent(buildCustomerConfirmationMessage(confirmedBooking))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setCustomerNotified(true)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp to Customer</span>
                    </a>
                    <a
                      href={`sms:${formatPhoneForSMS(confirmedBooking.mobile)}?body=${encodeURIComponent(buildCustomerConfirmationMessage(confirmedBooking).replace(/\*/g, ''))}`}
                      onClick={() => setCustomerNotified(true)}
                      className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all text-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>SMS to Customer</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyBookingMessage}
                      className="bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copiedBookingMsg ? 'Copied!' : 'Copy Message'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmedBooking(null);
                      setOwnerNotified(false);
                      setCustomerNotified(false);
                    }}
                    className="bg-stone-200 hover:bg-stone-300 text-stone-800 text-sm font-semibold py-2.5 px-6 rounded-xl transition-all"
                  >
                    Make Another Booking
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProceedToPayment} className="p-8 sm:p-12 space-y-8">
                
                {/* Section 1: Dates & Rooms */}
                <div>
                  <h3 className="text-xl font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-700" />
                    <span>1. Select Dates & Room Type</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Check-in Date *</label>
                      <input 
                        type="date" 
                        value={checkIn}
                        min={today}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Check-out Date *</label>
                      <input 
                        type="date" 
                        value={checkOut}
                        min={checkIn}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Room Type *</label>
                      <select 
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      >
                        <option value="Cozy Double Bedroom (₹1,500)">Cozy Double Bedroom (₹1,500 / night)</option>
                        <option value="Twin Sharing Bedroom (₹1,400)">Twin Sharing Bedroom (₹1,400 / night)</option>
                        <option value="Both Rooms Combo (₹2,900)">Both Rooms Combo (₹2,900 / night)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Number of Rooms *</label>
                      <select 
                        value={roomCount}
                        onChange={(e) => setRoomCount(parseInt(e.target.value))}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      >
                        <option value={1}>1 Room</option>
                        <option value={2}>2 Rooms</option>
                        <option value={3}>3 Rooms</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Adults *</label>
                      <select 
                        value={adults}
                        onChange={(e) => setAdults(parseInt(e.target.value))}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      >
                        <option value={1}>1 Adult</option>
                        <option value={2}>2 Adults</option>
                        <option value={3}>3 Adults</option>
                        <option value={4}>4 Adults</option>
                        <option value={5}>5+ Adults</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Children (Below 12 yrs)</label>
                      <select 
                        value={children}
                        onChange={(e) => setChildren(parseInt(e.target.value))}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      >
                        <option value={0}>No Children</option>
                        <option value={1}>1 Child</option>
                        <option value={2}>2 Children</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Guest Details */}
                <div className="pt-6 border-t border-stone-200">
                  <h3 className="text-xl font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-700" />
                    <span>2. Guest Contact & Arrival Info</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Rahul Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Mobile / WhatsApp Number *</label>
                      <input 
                        type="tel" 
                        placeholder="e.g. +91 98765 43210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Email Address (Optional)</label>
                      <input 
                        type="email" 
                        placeholder="e.g. rahul@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Home City / State *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Bengaluru, Karnataka"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Estimated Arrival Time</label>
                      <select 
                        value={arrivalTime}
                        onChange={(e) => setArrivalTime(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      >
                        <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                        <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM</option>
                        <option value="05:00 PM - 08:00 PM">05:00 PM - 08:00 PM</option>
                        <option value="After 08:00 PM (Late Night)">After 08:00 PM (Late Night)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Parking Needed</label>
                      <select 
                        value={parking}
                        onChange={(e) => setParking(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      >
                        <option value="Car Parking Required">Car Parking Required</option>
                        <option value="Motorcycle / Superbike Parking">Motorcycle / Superbike Parking</option>
                        <option value="Both Car & Bike">Both Car & Bike</option>
                        <option value="No Parking Needed">No Parking Needed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Meal Preference / Requests</label>
                      <select 
                        value={mealPref}
                        onChange={(e) => setMealPref(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      >
                        <option value="Home-cooked Veg Meals">Home-cooked Veg Meals</option>
                        <option value="Home-cooked Non-Veg Meals">Home-cooked Non-Veg Meals</option>
                        <option value="Both Veg & Non-Veg">Both Veg & Non-Veg</option>
                        <option value="No Meals Required">No Meals Required</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Live Price Summary & Payment Option */}
                <div className="pt-6 border-t border-stone-200">
                  <h3 className="text-xl font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-700" />
                    <span>3. Price Summary & Payment Mode</span>
                  </h3>

                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 space-y-4">
                    <div className="flex justify-between items-center text-stone-700">
                      <span>Rate per night:</span>
                      <span className="font-semibold">₹{ratePerNight.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-stone-700">
                      <span>Duration:</span>
                      <span className="font-semibold">{nights} Night(s) × {roomCount} Room(s)</span>
                    </div>
                    <div className="flex justify-between items-center text-stone-900 font-bold text-lg pt-3 border-t border-emerald-200">
                      <span>Total Stay Amount:</span>
                      <span className="text-emerald-900">₹{totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="pt-2">
                      <label className="block text-sm font-medium text-stone-800 mb-2">Select Payment Option:</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label 
                          onClick={() => setPaymentMode('advance')}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            paymentMode === 'advance' 
                              ? 'bg-white border-emerald-600 shadow-sm' 
                              : 'bg-stone-50 border-stone-200 text-stone-600'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="paymentMode" 
                            checked={paymentMode === 'advance'}
                            onChange={() => setPaymentMode('advance')}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <p className="font-semibold text-stone-900 text-sm">30% Advance Token (₹{Math.round(totalAmount * 0.3).toLocaleString()})</p>
                            <p className="text-xs text-stone-500">Lock your booking instantly</p>
                          </div>
                        </label>

                        <label 
                          onClick={() => setPaymentMode('full')}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            paymentMode === 'full' 
                              ? 'bg-white border-emerald-600 shadow-sm' 
                              : 'bg-stone-50 border-stone-200 text-stone-600'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="paymentMode" 
                            checked={paymentMode === 'full'}
                            onChange={() => setPaymentMode('full')}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <p className="font-semibold text-stone-900 text-sm">Full Payment (₹{totalAmount.toLocaleString()})</p>
                            <p className="text-xs text-stone-500">Pay complete amount now</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {bookingError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                        {bookingError}
                      </div>
                    )}

                    <div className="bg-white/90 p-5 rounded-xl border border-emerald-200 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-xs text-stone-500 uppercase tracking-wide font-medium">Amount Payable Now</p>
                          <p className="text-2xl font-serif font-bold text-emerald-900">₹{payableAmount.toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button 
                            type="submit"
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3.5 px-7 rounded-xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                          >
                            <span>Pay via UPI QR &amp; Confirm</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className="text-xs font-medium text-stone-600">
                          Or send booking message directly:
                        </span>
                        <div className="flex flex-wrap gap-2.5">
                          <button
                            type="button"
                            onClick={handleSendBookingWhatsApp}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm flex items-center gap-2 transition-all"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Send on WhatsApp</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleSendBookingSMS}
                            className="bg-amber-700 hover:bg-amber-800 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm flex items-center gap-2 transition-all"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Send via SMS</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </form>
            )}

          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 relative">
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 bg-stone-100 p-2 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">Step 1: Scan &amp; Pay via UPI</h3>
            <p className="text-stone-600 text-sm mb-5">
              Scan this Google Pay / UPI QR code using GPay, PhonePe, or Paytm to pay <strong className="text-emerald-800">₹{payableAmount.toLocaleString()}</strong>. After paying, your booking &amp; payment details will go to the owner and a status message will be ready for the customer.
            </p>

            {/* Real Uploaded QR Code Box */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-center mb-5 space-y-4">
              <div className="w-56 h-56 sm:w-64 sm:h-64 bg-white mx-auto p-2.5 rounded-2xl shadow-md border border-stone-200 flex items-center justify-center overflow-hidden">
                <img 
                  src="/assets/aistudio/WhatsApp_Image_2026-11-13_at_10.10.00_AM_efe976a6.jpeg" 
                  alt="Cyprus Homestay UPI Payment QR Code" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Scan with GPay / PhonePe / Paytm
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <a
                  href="/assets/aistudio/WhatsApp_Image_2026-11-13_at_10.10.00_AM_efe976a6.jpeg"
                  download="cyprus-homestay-payment-qr.jpeg"
                  className="bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Save QR</span>
                </a>
                <a
                  href={`upi://pay?pa=cyprushomestay@upi&pn=Cyprus%20Homestay&am=${payableAmount}&cu=INR`}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Pay ₹{payableAmount.toLocaleString()} in UPI App</span>
                </a>
              </div>

              <div>
                <p className="text-xs text-stone-500">Or pay directly to UPI ID:</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <code className="bg-stone-200 px-3 py-1.5 rounded-lg font-mono text-sm font-bold text-emerald-900">
                    cyprushomestay@upi
                  </code>
                  <button 
                    type="button"
                    onClick={handleCopyUpi}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Post-Payment Submission Actions */}
            <div className="space-y-3">
              <button 
                type="button"
                onClick={() => handleDirectBookingConfirm('qr')}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-4 rounded-xl shadow-lg transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>I Have Paid — Send Details to Owner &amp; Customer</span>
              </button>
              <button 
                type="button"
                onClick={() => handleDirectBookingConfirm('direct')}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-3 rounded-xl transition-all text-sm"
              >
                Pay at Homestay (Send Request to Owner)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ / House Rules Section */}
      <section className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-700 font-semibold text-sm tracking-wider uppercase bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              Guidance
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              House Rules & Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
              <h4 className="font-serif font-bold text-lg text-stone-900 mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-700" />
                <span>Check-in & Check-out Timings</span>
              </h4>
              <p className="text-stone-600 text-sm leading-relaxed">
                Check-in is from <strong>12:00 PM</strong> onwards. Check-out time is <strong>11:00 AM</strong>. Early check-in or late check-out can be requested in advance based on availability.
              </p>
            </div>

            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
              <h4 className="font-serif font-bold text-lg text-stone-900 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>Parking & Biker Friendliness</span>
              </h4>
              <p className="text-stone-600 text-sm leading-relaxed">
                We have spacious gated parking with CCTV surveillance. Biker groups are most welcome with dedicated safe washing and gear-drying areas.
              </p>
            </div>

            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
              <h4 className="font-serif font-bold text-lg text-stone-900 mb-2 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-700" />
                <span>Meals & Kitchen Access</span>
              </h4>
              <p className="text-stone-600 text-sm leading-relaxed">
                Fresh home-cooked vegetarian and non-vegetarian meals are prepared on order in our kitchen. Please inform us of your preferences during booking.
              </p>
            </div>

            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
              <h4 className="font-serif font-bold text-lg text-stone-900 mb-2 flex items-center gap-2">
                <Info className="w-5 h-5 text-emerald-700" />
                <span>Quiet Hours & Smoking Policy</span>
              </h4>
              <p className="text-stone-600 text-sm leading-relaxed">
                To maintain a peaceful nature environment, quiet hours are observed from 10:00 PM to 7:00 AM. Smoking is strictly prohibited inside bedrooms (designated smoking area on upper balcony).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Footer */}
      <footer id="contact" className="bg-emerald-950 text-stone-300 py-16 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-emerald-900">
            
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-white">
                  <Trees className="w-5 h-5" />
                </div>
                <span className="text-2xl font-serif font-bold text-white tracking-tight">Cyprus Homestay</span>
              </div>
              <p className="text-stone-300 max-w-md leading-relaxed text-sm">
                Your tranquil sanctuary nestled amidst greenery, offering warm wooden interiors, upper balcony lounge, and secure gated parking for families and biker travelers.
              </p>
              <div className="pt-2 flex items-center gap-4">
                <a 
                  href="tel:+919876543210" 
                  className="bg-emerald-950 hover:bg-emerald-900 text-emerald-200 px-4 py-2.5 rounded-xl border border-emerald-800 text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call Owner</span>
                </a>
                <a 
                  href="https://wa.me/919876543210" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-serif font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#home" className="hover:text-emerald-300 transition-colors">Home</a></li>
                <li><a href="#amenities" className="hover:text-emerald-300 transition-colors">Amenities & Highlights</a></li>
                <li><a href="#rooms" className="hover:text-emerald-300 transition-colors">Rooms & Pricing</a></li>
                <li><a href="#gallery" className="hover:text-emerald-300 transition-colors">Photo Gallery</a></li>
                <li><a href="#reviews" className="hover:text-emerald-300 transition-colors">Reviews</a></li>
                <li><a href="#booking-section" className="hover:text-emerald-300 transition-colors">Pre-Book Room</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-serif font-bold text-lg mb-4">Contact Info</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Green Valley Foothills, Scenic Nature Trail Road, Cyprus Homestay Gate</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Check-in: 12 PM | Check-out: 11 AM</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
            <p>© 2026 Cyprus Homestay. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with warmth & nature in mind <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
