import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import { db, storage } from "../Data/Firebase";
import "../Style/EditProfile.css";

const Type = [
  { id: "1", name: "Sculpture artist" },
  { id: "2", name: "Watercolor artist" },
  { id: "3", name: "Oil Painter artist" },
  { id: "4", name: "Pasteler artist" },
  { id: "5", name: "Abstracter artist" },
  { id: "4", name: "Pop artist" },
  { id: "4", name: "Realism artist" },
  { id: "4", name: "Portrait artist" },
  { id: "4", name: "Fresco artist" },
  { id: "4", name: "Expressionism artist" },
  { id: "4", name: "Acrylic artist" },
];

const initialState = {
  name: "",
  profImg: "",
  displayName: "",
  lastName: "",
  type: "",
};

const PostArtwork = () => {
  const { user } = useAuth();
  const [product, setProduct] = useState(initialState);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [getArtistsName, setGetArtistsName] = useState({
    displayName: "",
    lastName: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const uid = user.uid;
        if (uid) {
          try {
            const querySnapshot = await getDocs(
              query(
                collection(db, "artistHubUsers"),
                where("userID", "==", uid)
              )
            );
            if (!querySnapshot.empty) {
              querySnapshot.forEach((doc) => {
                setGetArtistsName({
                  displayName: doc.data().displayName,
                });
              });
            } else {
              console.log("No matching documents.");
            }
          } catch (error) {
            console.error("Error fetching artist's name:", error);
          }
        }
      };
      fetchData();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `artwork/${Date.now()}${file.name}`);
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
    const Hours = today.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const time = today.toLocaleDateString();
    try {
      const EditProfRef = doc(db, "artistHubUsers", user.uid);
      await setDoc(EditProfRef, {
        ...product,
        userID: user.uid,
        displayName: getArtistsName.displayName,
        hourJoined: Hours,
        createdAt: today,
        postTime: date,
        dateJoined: time,
      });
      setIsLoading(false);
      setUploadProgress(0);
      setProduct(initialState);
      toast.success("Product uploaded successfully.");
      navigate("/profile");
    } catch {
      setIsLoading(false);
      console.log("Error editing profile");
    }
  };

  return (
    <>
      <div className="editProfileContainer">
        <div className="addArtworkTextH1">
          <h1>Edit your profile</h1>
        </div>
        <form className=" " onSubmit={addProduct}>
          <div className="addPost_container">
            <div className="artInputs">
              <input
                type="file"
                accept="image/*"
                placeholder="Product Image"
                name="profImg"
                onChange={handleImageChange}
                className="image"
              />

              {product.profImg === "" ? null : (
                <input
                  type="text"
                  placeholder="Image URL"
                  name="profImg"
                  value={product.profImg}
                  disabled
                  style={{ display: "none" }}
                />
              )}

              <div className="AddPostInpCon">
                <div className="addPostInpCon1">
                  {/* <input
                    type="text"
                    placeholder="Full name"
                    value={product.displayName}
                    name="displayName"
                    onChange={handleInputChange}
                    className="input"
                  /> */}

                  <select
                    required
                    name="type"
                    value={product.type}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="" disabled>
                      {" "}
                      Type of Artist
                    </option>
                    {Type.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
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

export default PostArtwork;
