import React from "react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface ErrorButtonProps {
  errorType: "prerequisiteError" | "semesterError";
  onClick?: () => void; 
}

const ErrorButton: React.FC<ErrorButtonProps> = ({ errorType, onClick }) => {
  const isPrerequisiteError = errorType === "prerequisiteError";
  const buttonImage = isPrerequisiteError ? "/error_1.svg" : "/clock.svg";
  const buttonColor = isPrerequisiteError ? "bg-red-500" : "bg-orange-400";
  const tooltipText = isPrerequisiteError ? "Prerequisite error" : "Semester error";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick} 
            variant={isPrerequisiteError ? "prereqError" : "semesterError"}
            size="icon"
            className={`rounded-full flex-none h-[1.7rem] w-[1.7rem] items-center justify-center ${buttonColor}`}
          >
            <img src={buttonImage} className="h-6 w-6" alt="error icon" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ErrorButton;
