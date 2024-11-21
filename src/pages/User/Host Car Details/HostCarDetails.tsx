import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../../components/User/Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import { debounce } from "lodash";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import DatePicker from "react-datepicker";
import { CircleX } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface CarMakeTypeProps {
  _id:string;
  name:string;
}
interface CarDetailsProps{
  carMake:CarMakeTypeProps;
  carModel:string;
  rentAmount:string;
  seatCapacity:string;
  fuel:string;
  transmission:string;
  carType:CarMakeTypeProps;
  images:string[];
  registerNumber:string;
  insuranceExp:string;
  RCDoc:string;
  insuranceDoc:string;
  InsuranceDoc?:string;
}

interface RemovedImageProps {
  carImages?:string[];
  rcFile?:string;
  insuranceFile?:string;
}

const CarDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const navigate = useNavigate()
  const RcInputRef = useRef<HTMLInputElement>(null);
  const CarInputRef = useRef<HTMLInputElement>(null);
  const InsuranceInputRef = useRef<HTMLInputElement>(null);
  const [carDetails, setCarDetails] = useState<CarDetailsProps | null>(null);
  const [carMake, setCarMake] = useState<CarMakeTypeProps[]>([]);
  const [carType, setCarType] = useState<CarMakeTypeProps[]>([]);
  const [carId, setCarId] = useState("");
  const [selectedCarMake, setSelectedCarMake] = useState(
    carDetails?.carMake._id|| ''
  );
  const [carModel, setCarModel] = useState(carDetails?.carModel);
  const [rentAmount, setRentAmount] = useState(carDetails?.rentAmount);
  const [seatCapacity, setSeatCapacity] = useState(carDetails?.seatCapacity);
  const [fuel, setFuel] = useState(carDetails?.fuel);
  const [transmission, setTransmission] = useState(carDetails?.transmission);
  const [selectedCarType, setSelectedCarType] = useState(
    carDetails?.carType._id || ''
  );
  const [removedImages, setRemovedImages] = useState<RemovedImageProps | null>(null);
  const [carImages, setCarImages] = useState<string[]>(carDetails?.images || []);
  const [regNo, setRegNo] = useState(carDetails?.registerNumber);
  const [insuranceExp, setInsuranceExp] = useState(carDetails?.insuranceExp);
  const [changedInsuranceExpDate, setChangedInsuranceExpDate] =
    useState<Date|undefined>(undefined);
  const [rcDoc, setRcDoc] = useState(carDetails?.RCDoc);
  const [insuranceDoc, setInsuranceDoc] = useState(carDetails?.insuranceDoc);
  const [previews, setPreviews] = useState<string[]>([]);
  const [changedRC, setChangedRC] = useState(carDetails?.RCDoc);
  const [changedInsurance, setChangedInsurance] = useState(
    carDetails?.InsuranceDoc
  );

  const [carImage,setCarImage] = useState<File[]>([])
  const [rcImage,setRcImage] = useState<File>()
  const [insuranceImage,setInsuranceImage] = useState<File>()

  useEffect(() => {
    axiosInstance
      .get("/cardetails", {
        params: { id },
      })
      .then((res) => {
        if (res.data) {
          setCarDetails(res.data);
          setInsuranceExp(res.data.insuranceExp);
          setCarId(res.data._id);
          setCarImages(res.data.images);
          setRcDoc(res.data.RCDoc)
          setInsuranceDoc(res.data.insuranceDoc)
        }
      });

    axiosInstance.get("/getcarmake").then((res) => {
      if (res.data) {
        setCarMake(res.data);
      }
    });

    axiosInstance.get("/getcartype").then((res) => {
      if (res.data) {
        setCarType(res.data);
      }
    });
  }, [
    id,
    selectedCarMake,
    carModel,
    rentAmount,
    seatCapacity,
    fuel,
    transmission,
    selectedCarType,
  ]);

  const formData = new FormData();

  const removeCarPreview = (image: string, index: number, fileName: string) => {
    if (image === "existingimage") {
      setCarImages(carImages?.filter((_, ind) => ind !== index));
      setRemovedImages({...removedImages,carImages:[...(removedImages?.carImages || []),fileName]});
    } else {
      setPreviews(previews.filter((_, ind) => ind !== index));
    }
  };
  

  const handleCarImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const filesLimit = 5 - (carImages?.length) || 0;

    if(!files){
      return
    }

    if (files && files.length > filesLimit) {
      toast.error(`please add ${filesLimit} images!`);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const selectedFiles = Array.from(files).slice(0, filesLimit);
    

    const isValid = selectedFiles.every((file) =>
      allowedTypes.includes(file.type)
    );

    if (isValid) {
      const imagePreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews(imagePreviews);
      setCarImage(selectedFiles)
    } else {
      alert("only accepts image files!");
      event.target.value = "";
      return;
    }
  };

  const handleRcChange = () => {
    RcInputRef.current?.click();
  };

  const handleInsuranceChange = () => {
    InsuranceInputRef.current?.click();
  };

  const handleCarChange = () => {
    CarInputRef.current?.click();
  };

  const handleRCInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];
      if (allowedTypes.includes(file.type)) {
        const preview = URL.createObjectURL(file);
        setChangedRC(preview);
        setRcImage(file)
        setRemovedImages({...removedImages,rcFile:carDetails?.RCDoc})
      } else {
        alert("ventonly image files and pdf allowed!");
        event.target.value = "";
        return;
      }
    }
  };

  const handleInsuranceInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];
      if (allowedTypes.includes(file.type)) {
        const preview = URL.createObjectURL(file);
        setChangedInsurance(preview);
        setInsuranceImage(file)
        setRemovedImages({...removedImages,insuranceFile:carDetails?.InsuranceDoc})

      } else {
        alert("only image files and pdf allowed!");
        event.target.value = "";
        return;
      }
    }
  };

  const undoInsurance = () => {
    setChangedInsurance(carDetails?.insuranceDoc)
    
    if(removedImages){
      const updatedRemovedImages = {...removedImages}
      delete updatedRemovedImages.insuranceFile
      setRemovedImages(updatedRemovedImages)

    }
  }

  const undoRCImage = () => {
    setChangedRC(carDetails?.RCDoc)

    if(removedImages){
      const updatedRemovedImages = {...removedImages}
      delete updatedRemovedImages.rcFile
      setRemovedImages(updatedRemovedImages)
    }
  }

  const handleSave = () => {
    if (
      !selectedCarMake &&
      !carModel &&
      !rentAmount &&
      !seatCapacity &&
      !fuel &&
      !transmission &&
      !selectedCarType &&
      !previews.length &&
      !regNo &&
      !insuranceExp &&
      !rcDoc &&
      !insuranceDoc &&
      !changedRC &&
      !changedInsurance
    ) {
      toast.error("make any changes before submit!");
      return;
    }
    if (
      carDetails?.carMake._id === selectedCarMake ||
      carDetails?.carModel === carModel ||
      carDetails?.rentAmount === rentAmount ||
      carDetails?.seatCapacity === seatCapacity ||
      carDetails?.fuel === fuel ||
      carDetails?.transmission === transmission ||
      carDetails?.carType._id === selectedCarType ||
      carDetails?.registerNumber === regNo ||
      carDetails?.insuranceExp === changedInsuranceExpDate
    ) {
      toast.error("make any changes before submit!");
      return;
    }
    

    if (selectedCarMake) formData.append("make", selectedCarMake);
    if (carModel) formData.append("carModel", carModel);
    if (selectedCarType) formData.append("carType", selectedCarType);
    if (transmission) formData.append("transmission", transmission);
    if (fuel) formData.append("fuel", fuel);
    if (seatCapacity) formData.append("seatCapacity", seatCapacity);
    if (rentAmount) formData.append("rentAmount", rentAmount);
    if (regNo) formData.append("registerNumber", regNo);
    if (changedInsuranceExpDate)
      formData.append("insuranceExp", changedInsuranceExpDate.toISOString());
    if (carId) formData.append("carId", carId);
    if (carImage) carImage.forEach((file) => formData.append("images", file));
    if (rcImage) formData.append('RCDoc',rcImage)
    if (insuranceImage) formData.append('InsuranceDoc',insuranceImage)
      if(removedImages) formData.append('removedImages',JSON.stringify(removedImages))

    axiosInstance.put("/editcardetails", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(res=>{
      if(res.data){
        toast.success('Profile updated successfully!')
        setTimeout(() => {
          navigate('/')
        }, 5000);
      }
    })
  };

  const handleDebounce = debounce((date: Date | null) => {
    if(date) handleInsuranceExp(date);
  }, 2000);

  const handleInsuranceExp = (date: Date | undefined) => {
    if (!date) return;

    if (date < new Date()) {
      alert("Date must be future!");
      return;
    }

    setChangedInsuranceExpDate(date);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col userprofile items-center py-8 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl p-8 mt-20">
          <ToastContainer />
          <div className="flex justify-center items-center">
            <Tabs defaultValue="details" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="document">Documents</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="grid grid-cols-2 gap-6 mt-10">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="carMake"
                    >
                      Make<span className="text-red-500">*</span>
                    </label>

                    <select
                      className="w-full p-2 border rounded"
                      value={selectedCarMake}
                      onChange={(e) => setSelectedCarMake(e.target.value)}
                    >
                      <option value={carDetails?.carMake._id}>
                        {carDetails?.carMake.name}
                      </option>

                      {carMake.map(
                        (make, ind) =>
                          carDetails?.carMake._id !== make._id && (
                            <option key={ind} value={make._id}>
                              {make.name}
                            </option>
                          )
                      )}
                    </select>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="carModel"
                    >
                      Model<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="carModel"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder={carDetails?.carModel}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="year"
                    >
                      Type<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="options"
                      className="w-full p-2 border rounded"
                      value={selectedCarType}
                      onChange={(e) => setSelectedCarType(e.target.value)}
                      name="options"
                    >
                      <option value={carDetails?.carType._id}>
                        {carDetails?.carType.name}
                      </option>
                      {carType.map(
                        (type, ind) =>
                          carDetails?.carType._id !== type._id && (
                            <option key={ind} value={type._id}>
                              {type.name}
                            </option>
                          )
                      )}
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="year"
                    >
                      Transmission<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="options"
                      className="w-full p-2 border rounded"
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value)}
                      name="options"
                    >
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="fueltype"
                    >
                      Fuel Type<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="options"
                      className="w-full p-2 border rounded"
                      value={fuel}
                      onChange={(e) => setFuel(e.target.value)}
                      name="options"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="EV">EV</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="seatcapacity"
                    >
                      Seat Capacity<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="options"
                      value={seatCapacity}
                      onChange={(e) => setSeatCapacity(e.target.value)}
                      className="w-full p-2 border rounded"
                      name="options"
                    >
                      <option value="4-5 Seater">4-5 Seater</option>
                      <option value="6-7 Seater">6-7 Seater</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="rentamount"
                    >
                      Rent Amount<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="rentAmount"
                      value={rentAmount}
                      onChange={(e) => setRentAmount(e.target.value)}
                      className="w-full p-2 border rounded mb-2"
                      placeholder={carDetails?.rentAmount}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className={`px-2 py-2 bg-yellow-500 rounded text-white`}
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                </div>
              </TabsContent>
              <TabsContent value="document">
                <div className="mt-10">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="carimages"
                    >
                      Car Images<span className="text-red-500">*</span>
                    </label>
                  </div>
                  {carImages ? (
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {carImages?.map((img, ind) => (
                        <div className="relative inline-block mt-2">
                          <img
                            src={img}
                            key={ind}
                            className="w-26 h-14 sm:w-26 sm:h-14 md:w-32 md:h-20 mt-2 object-cover"
                          />
                          <CircleX
                            onClick={() =>
                              removeCarPreview("existingimage", ind, img)
                            }
                            className="absolute top-1 right-1 text-red-500 bg-white rounded-full p-1 cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {previews ? (
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {previews?.map((img, ind) => (
                        <div className="relative inline-block mt-2">
                          <img
                            src={img}
                            key={ind}
                            className="w-26 h-14 sm:w-26 sm:h-14 md:w-32 md:h-20 mt-2 object-cover"
                          />
                          <CircleX
                            onClick={() =>
                              removeCarPreview("newimage", ind, img)
                            }
                            className="absolute top-1 right-1 text-red-500 bg-white rounded-full p-1 cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {carImages?.length < 5 ? (
                    <div className="mt-4">
                      <input
                        type="file"
                        id="carimages"
                        className="hidden"
                        ref={CarInputRef}
                        multiple
                        onChange={handleCarImages}
                      />
                      <Button
                        className="bg-red-500 hover:bg-red-600"
                        onClick={handleCarChange}
                      >
                        Upload Image
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="grid grid-cols-2 gap-6 mt-10">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="regno"
                    >
                      Enter Reg.No<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="regno"
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder={carDetails?.registerNumber}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="insuranceexp"
                    >
                      Insurance Expiry<span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      selected={changedInsuranceExpDate}
                      onChange={(date: Date | null) => {
                        handleDebounce(date);
                      }}
                      dateFormat="dd/MM/yyyy"
                      className="w-full p-2 border rounded"
                      placeholderText={insuranceExp}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="rcdoc"
                    >
                      RC Document<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      id="rcdoc"
                      ref={RcInputRef}
                      onChange={handleRCInput}
                      className="hidden"
                      placeholder="KL 11 AX 0000"
                    />

                    {carDetails?.RCDoc ? (
                      <img
                        src={changedRC ? changedRC : carDetails?.RCDoc}
                        className="w-48 h-28"
                      />
                    ) : (
                      ""
                    )}
                    <div className="flex gap-4 mt-4">
                      <Button
                        className="bg-red-500 hover:bg-red-600"
                        onClick={handleRcChange}
                      >
                        Change
                      </Button>
                      {changedRC ? (
                        <Button
                          onClick={undoRCImage}
                          className="bg-yellow-500"
                        >
                          Undo
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="insurance"
                    >
                      Insurance<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      id="insurance"
                      ref={InsuranceInputRef}
                      onChange={handleInsuranceInput}
                      className="hidden"
                      placeholder="KL 11 AX 0000"
                    />

                    {carDetails?.InsuranceDoc ? (
                      <img
                        src={
                          changedInsurance
                            ? changedInsurance
                            : carDetails?.InsuranceDoc
                        }
                        className="w-48 h-28"
                      />
                    ) : (
                      ""
                    )}

                    <div className="flex gap-4 mt-4">
                      <Button
                        className="bg-red-500 hover:bg-red-600"
                        onClick={handleInsuranceChange}
                      >
                        Change
                      </Button>
                      {changedInsurance ? (
                        <Button
                          onClick={undoInsurance}
                          className="bg-yellow-500"
                        >
                          Undo
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className={`mt-10 px-2 py-2 bg-yellow-500 rounded text-white`}
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarDetails;
