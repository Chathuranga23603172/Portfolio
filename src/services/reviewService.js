import { 
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
import { db, isFirebaseConfigured } from '../firebase';

export { db, isFirebaseConfigured };

/**
 * Format timestamp nicely into "Oct 5, 2026 at 4:06 PM"
 */
export const formatReviewTimestamp = (dateInput) => {
  if (!dateInput) return 'Recently';
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

/**
 * Generate 2-letter initials from name
 */
export const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (name.slice(0, 2) || 'NC').toUpperCase();
};

const LOCAL_STORAGE_REVIEWS_KEY = 'portfolio_real_reviews';
const LOCAL_STORAGE_LIKES_KEY = 'portfolio_real_likes';

const getLocalReviews = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading reviews from localStorage:', e);
  }
  return [];
};

/**
 * Parse a Firestore doc snapshot into a review object
 */
export const parseReviewDoc = (docSnap) => {
  const data = docSnap.data();
  let formattedDate = 'Just now';
  let timestampMs = Date.now();

  if (data.createdAt) {
    if (typeof data.createdAt.toDate === 'function') {
      const d = data.createdAt.toDate();
      formattedDate = formatReviewTimestamp(d);
      timestampMs = d.getTime();
    } else if (data.createdAt.seconds) {
      const d = new Date(data.createdAt.seconds * 1000);
      formattedDate = formatReviewTimestamp(d);
      timestampMs = d.getTime();
    } else if (typeof data.createdAt === 'string') {
      const d = new Date(data.createdAt);
      formattedDate = formatReviewTimestamp(d);
      timestampMs = d.getTime();
    }
  } else if (data.timestampMs) {
    timestampMs = Number(data.timestampMs);
    formattedDate = formatReviewTimestamp(new Date(timestampMs));
  } else if (data.formattedDate) {
    formattedDate = data.formattedDate;
  }

  return {
    id: docSnap.id,
    name: data.name || 'Anonymous',
    email: data.email || '',
    role: data.role || 'Visitor / Developer',
    rating: Number(data.rating) || 5,
    message: data.message || '',
    formattedDate,
    timestampMs,
    initials: data.initials || getInitials(data.name || 'A'),
    avatarColor: data.avatarColor || 'from-brand-violet to-brand-cyan',
    verified: Boolean(data.verified),
  };
};

/**
 * Real-time Reviews Listener via Firestore onSnapshot
 * Strictly queries ALL reviews ordered by createdAt descending (global visibility, no user ID filtering)
 */
export const subscribeToReviews = (callback, onError) => {
  if (db && isFirebaseConfigured) {
    try {
      const reviewsRef = collection(db, 'reviews');
      const q = query(reviewsRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const reviews = snapshot.docs.map(parseReviewDoc);
          callback(reviews);
        },
        (error) => {
          console.error('Firestore live reviews subscription failed:', error);
          if (onError) onError(error);
          callback(getLocalReviews());
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error('Failed to establish Firestore live listener:', err);
      if (onError) onError(err);
    }
  }

  // Fallback to local storage when Firebase is not configured in .env
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
 * Add a New Review to the database
 * Saves Name, Email, Message, Rating, and Server Timestamp
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

  if (db && isFirebaseConfigured) {
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

  // Local storage fallback for local testing without Firebase credentials
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
 * Real-time Global Likes Subscription via Firestore onSnapshot
 */
export const subscribeToLikes = (callback) => {
  if (db && isFirebaseConfigured) {
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
  if (db && isFirebaseConfigured) {
    try {
      const likesDocRef = doc(db, 'stats', 'likes');
      await setDoc(likesDocRef, { count: increment(1) }, { merge: true });
      return;
    } catch (err) {
      console.warn('Firestore increment likes error, falling back to local:', err);
    }
  }

  const current = Number(localStorage.getItem(LOCAL_STORAGE_LIKES_KEY)) || 0;
  const next = current + 1;
  localStorage.setItem(LOCAL_STORAGE_LIKES_KEY, String(next));
  window.dispatchEvent(new CustomEvent('portfolio-likes-updated'));
  return next;
};
