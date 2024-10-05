import * as React from "react";
import { Button } from "@/components/ui/button"; 
import {
  Card,
  CardContent,
} from "@/components/ui/card"; 

const EmptySubjectCard: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
  return (
    <Card className="w-full h-full min-w-40 border border-black flex items-center justify-center">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full h-14 w-14 flex items-center justify-center"
        onClick={onAdd}
      >
        <img src="/plus.svg" alt="+" className="h-7 w-7" />
      </Button>
    </Card>
  );
};

export default EmptySubjectCard;
