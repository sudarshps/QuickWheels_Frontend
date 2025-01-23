import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { debounce } from "lodash";
import { ToastContainer, toast } from "react-toastify";


type HostFormProps = {
  images: File[];
  registerNumber: string;
  insuranceExp: string;
  RCDoc: File | null;
  InsuranceDoc: File | null;
};

type updatedProps = HostFormProps & {
  updatedField: (fields: Partial<HostFormProps>) => void;
};

const CarDocuments: React.FC<updatedProps> = ({
  registerNumber,
  updatedField,
}) => {
  const [insuranceExpDate, setInsuranceExpDate] = useState<Date | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [rcPreviews, setRcPreviews] = useState<string>("");
  const [insurancePreviews, setInsurancePreviews] = useState<string>("");

  const handleCarImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const allowedTypes = ['image/jpeg','image/png','image/webp']

      const selectedFiles = Array.from(files).slice(0, 5);

      const isValid = selectedFiles.every(file=>allowedTypes.includes(file.type))

      if(isValid){
        const imagePreviews = selectedFiles.map((file) =>
          URL.createObjectURL(file) 
        );
        setPreviews(imagePreviews);
        updatedField({ images: selectedFiles });
      }else{
        toast.error('only accepts image files!')
        e.target.value = ''
        return
      }

     
    }
  };

  const handleDebounce = debounce((date:Date | null)=>{
    handleInsuranceExp(date)
  },2000)

  const handleInsuranceExp = (date:Date | null) => {
    if(!date) return 

    if(date<new Date()){
      toast.error('Date must be future!')
      return
    }

    setInsuranceExpDate(date)
  }

  const handleRcDocImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const allowedTypes = ['image/jpeg','image/png','image/webp','application/pdf']

      if(allowedTypes.includes(file.type)){
        const preview = URL.createObjectURL(file);
        setRcPreviews(preview);
        if(file){
          updatedField({ RCDoc: file as File});
        }
      }else{
        toast.error('only image files and pdf allowed!')
        e.target.value = ''
        return
      }
      
    }
  };

  const handleInsuranceDocImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const allowedTypes = ['image/jpeg','image/png','image/webp','application/pdf']

      if(allowedTypes.includes(file.type)){
      const preview = URL.createObjectURL(file);
      setInsurancePreviews(preview);

      updatedField({ InsuranceDoc: file });
    }else{
      toast.error('only image files and pdf allowed!')
      e.target.value = ''
      return
    }
  }
  };


  useEffect(() => {
    if (insuranceExpDate) {
      const formattedDate = insuranceExpDate.toLocaleDateString('en-GB')
      updatedField({ insuranceExp: formattedDate });
    }
  }, [insuranceExpDate]);

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
      <h1 className="text-2xl font-semibold mb-4">Provide Car Documents</h1>
      <div className="grid grid-cols-2 mt-10">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="carimages">
            Upload Car Images<span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="carimages"
            className="w-3/4 p-2 border rounded"
            multiple
            onChange={handleCarImages}
          />
        </div>

        {previews ? (
          <div className="flex">
            {previews.map((img, ind) => (
              <img src={img} key={ind} className="w-14 h-10 mt-2" />
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="grid grid-cols-2 gap-6 mt-10">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="regno">
            Enter Reg.No<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="regno"
            value={registerNumber}
            onChange={(e) => updatedField({ registerNumber: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="KL 11 AX 0000"
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
            selected={insuranceExpDate?new Date(insuranceExpDate):null}
            onChange={(date: Date | null) => {
              handleDebounce(date)
            }}
            dateFormat="dd/MM/yyyy"
            className="w-full p-2 border rounded"
          />
          
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="rcdoc">
            Upload RC Document<span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="rcdoc"
            onChange={handleRcDocImage}
            className="w-full p-2 border rounded"
            placeholder="KL 11 AX 0000"
          />

          {rcPreviews ? <img src={rcPreviews} className="w-22 h-16" /> : ""}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="insurance">
            Upload Insurance<span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="insurance"
            onChange={handleInsuranceDocImage}
            className="w-full p-2 border rounded"
            placeholder="KL 11 AX 0000"
          />

          {insurancePreviews ? (
            <img src={insurancePreviews} className="w-22 h-16" />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default CarDocuments;
