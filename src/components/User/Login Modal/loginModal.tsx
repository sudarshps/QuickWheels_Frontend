import React, {ReactNode, useEffect,useState } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (otp: string) => void;
    onResend: () => void;
    invalidMessage:string;
    children:ReactNode
  }

const Modal: React.FC<ModalProps> = ({ isOpen, onClose,onVerify,onResend,invalidMessage,children}) => {

    const [otp, setOtp] = useState<string>("");
  const [timer, setTimer] = useState<number>(120); // 120 seconds timer
  const [resendEnabled, setResendEnabled] = useState<boolean>(false);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            setResendEnabled(true);
            clearInterval(interval);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);
  if (!isOpen) return null;


  const handleResend = () => {
    onResend()
    setTimer(120)
    setResendEnabled(false)
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(2px)",
          zIndex: 1000, 
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position:'relative',
            background: "white",
            padding: "2%",
            border: "2px solid #000",
            borderRadius: "10px",
            boxShadow: "2px solid black",
            zIndex: 1001, 
          }}
          onClick={(e) => e.stopPropagation()} 
        >

<button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "transparent",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              color: "#000",
            }}
          >
            &times; 
          </button>


          <h1>Verify OTP</h1>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={() => onVerify(otp)}
            style={{
              marginTop: "16px",
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Verify
          </button>

          {invalidMessage && <p className="error-message text-red-500">{invalidMessage}</p>}

          <div style={{ marginTop: "16px" }}>
            {timer > 0 ? (
              <span>{`Time remaining: ${timer} seconds`}</span>
            ) : (
              <span>OTP expired</span>
            )}
          </div>

          <button
            onClick={handleResend}
            disabled={!resendEnabled}
            style={{
              marginTop: "16px",
              padding: "8px 16px",
              backgroundColor: resendEnabled ? "#28a745" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: resendEnabled ? "pointer" : "not-allowed",
            }}
          >
            Resend OTP
          </button>
          {children}
            
        </div>
      </div>
    </>
  );
};

export default Modal;
