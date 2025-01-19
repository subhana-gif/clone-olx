import { initializeApp } from "firebase/app";
import { 
  createUserWithEmailAndPassword, 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup ,
  updateProfile
} from 'firebase/auth';
import { 
  addDoc, 
  collection, 
  getFirestore 
} from 'firebase/firestore';
import { toast } from "react-toastify";
import { getStorage   } from "firebase/storage";



const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const googleProvider = new GoogleAuthProvider();


  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Olx-clone");
    formData.append("folder", "Olx-products");
  
    const response = await fetch("https://api.cloudinary.com/v1_1/dckmi7m7y/image/upload", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error("Image upload failed");
    }
  
    const data = await response.json();
    return data.secure_url; 
  };

  

  const createProduct = async (productData, imageFile) => {
    try {
      const imageUrl = await uploadImageToCloudinary(imageFile);
      const productsRef = collection(db, "products");
      await addDoc(productsRef, {
        ...productData,
        imageUrl,
      });
      toast.success("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product: " + error.message);
    }
  };
  
  
  
  const signup = async (name, email, password, phone) => {
    try {
      console.log('From firebase =', "Name:", name, "Email:", email, "Password:", password, "Phone:", phone);
  
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const user = response.user;
  
      await updateProfile(user, { displayName: name });
  
      // Ensure that Firestore user data is added
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        phone,
        authProvider: "local",
        email,
      });
  
      console.log("Document added to Firestore");
      toast.success("Signup successful!");
      return user; // Return the user object
    } catch (error) {
      console.error("Error during signup:", error);
  
      const errorMessage = error.code
        ? error.code.split('/')[1].split('-').join(' ')
        : 'Unknown error';
  
      toast.error(errorMessage);
      throw error; // Re-throw the error for further handling if necessary
    }
  };

  
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
    const errorMessage = error.code.replace("auth/", "").replace(/-/g, " ");
    toast.error(`Error: ${errorMessage}`);
    throw new Error(errorMessage); 
    }
  };


  const signupWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      const usersRef = collection(db, 'user');
      const existingUser = await addDoc(usersRef, {
        uid: user.uid,
        name: user.displayName,
        authProvider: 'google',
        email: user.email,
      });
  
      if (!existingUser) {
        await addDoc(usersRef, {
          uid: user.uid,
          name: user.displayName,
          authProvider: 'google',
          email: user.email,
        });
      }
  
      toast.success("Google signup successful!");
    } catch (error) {
      console.log(error);
      toast.error(error.code.split('/')[1].split('-').join(' '));
    }
  };

  


const logout = () => {
  signOut(auth).then(() => {
    toast.success("Logged out successfully!");
  }).catch((error) => {
    console.log(error);
    toast.error("Error logging out");
  });
};


export {  auth, db, storage, googleProvider,  createProduct, signup, login, signupWithGoogle, logout };


