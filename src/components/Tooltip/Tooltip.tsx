import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface TooltipProps {
  elements: React.ReactNode; 
  content: string;         
}

export function Tooltip({elements,content}:TooltipProps) {
    return (
      <TooltipProvider>
        <TooltipUI>
          <TooltipTrigger asChild>
            {elements}
          </TooltipTrigger>
          <TooltipContent>
            <p>{content}</p>
          </TooltipContent>
        </TooltipUI>
      </TooltipProvider>
    )
  }