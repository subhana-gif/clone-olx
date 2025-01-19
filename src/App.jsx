import { useEffect, useContext, useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AuthContext, FirebaseContext } from "./store/Context";
import Post from "./store/PostContext";

const Signup = lazy(() => import("./Pages/Signup"));
const Login = lazy(() => import("./Pages/Login"));
const Create = lazy(() => import("./Pages/Create"));
const View = lazy(() => import("./Pages/ViewPost"));
const Home = lazy(() => import("./Pages/Home"));

function App() {
  const { user, setUser } = useContext(AuthContext);
  const { auth } = useContext(FirebaseContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth, setUser]);

  return (
    <div>
      <Post>
        <Router>
          {isLoading ? (
            <div className="loading">
              <img
                src="../../../Images/olx-logo.png"
                alt="Loading"
                className="loading-logo"
              />
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="loading">
                  <p>Loading...</p>
                </div>
              }
            >
              <Routes>
                {!user && <Route path="/login" element={<Login />} />}
                {!user && <Route path="/signup" element={<Signup />} />}

                {user && <Route path="/create" element={<Create />} />}
                {user && <Route path="/view" element={<View />} />}
                {!user && <Route path="/view" element={<Navigate to="/login" />} />}

                <Route path="/" element={<Home />} />

                {user && <Route path="/login" element={<Navigate to="/" />} />}
                {user && <Route path="/signup" element={<Navigate to="/" />} />}
                {!user && <Route path="/create" element={<Navigate to="/login" />} />}
              </Routes>
            </Suspense>
          )}
        </Router>
      </Post>
    </div>
  );
}

export default App;

