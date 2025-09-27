import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon } from "lucide-react";

export default function Home() {
  return (
    <div>
      <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
        <BadgeCheckIcon />
        Verified
      </Badge>
    </div>
  );
}
