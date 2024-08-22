import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    Timestamp,
    where,
  } from "firebase/firestore";
  import {
    getDownloadURL,
    ref,
    uploadBytesResumable,
  } from "firebase/storage";
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { toast } from "react-toastify";
  import { CountryDropdown } from "react-country-region-selector";
  import { useAuth } from "../auth/AuthContext";
  import { auth, db, storage } from "../Data/Firebase";
  import "../Style/AddArtwork.css";
import { onAuthStateChanged } from "firebase/auth";
  
  const Style = [
    { id: "1", name: "Abstract" },
    { id: "2", name: "Architecture" },
    { id: "3", name: "Expressionist" },
    { id: "4", name: "Figurative" },
    { id: "5", name: "Geometric" },
    { id: "6", name: "Minimal" },
    { id: "7", name: "Nature" },
    { id: "8", name: "People" },
    { id: "9", name: "Still Life" },
    { id: "10", name: "Urban" },
  ];
  
  const Medium = [
    { id: "1", name: "Drawing" },
    { id: "2", name: "Mixed Media" },
    { id: "3", name: "Merchandise" },
    { id: "4", name: "NFT" },
    { id: "5", name: "Painting" },
    { id: "6", name: "Photography" },
    { id: "7", name: "Prints" },
    { id: "8", name: "Sculpture" },
  ];
  
  const Orientation = [
    { id: "1", name: "Landscape" },
    { id: "2", name: "Portrait" },
    { id: "3", name: "Square" },
  ];
  
  const Frame = [
    { id: "1", name: "Include" },
    { id: "1", name: "Not Include" },
  ];
  
  const Size = [
    { id: "1", name: "Small" },
    { id: "2", name: "Medium" },
    { id: "3", name: "Large" },
    { id: "4", name: "X-Large" },
  ];
  
  const Rarity = [
    { id: "1", name: "Unique" },
    { id: "2", name: "Limited Edition" },
    { id: "3", name: "Open Edition" },
    { id: "4", name: "Unknown Edition" },
  ];
  
  const initialState = {
    name: "",
    image: "",
    price: "",
    category: "",
    brand: "",
    desc: "",
    title: "",
    style: "",
    medium: "",
    location: "",
    color: "",
    orientation: "",
    time: "",
    size: "",
    frame: "",
    material: "",
    subscription: "",
    rarity: "",
    country: "",
    sign: "",
    year: "",
    specialfeature: "",
    certificate: "",
    artSize: "",
    shipfee: "",
    displayName: "",
    lastName: "",
  };
  
  const PostArtwork = () => {
    const { user } = useAuth();
  const [product, setProduct] = useState(initialState);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [getArtistsName, setGetArtistsName] = useState({ displayName: "", lastName: "" });
  const navigate = useNavigate();
 
useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const uid = user.uid;
        if (uid) {
          try {
            const querySnapshot = await getDocs(query(collection(db, "artistHubUsers"), where("userID", "==", uid)));
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
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        toast.error(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProduct({ ...product, image: downloadURL });
          toast.success("Image uploaded successfully.");
        });
      }
    );
  };

  
  const generateId = () => {
    return Math.random().toString(36).substring(6);
  };
  const addProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const inguireId = generateId()

    try {
      await addDoc(collection(db, "posts"), {
        ...product,
        price: Number(product.price),
        shipfee: Number(product.shipfee),
        userID: user.uid,
        createdAt: Timestamp.now().toDate(),
        displayName: getArtistsName.displayName,
        inguireId:inguireId,
       });
      setIsLoading(false);
      setUploadProgress(0);
      setProduct(initialState);
      toast.success("Product uploaded successfully.");
      navigate("/profile");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };


  
    return (
      <>
        <div className="postContainer">
          <div className="addArtworkTextH1">
            <h1>Add your artwork here.</h1>
          </div>
          <form className="addpostForm" onSubmit={addProduct}>
            <div className="addPost_container">
              <div className="artInputs">
                <input
                  type="file"
                  accept="image/*"
                  placeholder="Product Image"
                  name="image"
                  onChange={handleImageChange}
                  className="image"
                />
  
                {product.image === "" ? null : (
                  <input
                    type="text"
                    placeholder="Image URL"
                    name="image"
                    value={product.image}
                    disabled
                    style={{ display: "none" }}
                  />
                )}
  
                <div className="AddPostInpCon">
                  <div className="addPostInpCon1">
                    <input
                      type="text"
                      placeholder=" * Title of the artwork"
                      required
                      name="name"
                      value={product.name}
                      onChange={handleInputChange}
                      className="input"
                    />
                    <input
                      type="text"
                      placeholder=" * Year"
                      required
                      name="year"
                      value={product.year}
                      onChange={handleInputChange}
                      className="input"
                    />
                    <select
                      required
                      name="size"
                      value={product.size}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="" disabled>
                        {" "}
                        * Choose size
                      </option>
                      {Size.map((size) => (
                        <option key={size.id} value={size.name}>
                          {size.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder=" * Size ex: 39 × 31 in | 99.1 × 78.7 cm"
                      value={product.artSize}
                      name="artSize"
                      onChange={handleInputChange}
                      className="input"
                    />
                    <input
                      type="text"
                      placeholder=" * Material"
                      required
                      name="material"
                      value={product.material}
                      onChange={handleInputChange}
                      className="input"
                    />
                    <input
                      type="text"
                      placeholder="Special Features"
                      name="specialfeature"
                      value={product.specialfeature}
                      onChange={handleInputChange}
                      className="input"
                    />
                    <select
                      required
                      name="medium"
                      value={product.medium}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="" disabled>
                        {" "}
                        * Choose Medium
                      </option>
                      {Medium.map((medium) => (
                        <option key={medium.id} value={medium.name}>
                          {medium.name}
                        </option>
                      ))}
                    </select>
                    <select
                      required
                      name="rarity"
                      value={product.rarity}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="" disabled>
                        {" "}
                        * Choose Rarity
                      </option>
                      {Rarity.map((rarity) => (
                        <option key={rarity.id} value={rarity.name}>
                          {rarity.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="addPostInpCon2">
                    <input
                      type="number"
                      placeholder=" * Price ($USD)"
                      required
                      name="price"
                      value={product.price}
                      onChange={handleInputChange}
                      className="input"
                    />
                    <select
                      required
                      name="style"
                      value={product.style}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="" disabled>
                        {" "}
                        * Choose Style
                      </option>
                      {Style.map((style) => (
                        <option key={style.id} value={style.name}>
                          {style.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Signature"
                      name="sign"
                      value={product.sign}
                      onChange={handleInputChange}
                      className="input"
                    />
                    <select
                      required
                      name="frame"
                      value={product.frame}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="" disabled>
                        {" "}
                        * Frame
                      </option>
                      {Frame.map((frame) => (
                        <option key={frame.id} value={frame.name}>
                          {frame.name}
                        </option>
                      ))}
                    </select>
                    <CountryDropdown
                      className="shippingContInput"
                      valueType="short"
                      value={product.country}
                      onChange={(val) =>
                        handleInputChange({
                          target: {
                            name: "country",
                            value: val,
                          },
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder=" * Shipping fee ($USD)"
                      required
                      name="shipfee"
                      value={product.shipfee}
                      onChange={handleInputChange}
                      className="input"
                    />
                    <input
                      type="text"
                      placeholder="Certificate of authenticity"
                      name="certificate"
                      value={product.certificate}
                      onChange={handleInputChange}
                      className="input"
                    />
                    <textarea
                      placeholder="Description"
                      required
                      name="desc"
                      onChange={handleInputChange}
                      value={product.desc}
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
  