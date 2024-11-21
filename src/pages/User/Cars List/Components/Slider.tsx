import { cn } from "../../../../lib/utils"
import { Slider } from "../../../../components/ui/slider"
type SliderProps = React.ComponentProps<typeof Slider>

export function SliderComponent({ className, ...props }: SliderProps) {
  return (
    <Slider
      defaultValue={[0]}
      onValueChange={()=>{}}
      max={100}
      step={1}
      className={cn("w-[75%]", className)}
      {...props}
    />
  )
}
