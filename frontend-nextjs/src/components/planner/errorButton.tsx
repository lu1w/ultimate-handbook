import React from "react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface ErrorButtonProps {
  errorType: "prerequisiteError" | "semesterError";
  onClick?: () => void; 
}

const ErrorButton: React.FC<ErrorButtonProps> = ({ errorType, onClick }) => {
  const isPrerequisiteError = errorType === "prerequisiteError";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick} 
            variant={isPrerequisiteError ? "prereqError" : "semesterError"}
            size="icon"
            className={`rounded-full flex-none h-[1.5rem] w-[1.5rem] items-center justify-center ${
              isPrerequisiteError ? "bg-red-500" : "bg-orange-400"
            }`}
          >
            <img src="/error_1.svg" className="h-5 w-5" alt="error icon" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isPrerequisiteError ? "Prerequisite error" : "Semester error"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ErrorButton;
