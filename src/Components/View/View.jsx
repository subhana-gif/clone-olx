import { useContext, useState, useEffect } from "react";
import { PostContext } from "../../store/PostContext";
import { collection, query, where, getDocs } from "firebase/firestore"; // Firestore functions
import "./View.css";
import { FirebaseContext } from "../../store/Context";

function View() {
  const { db } = useContext(FirebaseContext);
  const [userDetails, setUserDetails] = useState(null);
  const { postDetails } = useContext(PostContext);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (postDetails?.userId) {
        try {
          const usersRef = collection(db, "user");
          const q = query(usersRef, where("uid", "==", postDetails.userId));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            setUserDetails(doc.data());
          });
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, [postDetails]);

  return (
    <div className="viewParentDiv">
      <div className="viewImageShowDiv">
        <img src={postDetails.imageUrl} alt="Post" />
      </div>
      <div className="viewRightSection">
        <div className="viewProductDetails">
          <p>&#x20B9; {postDetails.price}</p>
          <span>{postDetails.name}</span>
          <p>{postDetails.category}</p>
          <span>{postDetails.createdAt}</span>
        </div>
        {userDetails ? (
          <div className="viewContactDetails">
            <p>Seller details</p>
            <p>{userDetails.name}</p>
            <p>{userDetails.phone}</p>
          </div>
        ) : (<div className="viewContactDetails">
        <p>Seller details</p>
        <p>Seller Name</p>
        <p>Seller Phone number</p>
      </div>
    ) }
      </div>
    </div>
  );
}

export default View;
