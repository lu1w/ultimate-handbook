"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@components/ui/dialog"

interface RepeatedSubjectAlertProps {
    message: string
    onClose: () => void
  }
  
  const RepeatedSubjectAlert: React.FC<RepeatedSubjectAlertProps> = ({ message, onClose }) => {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="bg-white">
          <DialogTitle>Alert</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogContent>
      </Dialog>
    )
  }
  
  export default RepeatedSubjectAlert
