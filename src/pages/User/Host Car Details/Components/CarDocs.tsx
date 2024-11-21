import React from 'react'

const CarDocs:React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-2 mt-10">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="carimages"
                    >
                      Upload Car Images<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      id="carimages"
                      className="w-3/4 p-2 border rounded"
                      multiple
                      // onChange={handleCarImages}
                    />
                  </div>

                  {/* {previews ? (
          <div className="flex">
            {previews.map((img, ind) => (
              <img src={img} key={ind} className="w-14 h-10 mt-2" />
            ))}
          </div>
        ) : (
          ""
        )} */}
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
                      // value={registerNumber}
                      // onChange={(e) => updatedField({ registerNumber: e.target.value })}
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
                    {/* <DatePicker
            selected={insuranceExpDate?new Date(insuranceExpDate):null}
            onChange={(date: Date | null) => {
              handleDebounce(date)
            }}
            dateFormat="dd/MM/yyyy"
            className="w-full p-2 border rounded"
          /> */}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="rcdoc"
                    >
                      Upload RC Document<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      id="rcdoc"
                      // onChange={handleRcDocImage}
                      className="w-full p-2 border rounded"
                      placeholder="KL 11 AX 0000"
                    />

                    {/* {rcPreviews ? <img src={rcPreviews} className="w-22 h-16" /> : ""} */}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="insurance"
                    >
                      Upload Insurance<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      id="insurance"
                      // onChange={handleInsuranceDocImage}
                      className="w-full p-2 border rounded"
                      placeholder="KL 11 AX 0000"
                    />

                    {/* {insurancePreviews ? (
            <img src={insurancePreviews} className="w-22 h-16" />
          ) : (
            ""
          )} */}
                  </div>
                </div>
    </>
  )
}

export default CarDocs
