"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ErrorButton from "./errorButton";
import { SERVER_URL } from '@/lib/utils';
import SubjectFetcher from "./subjectFetcher";
import { ScrollArea } from "@/components/ui/scroll-area"

interface PrereqDisplayProps {
  subjectCode: string;
}

const PrereqDisplay: React.FC<PrereqDisplayProps> = ({ subjectCode }) => {
  const [prerequisites, setPrerequisites] = useState<string[][]>([]);
  const [isOpen, setIsOpen] = useState(false); // State to control Sheet visibility

  useEffect(() => {
    const fetchPrerequisites = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/v1/course/prerequisites/${subjectCode}`);
        setPrerequisites(res.data || []);
      } catch (err) {
        console.error("Failed to fetch prerequisites:", err);
      }
    };
    fetchPrerequisites();
  }, [subjectCode]);

  const formatPrerequisites = (prereqs: string[][]) => {
    console.log(prereqs);
    if (prereqs.length > 0) {
      return prereqs.map((group, index) => (
        <div key={index} className="prereq-group">
          <h3 className="text-planner-header text-xl pb-3"> One of </h3> 
          {group.map((code, idx) => (
            <React.Fragment key={code}>
              <SubjectFetcher subjectCode={code} />
              {idx < group.length - 1 && <br />} {/* Add a separator for readability */}
            </React.Fragment>
          ))}
          {index < prereqs.length - 1 && (
            <h3 className="text-planner-header font-bold text-xl py-3">And</h3>
          )}
        </div>
      ));
    } else {
      return null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <ErrorButton errorType="prerequisiteError" onClick={() => setIsOpen(true)} />
      </SheetTrigger>
      <SheetContent side="planner_right" className="pr-0">
        <ScrollArea className="h-full w-full rounded-md">
          <SheetHeader className="h-[5rem] flex w-full">
            <SheetTitle className="text-planner-header text-3xl pt-3">Prerequisites</SheetTitle>
          </SheetHeader>
          <div className="mt-4 text-base pr-6">
            {prerequisites.length > 0 ? (
              formatPrerequisites(prerequisites)
            ) : (
              <p>No prerequisites available for this subject.</p>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default PrereqDisplay;