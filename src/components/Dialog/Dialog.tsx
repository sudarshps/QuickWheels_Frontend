import {
  Dialog as DialogMain,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { Input } from "../ui/input";

interface DialogFCProps {
  dialogOpen:boolean;
  dialogClose:()=>void;
  reason:(reasonInput:string)=>void;
}

const Dialog: React.FC<DialogFCProps> = ({ dialogOpen, dialogClose,reason }) => {
  const [reasonInput, setReasonInput] = useState("");  

  return (
    <DialogMain open={dialogOpen} onOpenChange={dialogClose}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejection Reason?</DialogTitle>
        </DialogHeader>
        <Input placeholder="Please Enter the reason for the rejection" value={reasonInput} onChange={(e)=>setReasonInput(e.target.value)}></Input>
        <div className="flex justify-end space-x-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={dialogClose}>
              Close
            </Button>
          </DialogClose>

          <Button type="button" variant="default" onClick={()=>reason(reasonInput)}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </DialogMain>
  );
};

export default Dialog;
