import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../components/ui/tooltip"
import { SliderComponent } from "./Slider"

export function TooltipDemo({onDistanceChange}:{onDistanceChange:(value:number[]) => void }) {
    const [distance,setDistance] = useState([0])

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
            <div>
            <SliderComponent onValueChange={(value) => {
                setDistance(value)
                onDistanceChange(value)}}/>
            </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{distance}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
