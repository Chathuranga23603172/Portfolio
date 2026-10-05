import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  doc, 
  setDoc, 
  increment 
} from 'firebase/firestore';

// Check if Firebase keys are populated in environment variables
export const isFirebaseConfigured = () => {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return Boolean(
    projectId &&
    projectId.trim() !== '' &&
    projectId !== 'your_project_id' &&
    apiKey &&
    apiKey.trim() !== '' &&
    apiKey !== 'your_firebase_api_key'
  );
};

// Initialize Firebase App instance lazily
let dbInstance = null;

const getDb = () => {
  if (!isFirebaseConfigured()) return null;
  if (!dbInstance) {
    try {
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      };

      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      dbInstance = getFirestore(app);
    } catch (err) {
      console.warn('Firebase initialization skipped or encountered error:', err);
      return null;
    }
  }
  return dbInstance;
};

// Helper to format date in exact friendly format: "Oct 5, 2026 at 4:06 PM"
export const formatReviewTimestamp = (dateInput) => {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) {
    return 'Recently';
  }

  const datePart = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${datePart} at ${timePart}`;
};

// Generate two-letter initials from name
export const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (name.slice(0, 2) || 'NC').toUpperCase();
};

// Local storage keys
const LOCAL_STORAGE_REVIEWS_KEY = 'portfolio_real_reviews';
const LOCAL_STORAGE_LIKES_KEY = 'portfolio_real_likes';

// Get local stored reviews (STRICTLY NO DUMMY DATA)
const getLocalReviews = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading reviews from localStorage:', e);
  }
  return [];
};

/**
 * Real-time Reviews Subscription
 * Connects directly to Firestore 'reviews' collection using onSnapshot.
 * Displays ONLY real data from the database.
 */
export const subscribeToReviews = (callback) => {
  const db = getDb();

  if (db) {
    try {
      const reviewsRef = collection(db, 'reviews');

      // Real-time listener: onSnapshot updates immediately on any device submission
      const unsubscribe = onSnapshot(
        reviewsRef,
        (snapshot) => {
          if (snapshot.empty) {
            callback([]);
            return;
          }

          const reviews = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            let formattedDate = data.formattedDate;
            let timestampMs = Date.now();

            if (data.createdAt && typeof data.createdAt.toDate === 'function') {
              const d = data.createdAt.toDate();
              formattedDate = formatReviewTimestamp(d);
              timestampMs = d.getTime();
            } else if (data.createdAt?.seconds) {
              const d = new Date(data.createdAt.seconds * 1000);
              formattedDate = formatReviewTimestamp(d);
              timestampMs = d.getTime();
            } else if (data.timestampMs) {
              timestampMs = Number(data.timestampMs);
              formattedDate = formatReviewTimestamp(new Date(timestampMs));
            } else if (data.createdAt) {
              formattedDate = formatReviewTimestamp(data.createdAt);
            }

            return {
              id: docSnap.id,
              name: data.name || 'Anonymous',
              email: data.email || '',
              role: data.role || 'Visitor / Developer',
              rating: Number(data.rating) || 5,
              message: data.message || '',
              formattedDate: formattedDate || formatReviewTimestamp(new Date()),
              timestampMs,
              initials: getInitials(data.name || 'A'),
              avatarColor: data.avatarColor || 'from-brand-violet to-brand-cyan',
              verified: Boolean(data.verified),
            };
          });

          // Sort by newest timestamp descending so real-time updates instantly surface at the top
          reviews.sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0));

          callback(reviews);
        },
        (error) => {
          console.error('Firestore reviews subscription failed, falling back to local:', error);
          callback(getLocalReviews());
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error('Could not establish Firestore listener:', err);
    }
  }

  // Fallback to local storage (only real user submissions)
  callback(getLocalReviews());

  const handleStorageChange = () => {
    callback(getLocalReviews());
  };

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('portfolio-review-added', handleStorageChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('portfolio-review-added', handleStorageChange);
  };
};

/**
 * Add a New Review to the database (Includes Name, Email, Role, Rating, Message, Timestamp)
 */
export const addReview = async ({ name, email, role, rating, message }) => {
  const trimmedName = name.trim();
  const trimmedEmail = email ? email.trim() : '';
  const trimmedRole = role ? role.trim() : 'Visitor / Developer';
  const trimmedMessage = message.trim();
  const numRating = Math.max(1, Math.min(5, Number(rating) || 5));

  const now = new Date();
  const formattedDate = formatReviewTimestamp(now);
  const initials = getInitials(trimmedName);

  const gradientColors = [
    'from-brand-violet to-brand-cyan',
    'from-emerald-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-amber-500 to-rose-500',
    'from-blue-500 to-teal-400',
  ];
  const avatarColor = gradientColors[Math.floor(Math.random() * gradientColors.length)];

  const db = getDb();

  if (db) {
    try {
      const docRef = await addDoc(collection(db, 'reviews'), {
        name: trimmedName,
        email: trimmedEmail,
        role: trimmedRole,
        rating: numRating,
        message: trimmedMessage,
        createdAt: serverTimestamp(),
        timestampMs: now.getTime(),
        formattedDate,
        avatarColor,
        initials,
        verified: false,
      });

      return {
        id: docRef.id,
        name: trimmedName,
        email: trimmedEmail,
        role: trimmedRole,
        rating: numRating,
        message: trimmedMessage,
        formattedDate,
        timestampMs: now.getTime(),
        initials,
        avatarColor,
      };
    } catch (err) {
      console.error('Firestore review submission error:', err);
      throw err;
    }
  }

  // Local storage fallback for real submissions
  const newReview = {
    id: `review-${Date.now()}`,
    name: trimmedName,
    email: trimmedEmail,
    role: trimmedRole,
    rating: numRating,
    message: trimmedMessage,
    formattedDate,
    timestampMs: now.getTime(),
    initials,
    avatarColor,
    verified: false,
  };

  const currentReviews = getLocalReviews();
  const updatedReviews = [newReview, ...currentReviews];
  localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(updatedReviews));

  window.dispatchEvent(new CustomEvent('portfolio-review-added'));
  return newReview;
};

/**
 * Real-time Global Likes Subscription (Strictly Real Data)
 */
export const subscribeToLikes = (callback) => {
  const db = getDb();

  if (db) {
    try {
      const likesDocRef = doc(db, 'stats', 'likes');

      const unsubscribe = onSnapshot(
        likesDocRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            callback(Number(data.count) || 0);
          } else {
            callback(0);
          }
        },
        (error) => {
          console.warn('Firestore likes subscription error:', error);
          const local = Number(localStorage.getItem(LOCAL_STORAGE_LIKES_KEY)) || 0;
          callback(local);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.warn('Could not establish Firestore likes listener:', err);
    }
  }

  // Local fallback
  const localLikes = Number(localStorage.getItem(LOCAL_STORAGE_LIKES_KEY)) || 0;
  callback(localLikes);

  const handleLikesChange = () => {
    const val = Number(localStorage.getItem(LOCAL_STORAGE_LIKES_KEY)) || 0;
    callback(val);
  };

  window.addEventListener('storage', handleLikesChange);
  window.addEventListener('portfolio-likes-updated', handleLikesChange);

  return () => {
    window.removeEventListener('storage', handleLikesChange);
    window.removeEventListener('portfolio-likes-updated', handleLikesChange);
  };
};

/**
 * Increment Global Likes
 */
export const incrementLikes = async () => {
  const db = getDb();

  if (db) {
    try {
      const likesDocRef = doc(db, 'stats', 'likes');
      await setDoc(likesDocRef, { count: increment(1) }, { merge: true });
      return;
    } catch (err) {
      console.warn('Firestore increment likes error, falling back to local:', err);
    }
  }

  // Local fallback
  const current = Number(localStorage.getItem(LOCAL_STORAGE_LIKES_KEY)) || 0;
  const next = current + 1;
  localStorage.setItem(LOCAL_STORAGE_LIKES_KEY, String(next));
  window.dispatchEvent(new CustomEvent('portfolio-likes-updated'));
  return next;
};
