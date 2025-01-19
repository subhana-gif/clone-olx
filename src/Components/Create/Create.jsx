import { Fragment, useContext, useState } from "react";
import "./Create.css";
import { useNavigate } from "react-router-dom";
import { FirebaseContext, AuthContext } from "../../store/Context";

const Create = () => {
  const { createProduct } = useContext(FirebaseContext);
  const { user } = useContext(AuthContext);
  const [fname, setFname] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const date = new Date();

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const validateFields = () => {
    const validationErrors = {};

    if (!fname.trim()) {
      validationErrors.fname = "Name is required.";
    }

    if (!category.trim()) {
      validationErrors.category = "Category is required.";
    }

    if (!price.trim()) {
      validationErrors.price = "Price is required.";
    } else if (isNaN(price) || Number(price) <= 0) {
      validationErrors.price = "Price must be a positive number.";
    }

    if (!image) {
      validationErrors.image = "Please select an image.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0; 
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      console.error("Validation failed");
      return;
    }
  
    const productData = {
      name: fname,
      category,
      price,
      userId: user.uid,
      createdAt: date.toDateString(),
    };
  
    console.log("Submitting product data:", productData);
  
    try {
      await createProduct(productData, image);
      console.log("Product created successfully");
      navigate("/");
    } catch (error) {
      console.error("Error uploading the product:", error);
      setErrors({ form: "Error uploading the product. Please try again." });
    }
  };
  
  return (
    <Fragment>
      <div className="create-container">
        <h3 className="create-title">Add a Selling Item</h3>

        <label htmlFor="create-name" className="create-label">Name</label>
        <input
          className={`create-input ${errors.fname ? "create-input-error" : ""}`}
          type="text"
          id="create-name"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
        />
        {errors.fname && <div className="create-error-message">{errors.fname}</div>}

        <label htmlFor="create-category" className="create-label">Category</label>
        <input
          className={`create-input ${errors.category ? "create-input-error" : ""}`}
          type="text"
          id="create-category"
          value={category}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (!/\d/.test(inputValue)) {
              setCategory(inputValue);
            }
          }}
        />
        {errors.category && <div className="create-error-message">{errors.category}</div>}

        <label htmlFor="create-price" className="create-label">Price</label>
        <input
          className={`create-input ${errors.price ? "create-input-error" : ""}`}
          type="number"
          id="create-price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {errors.price && <div className="create-error-message">{errors.price}</div>}

        <label htmlFor="create-image" className="create-label">Image</label>
        <input
          className={`create-input ${errors.image ? "create-input-error" : ""}`}
          type="file"
          id="create-image"
          accept="image/*"
          onChange={handleImageChange}
        />
        {errors.image && <div className="create-error-message">{errors.image}</div>}

        {image && (
          <div className="create-image-preview">
            <img
              src={URL.createObjectURL(image)}
              alt="Selected"
              className="create-preview-image"
            />
          </div>
        )}
        {!image && <div className="create-thumbnail-placeholder">No image selected</div>}

        {errors.form && <div className="create-error-message create-form-error">{errors.form}</div>}

        <button onClick={handleSubmit} className="create-upload-btn">Upload and Submit</button>
      </div>
    </Fragment>
  );
};

export default Create;
