import * as React from "react";
import { Button } from "@/components/ui/button"; 
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; 
import { cn } from "@/lib/utils";

const EmptySubjectCard: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
  return (
    <Card className="w-full h-full border border-black flex items-center justify-center">
      <img src="/plus.svg" alt="+" className="h-6 w-6" />
      <CardContent className="flex items-center justify-center h-full">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full h-12 w-12 flex items-center justify-center relative"
          onClick={onAdd}
        >
          <img src="/plus.svg" alt="+" className="h-6 w-6" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptySubjectCard;
