import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CountryDropdown } from "react-country-region-selector";
import { useAuth } from "../auth/AuthContext";
import { auth, db, storage } from "../Data/Firebase";
import "../Style/AddArtwork.css";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

const Type = [
  { id: "1", name: "Sculpture artist" },
  { id: "2", name: "Watercolor artist" },
  { id: "3", name: "Oil Painter artist" },
  { id: "4", name: "Pasteler artist" },
  { id: "5", name: "Abstracter artist" },
  { id: "6", name: "Pop artist" },
  { id: "7", name: "Realism artist" },
  { id: "8", name: "Portrait artist" },
  { id: "9", name: "Fresco artist" },
  { id: "10", name: "Expressionism artist" },
  { id: "11", name: "Acrylic artist" },
];

const initialState = {
  name: "",
  profImg: "",
  displayName: "",
  type: "",
  bio: "",
  artitsArtwork: "",
};

const EditProfile = () => {
  const { user } = useAuth();
  const [product, setProduct] = useState(initialState);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [artitsArtwork, setImage] = useState(null);
  const [cropper, setCropper] = useState();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const getCropData = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        const file = new File([blob], `croppedImage_${Date.now()}.png`, {
          type: "image/png",
        });
        handleFileUpload(file);
      });
    }
  };

  const handleFileUpload = (file) => {
    const storageRef = ref(storage, `profileimages/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        toast.error(error.message);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setProduct((prevProduct) => ({
          ...prevProduct,
          artitsArtwork: downloadURL,
        }));
        toast.success("Image uploaded successfully.");
      }
    );
  };




  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    // console.log(file);
    const storageRef = ref(storage, `profileimages/${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        toast.error(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProduct({ ...product, profImg: downloadURL });
          toast.success("Image uploaded successfully.");
        });
      }
    );
  };



  const addProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const today = new Date();
    const date = today.toDateString();
    const hours = today.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const time = today.toLocaleDateString();

    try {
      const EditProfRef = doc(db, "artistHubUsers", user.uid);
      await setDoc(EditProfRef, {
        ...product,
        userID: user.uid,
        hourJoined: hours,
        createdAt: today,
        postTime: date,
        dateJoined: time,
      });
      setIsLoading(false);
      setUploadProgress(0);
      setProduct(initialState);
      toast.success("Profile updated successfully.");
      navigate("/profile");
    } catch (error) {
      setIsLoading(false);
      console.error("Error editing profile:", error);
    }
  };

  return (
    <>
      <div className="postContainer">
        <div className="addArtworkTextH1">
          <h1>Edit your profile</h1>
        </div>
        <form className="addpostForm" onSubmit={addProduct}>
          <div className="addPost_container">
             <div className="artInputs">
            <h2>Artist artwork</h2>

              <input
                type="file"
                accept="image/*"
                placeholder="Product Image"
                name="image"
                onChange={handleImageChange}
                className="image"
              />
              {artitsArtwork && (
                <div>
                  <Cropper
                    style={{ height: 400, width: "100%" }}
                    initialAspectRatio={1}
                    src={artitsArtwork}
                    viewMode={1}
                    guides={true}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={true}
                    autoCropArea={1}
                    checkOrientation={false}
                    onInitialized={(instance) => {
                      setCropper(instance);
                    }}
                  />
                  <button type="button" onClick={getCropData}>
                    Crop
                  </button>
                </div>
              )}

              <h2>Profile image</h2>

              <input
                type="file"
                accept="image/*"
                placeholder="Product Image"
                name="image"
                onChange={handleProfileImageChange}
                className="image"
              />


              {product.artitsArtwork === "" ? null : (
                <input
                  type="text"
                  // required
                  placeholder="Image URL"
                  name="image"
                  value={product.image}
                  disabled
                  style={{display:'none'}}
                />
              )}

              
              <div className="AddPostInpCon">
                <div className="addPostInpCon1">
                  <input
                    type="text"
                    placeholder="Full name"
                    required
                    name="displayName"
                    value={product.year}
                    onChange={(e) => handleInputChange(e)}
                    className="input"
                  />

                  <select
                    required
                    name="medium"
                    value={product.medium}
                    onChange={(e) => handleInputChange(e)}
                    className="input"
                  >
                    <option value="" disabled>
                      {" "}
                      Artist type
                    </option>
                    {Type.map((type) => {
                      return (
                        <option key={type.id} value={type.name}>
                          {type.name}
                        </option>
                      );
                    })}
                  </select>

                  <textarea
                    placeholder="Bio"
                    required
                    name="bio"
                    onChange={handleInputChange}
                    value={product.bio}
                    className="input"
                  ></textarea>
                </div>
                <div className="addPostInpCon2">{/* Other inputs */}</div>
              </div>
              <div className="submit">
                <button className="submitButton" disabled={isLoading}>
                  <h1>Submit</h1>
                </button>
                <p>{uploadProgress}% done</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
