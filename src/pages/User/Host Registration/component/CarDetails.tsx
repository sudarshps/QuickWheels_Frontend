import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../api/axiosInstance";
import { ToastContainer, toast } from "react-toastify";


interface Feature {
  id: number;
  name: string;
}


type HostFormProps = {
  make:string,
  carType:string,
  carModel:string,
  transmission:string,
  fuel:string,
  seatCapacity:string,
  rentAmount:string,
  features:Feature[],
}

interface CarMakeTypeProps{
  _id:string;
  name:string;
}

type updatedProps = HostFormProps & {
  updatedField:(fields:Partial<HostFormProps>)=>void

}

const HostRegister: React.FC<updatedProps> = ({make,carModel,carType,transmission,fuel,seatCapacity,rentAmount,features,updatedField}) => {
  
  const[otherField,setOtherField] = useState(false)
  const[otherFeature,setOtherFeature] = useState('')
  const[tags,setTags] = useState<string[]>([])
  const[selectedFeatures, setSelectedFeatures] = useState<Feature[]>(features);
  const[carMake,setCarMake] = useState<CarMakeTypeProps[]>([])
  const[carTypeList,setCarTypeList] = useState<CarMakeTypeProps[]>([])

  const featureOptions: Feature[] = [
    { id: 1, name: "Air Conditioning" },
    { id: 2, name: "Sunroof" },
    { id: 3, name: "Leather Seats" },
    { id: 4, name: "Bluetooth" },
    { id: 5, name: "Backup Camera" },
    { id: 6, name: "Alloy Wheels" },
  ];


  const handleRentAmount = (amount:string) => {
    const numberRegex = /^\d+$/;

    setTimeout(() => {
      if(!numberRegex.test(amount)){
        toast.error('Amount must be a number!')
        return
      }
    }, 2000);
    

      updatedField({rentAmount:amount})
  }

  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setOtherFeature(value)

    if(value.includes(',')){
      const words = value.split(',').map((word) => word.trim()).filter((word)=>word.length>0)

      setTags((prevTags) => [...prevTags,...words])
      setOtherFeature('')


      const newFeatures = words.map((word, index) => ({
        id: featureOptions.length + index + 1,
        name: word,
      }));

      updatedField({ features: [...selectedFeatures, ...newFeatures] });
    }
  }


  const handleRemoveTag = (index: number) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };


  useEffect(()=>{
    setSelectedFeatures(features)
  },[features])

  useEffect(()=>{
    axiosInstance.get('/getcarmake')
    .then(res=>{
      setCarMake(res.data)
    })
  },[])

  useEffect(()=>{
    axiosInstance.get('/getcartype')
    .then(res=>{
      setCarTypeList(res.data)
    })
  },[])


  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const feature = featureOptions.find((f) => f.name === value);

    if (!feature) return; 

    let updatedFeatures: Feature[]
    if (checked) {
      updatedFeatures = [...selectedFeatures,feature]
    } else {
      updatedFeatures = selectedFeatures.filter((f)=>f.id !== feature.id)
    }

    setSelectedFeatures(updatedFeatures)
    updatedField({features:updatedFeatures})
  };




  return (
    <>
        <ToastContainer
                  position="top-right"
                  autoClose={2000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
          <h1 className="text-2xl font-semibold mb-4">Enter Car Details</h1>
          <div className="grid grid-cols-2 gap-6 mt-10">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="carMake"
              >
                Make<span className="text-red-500">*</span>
              </label>
              {/* <input
                type="text"
                id="carMake"
                value={make}
                onChange={e=>updatedField({make:e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Enter car make"
              /> */}
              <select className="w-full p-2 border rounded" value={make} onChange={e=>updatedField({make:e.target.value})}>
              <option value="">Select Make</option>

                {carMake.map((make,ind)=>(
                  <option key={ind} value={make._id}>{make.name}</option>
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
                onChange={e=>updatedField({carModel:e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Enter car model"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="year">
                Type<span className="text-red-500">*</span>
              </label>
              <select
                id="options"
                className="w-full p-2 border rounded"
                value={carType}
                onChange={e=>updatedField({carType:e.target.value})}
                name="options"
              >
                <option value="">Select Type</option>
                {carTypeList.map((type,ind)=>(
                  <option key={ind} value={type._id}>{type.name}</option>
                ))}
                
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="year">
                Transmission<span className="text-red-500">*</span>
              </label>
              <select
                id="options"
                className="w-full p-2 border rounded"
                value={transmission}
                onChange={e=>updatedField({transmission:e.target.value})}
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
                onChange={e=>updatedField({fuel:e.target.value})}
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
                onChange={e=>updatedField({seatCapacity:e.target.value})}
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
                onChange={e=>handleRentAmount(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter Rent Amount / hr"
              />

             
            </div>
          </div>
          <div className="mt-5">
            <h3 className="mb-5">Select Features:</h3>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {featureOptions.map((feature) => (
                <label
                  key={feature.id}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    value={feature.name}
                    checked={selectedFeatures.some((f) => f.id === feature.id)}
                    onChange={handleCheckboxChange}
                    style={{ marginRight: "10px" }}
                  />
                  {feature.name}
                </label>
              ))}
              <input type="checkbox" checked={tags.length>0?tags.length>0:otherField} onChange={(e)=>setOtherField(e.target.checked)}/>
              <label htmlFor="">Other</label>
              
            </div>
            {otherField?<div className="mt-5">
              <textarea
                value={otherFeature}
                onChange={handleTextArea}
                placeholder="Air Freshner,Navigation Screen"
                rows={3}
                className="border p-2 rounded w-full"
          />
        </div>:''}

        {tags?<div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-200 text-sm rounded px-2 py-1 mb-1"
          >
            <span className="mr-2">{tag}</span>
            <button
              onClick={() => handleRemoveTag(index)}
              className="text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </div>
        ))}
      </div>:''}
          </div>
    </>
  );
};

export default HostRegister;
