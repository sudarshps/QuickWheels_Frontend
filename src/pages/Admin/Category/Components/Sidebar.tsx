import { Button } from '../../../../components/ui/button';

interface SidebarProps {
    onSelect: (category: string) => void;
  }
  
  export default function Sidebar({ onSelect }: SidebarProps) {
    return (
      <div className="space-y-4 p-4 text-white">
        <Button className="w-full bg-red-600 hover:bg-red-400" onClick={() => onSelect("make")}>
          Car Make
        </Button>
        <Button className="w-full bg-red-600 hover:bg-red-400" onClick={() => onSelect("type")}>
          Car Type
        </Button>
      </div>
    );
  }
