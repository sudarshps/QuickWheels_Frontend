import React, { useEffect, useState, useRef, useCallback } from "react";
import Navbar from "../../../components/User/Navbar/Navbar";
import "./Profile.css";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faUpload,
  faUser,
  faCircleXmark,
  faCircleCheck,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import axiosInstance from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../slices/authSlice";
import { debounce } from "lodash";
import { Tooltip } from "../../../components/Tooltip/Tooltip";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../../components/User/Footer/Footer";

interface Suggestion {
  address_line1: string;
  address_line2?: string;
  lon: number;
  lat: number;
}

interface SuggestionsResponse {
  results: Suggestion[];
}

const Profile: React.FC = () => {
  const [name, setName] = useState<string | null>("");
  const [dob, setDob] = useState<Date | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState<string | null>("");
  const [address, setAddress] = useState("");
  const [drivingId, setDrivingId] = useState("");
  const [drivingIdExp, setDrivingIdExp] = useState<Date | null>(null);
  const [previewFront, setPreviewFront] = useState<string | null>(null);
  const [previewBack, setPreviewBack] = useState<string | null>(null);
  const [drivingFront, setDrivingFront] = useState<File | null>(null);
  const [drivingBack, setDrivingBack] = useState<File | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);

  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<SuggestionsResponse>();
  const [hideAddressList, setHideAddressList] = useState(false);

  const navigate = useNavigate();

  const userName = useSelector((state: RootState) => state.auth.user);
  const userEmail = useSelector((state: RootState) => state.auth.email);
  const profileUpdated = useSelector(
    (state: RootState) => state.userDetails.profileUpdated
  );
  const status = useSelector((state: RootState) => state.userDetails.status);

  const userDob = useSelector((state: RootState) => state.userDetails.dob);
  const userPhone = useSelector((state: RootState) => state.userDetails.phone);
  const userAddress = useSelector(
    (state: RootState) => state.userDetails.address
  );
  const userDrivingId = useSelector(
    (state: RootState) => state.userDetails.drivingID
  );
  const userDrivingIdExp = useSelector(
    (state: RootState) => state.userDetails.drivingExpDate
  );
  const drivingPhotoFront = useSelector(
    (state: RootState) => state.userDetails.drivingIDFront
  );
  const drivingPhotoBack = useSelector(
    (state: RootState) => state.userDetails.drivingIDBack
  );

  const note = useSelector((state: RootState) => state.userDetails.note);

  const dispatch = useDispatch();

  const handleDebounce = debounce((date: Date | null, dateField) => {
    if (dateField === "dob") {
      handleDob(date);
    } else {
      handleExpiryDate(date);
    }
  }, 2000);

  const handleExpiryDate = (date: Date | null) => {
    if (!date) return;

    if (date < new Date()) {
      toast.error("Date must be future!");
      return;
    }

    setDrivingIdExp(date);
  };

  const handleAddress = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const address = e.target.value;
    setAddress(address);
    addressAutoComplete(address);
  };

  const handleAddressSelection = (
    address: string,
    lon: number,
    lat: number
  ) => {
    setAddress(address);
    setLongitude(lon);
    setLatitude(lat);
    setHideAddressList(false);
  };

  const addressAutoComplete = useCallback(
    debounce((address: string) => {
      fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${address}&format=json&apiKey=${
          import.meta.env.VITE_LOCATION_API
        }`
      )
        .then((response) => response.json())
        .then((result) => {
          setHideAddressList(true);
          setSuggestions(result);
          console.log(result);
        })
        .catch((error) => console.log("error", error));
    }, 2000),
    []
  );

  const handleDob = (date: Date | null) => {
    if (!date) return;

    const today = new Date();
    const birthDate = new Date(date);

    if (birthDate > today) {
      toast.error("please select correct date!");
      return;
    }

    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      age < 18 ||
      (age === 18 && monthDifference < 0) ||
      (age === 18 &&
        monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      toast.error("You must be 18 years or older!");
      return;
    }

    setDob(date);
  };

  const fileFrontInputRef = useRef<HTMLInputElement | null>(null);
  const fileBackInputRef = useRef<HTMLInputElement | null>(null);
  const objectURLFront = useRef<string | null>(null);
  const objectURLBack = useRef<string | null>(null);

  const frontButton = () => {
    if (fileFrontInputRef.current) {
      fileFrontInputRef.current.click();
    }
  };

  const backButton = () => {
    if (fileBackInputRef.current) {
      fileBackInputRef.current.click();
    }
  };

  const handleFrontImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

      if (allowedTypes.includes(file.type)) {
        setDrivingFront(file);
        if (objectURLFront.current) {
          URL.revokeObjectURL(objectURLFront.current);
        }
        const newObjectURL = URL.createObjectURL(file);
        objectURLFront.current = newObjectURL;
        setPreviewFront(URL.createObjectURL(file));
      } else {
        toast.error("Accepted only image file (JPEG/PNG) or PDF");
      }
    }
  };

  const handleBackImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

      if (allowedTypes.includes(file.type)) {
        setDrivingBack(file);
        if (objectURLBack.current) {
          URL.revokeObjectURL(objectURLBack.current);
        }
        const newObjectURL = URL.createObjectURL(file);
        objectURLBack.current = newObjectURL;
        setPreviewBack(newObjectURL);
      } else {
        toast.error("Accepted only image file (JPEG/PNG) or PDF");
      }
    }
  };

  const handleProfileEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (
      !dob &&
      !phone.trim() &&
      !address.trim() &&
      !drivingId.trim() &&
      !drivingIdExp &&
      !drivingBack &&
      !drivingFront
    ) {
      toast.error("Please make sure that you've changed details!");
      return;
    }

    const formData = new FormData();

    if (userEmail) formData.append('email',userEmail)
    if (dob) formData.append("dob", dob.toISOString().split("T")[0]);
    if (phone.trim()) formData.append("phone", phone.trim());
    if (address.trim()) formData.append("address", address.trim());
    if (drivingId.trim()) formData.append("drivingID", drivingId.trim());
    if (drivingIdExp)
      formData.append(
        "drivingExpDate",
        drivingIdExp.toISOString().split("T")[0]
      );
    if (drivingFront){
      formData.append("drivingIDFront", drivingFront);
      if(drivingPhotoFront) formData.append("existingFrontID",drivingPhotoFront)
    } 
    if (drivingBack){
      formData.append("drivingIDBack", drivingBack);
      if(drivingPhotoBack) formData.append("existingBackID",drivingPhotoBack)
    }

    try {
      const response = await axiosInstance.put('/edituserprofile',formData)

      if(response.data){
        toast.success("Profile Updated!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.error('error while editing user profile',error);
    }

  };

  const handleProfileSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!dob) {
      toast.error("Provide your DOB!");
      return;
    }

    if (!phone.trim()) {
      toast.error("Provide phone number");
      return;
    }

    const phoneRegex = /^[+]?[\d\s-]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Provide valid phone number");

      return;
    }

    if (!address.trim()) {
      toast.error("please provide address");
      return;
    }

    if (!drivingId.trim()) {
      toast.error("please provide driving licence id");
      return;
    }

    if (!drivingIdExp) {
      toast.error("Please provide driving exp date!");
      return;
    }

    if (!drivingFront || !drivingBack) {
      toast.error("please upload driving licence front and back images!");
      return;
    }

    const formData = new FormData();

    const userInfo = {
      email,
      dob: dob.toISOString().split("T")[0],
      phone,
      address,
      longitude,
      latitude,
      drivingID: drivingId,
      drivingExpDate: drivingIdExp.toISOString().split("T")[0],
      drivingIDFront: drivingFront,
      drivingIDBack: drivingBack,
    };

    Object.entries(userInfo).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if(value!==null){
        formData.append(key, value.toString());
      }
    });

    try {
      await axiosInstance.post("/userprofile", formData).then((res) => {
        if (res.data.userUpdated) {
          const profileUpdated = res.data.profileUpdated;
          const email = res.data.email;
          const userName = res.data.userName;
          const isHost = res.data.isHost;
          const role = res.data.role;
          toast.success("Profile Updated!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          dispatch(setCredentials({ userName, email, isHost, profileUpdated,role }));
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      });
    } catch (error) {
      console.error("error on uploading userprofile data", error);
    }
  };

  useEffect(() => {
    setName(userName);
    setEmail(userEmail);
  }, [userName, userEmail]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col userprofile items-center py-8 bg-gray-50 min-h-screen">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <div className="bg-white shadow-lg rounded-lg w-full max-w-5xl p-8 mt-20">
          {/* <div className="flex"> */}
          <div>
            <div className="flex items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex justify-center items-center relative">
                <FontAwesomeIcon icon={faUser} className="text-3xl" />
                <button className="absolute bottom-0 right-0 p-1 bg-white border rounded-full">
                  <span role="img" aria-label="edit">
                    <FontAwesomeIcon icon={faEdit} />
                  </span>
                </button>
              </div>
              <h2 className="ml-4 text-2xl font-bold text-gray-800">{name}</h2>

              <div className="md:ml-auto ml-10">
                <span className="text-sm font-semibold">
                  {status === "Verification Pending" ? (
                    <div className="text-gray-500">
                      <FontAwesomeIcon icon={faClock} />
                      {status}
                    </div>
                  ) : status === "Verified" ? (
                    <div className="text-green-500">
                      <FontAwesomeIcon icon={faCircleCheck} />
                      {status}
                    </div>
                  ) : (
                    <Tooltip
                      content={note?note:''}
                      elements={
                        <div className="text-red-500">
                          <FontAwesomeIcon icon={faCircleXmark} />
                          {status}
                        </div>
                      }
                    />
                  )}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                className="border p-2 rounded"
                type="text"
                value={name?name:''}
                placeholder={name ? name : ""}
                disabled
              />
              <br />
              <DatePicker
                dateFormat="dd-MM-yyyy"
                placeholderText={profileUpdated && userDob ? userDob : "DOB"}
                selected={profileUpdated && !onEdit ? userDob?new Date(userDob):null : dob}
                disabled={profileUpdated && !onEdit ? true : false}
                onChange={(date: Date | null) => handleDebounce(date, "dob")}
                className="border p-2 rounded z-auto relative w-full"
              />
              <input
                className="border p-2 rounded"
                type="tel"
                placeholder={profileUpdated && userPhone ? userPhone : "Phone Number"}
                value={profileUpdated && !onEdit && userPhone ? userPhone : phone}
                disabled={profileUpdated && !onEdit ? true : false}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                className="border p-2 rounded col-span-2"
                type="email"
                value={email?email:''}
                placeholder={email ? email : ""}
                disabled
              />
              <textarea
                className="border p-2 rounded col-span-2"
                placeholder={profileUpdated && userAddress ? userAddress : "Address"}
                disabled={profileUpdated && !onEdit ? true : false}
                value={profileUpdated && !onEdit && userAddress ? userAddress : address}
                onChange={handleAddress}
              ></textarea>

              {hideAddressList &&
                suggestions?.results &&
                suggestions.results.length > 0 && (
                  <ul className="border border-gray-300 mt-1 rounded bg-white">
                    {suggestions.results.map((suggestion, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() =>
                          handleAddressSelection(
                            `${suggestion.address_line1} ${suggestion.address_line2}`,
                            suggestion.lon,
                            suggestion.lat
                          )
                        }
                      >
                        {suggestion.address_line1}{" "}
                        <span className="text-gray-500">
                          {suggestion.address_line2}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-lg text-gray-800">
                Driving ID Information
              </h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  className="border p-2 rounded"
                  type="text"
                  placeholder={
                    profileUpdated && userDrivingId ? userDrivingId : "Driving Licence No."
                  }
                  value={profileUpdated && !onEdit && userDrivingId ? userDrivingId : drivingId}
                  disabled={profileUpdated && !onEdit ? true : false}
                  onChange={(e) => setDrivingId(e.target.value)}
                />
                <DatePicker
                  dateFormat="dd-MM-yyyy"
                  placeholderText={
                    profileUpdated && userDrivingIdExp ? userDrivingIdExp : "Expiry Date"
                  }
                  selected={
                    profileUpdated && !onEdit && userDrivingIdExp ? new Date(userDrivingIdExp) : drivingIdExp
                  }
                  disabled={profileUpdated && !onEdit ? true : false}
                  onChange={(date: Date | null) =>
                    handleDebounce(date, "expiryDate")
                  }
                  className="border p-2 rounded z-auto relative w-full"
                />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-lg text-gray-800">
                Upload Driving ID Photo
              </h3>
              {!profileUpdated ? (
                <div className="flex space-x-4 mt-4">
                  {previewFront ? (
                    <button
                      className="flex-1 border-dashed border-2 border-gray-400 p-4 rounded text-center relative overflow-hidden"
                      onClick={frontButton}
                    >
                      <input
                        type="file"
                        style={{ display: "none" }}
                        ref={fileFrontInputRef}
                        onChange={handleFrontImage}
                      />
                      <img
                        src={previewFront}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ) : (
                    <button
                      className="flex-1 border-dashed border-2 border-gray-400 p-4 rounded text-center"
                      onClick={frontButton}
                    >
                      <input
                        type="file"
                        style={{ display: "none" }}
                        ref={fileFrontInputRef}
                        onChange={handleFrontImage}
                      />
                      <span role="img" aria-label="upload">
                        <FontAwesomeIcon icon={faUpload} />
                      </span>
                      <p>Front</p>
                    </button>
                  )}

                  {previewBack ? (
                    <button
                      className="flex-1 border-dashed border-2 border-gray-400 p-4 rounded text-center relative overflow-hidden"
                      onClick={backButton}
                    >
                      <input
                        type="file"
                        style={{ display: "none" }}
                        ref={fileBackInputRef}
                        onChange={handleBackImage}
                      />
                      <img
                        src={previewBack}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ) : (
                    <button
                      className="flex-1 border-dashed border-2 border-gray-400 p-4 rounded text-center"
                      onClick={backButton}
                    >
                      <input
                        type="file"
                        style={{ display: "none" }}
                        ref={fileBackInputRef}
                        onChange={handleBackImage}
                      />
                      <span role="img" aria-label="upload">
                        <FontAwesomeIcon icon={faUpload} />
                      </span>
                      <p>Back</p>
                    </button>
                  )}
                </div>
              ) : profileUpdated && onEdit ? (
                <div className="flex space-x-4 mt-4">
                  <button
                    className="flex-1 border-dashed border-2 border-gray-400 p-4 rounded text-center relative overflow-hidden"
                    onClick={frontButton}
                  >
                    <input
                      type="file"
                      style={{ display: "none" }}
                      ref={fileFrontInputRef}
                      onChange={handleFrontImage}
                    />
                    <img
                      src={previewFront ? previewFront :drivingPhotoFront? drivingPhotoFront : ''}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </button>

                  <button
                    className="flex-1 border-dashed border-2 border-gray-400 p-4 rounded text-center relative overflow-hidden"
                    onClick={backButton}
                  >
                    <input
                      type="file"
                      style={{ display: "none" }}
                      ref={fileBackInputRef}
                      onChange={handleBackImage}
                    />
                    <img
                      src={previewBack ? previewBack : drivingPhotoBack? drivingPhotoBack:''}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </button>
                </div>
              ) : (
                <div className="flex space-x-4 mt-4">
                  <button className="flex-1 border-dashed border-2 border-gray-400 p-4 rounded text-center relative overflow-hidden">
                    <img
                      src={`${drivingPhotoFront}`}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </button>

                  <button className="flex-1 border-dashed border-2 border-gray-400 p-4 rounded text-center relative overflow-hidden">
                    <img
                      src={`${drivingPhotoBack}`}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              {!profileUpdated ? (
                <button
                  className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600"
                  onClick={handleProfileSave}
                >
                  SAVE
                </button>
              ) : profileUpdated && onEdit ? (
                <div className="flex gap-4">
                  <button
                    className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600"
                    onClick={handleProfileEdit}
                  >
                    SAVE CHANGES
                  </button>

                  <button
                    className="bg-orange-500 text-white px-6 py-2 rounded shadow hover:bg-orange-600"
                    onClick={() => setOnEdit((prev) => !prev)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600"
                  onClick={() => setOnEdit(true)}
                >
                  EDIT
                </button>
              )}
            </div>
          </div>
          {/* </div> */}
        </div>
        <Footer/>

      </div>
    </>
  );
};

export default Profile;
