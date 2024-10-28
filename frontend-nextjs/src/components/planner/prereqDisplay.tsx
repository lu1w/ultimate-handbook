"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ErrorButton from "./errorButton";
import { SERVER_URL } from '@/lib/utils';

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
        console.log("Response data:", res.data);
        setPrerequisites(res.data || []);
      } catch (err) {
        console.error("Failed to fetch prerequisites:", err);
      }
    };
    fetchPrerequisites();
  }, [subjectCode]);

  const formatPrerequisites = (prereqs: string[][]) => {
    return prereqs
      .map((group) =>
        group.length > 1 ? `One of ${group.join(" or ")}` : group[0]
      )
      .join(" and ");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <ErrorButton errorType="prerequisiteError" onClick={() => setIsOpen(true)} />
      </SheetTrigger>
      <SheetContent side="planner_right">
      <SheetHeader className="h-[5rem] flex w-full">
        <SheetTitle className="text-planner-header text-3xl pt-3">Prerequisites</SheetTitle>
      </SheetHeader>
        <div className="mt-4 text-base">
          {prerequisites.length > 0 ? (
            <p>{formatPrerequisites(prerequisites)}</p>
          ) : (
            <p>No prerequisites available for this subject.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PrereqDisplay;
