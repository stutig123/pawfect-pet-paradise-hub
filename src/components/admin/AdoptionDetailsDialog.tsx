
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AdoptionRequest, User, Pet } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { updateAdoptionStatus } from "@/services/adoptionService";
import { updatePetStatus } from "@/services/petService";

interface AdoptionDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  adoption: AdoptionRequest | null;
  petDetails: Pet | null;
  userDetails: User | null;
  onStatusUpdate: () => void;
}

export function AdoptionDetailsDialog({
  isOpen,
  onClose,
  adoption,
  petDetails,
  userDetails,
  onStatusUpdate
}: AdoptionDetailsDialogProps) {
  const { toast } = useToast();

  const handleApproveAdoption = () => {
    if (!adoption) return;
    
    try {
      // Update the adoption status
      updateAdoptionStatus(adoption.id, "approved");
      
      // Also update the pet status to adopted
      if (petDetails) {
        updatePetStatus(petDetails.id, "adopted");
      }
      
      toast({
        title: "Adoption Approved",
        description: "The adoption request has been approved."
      });
      
      onStatusUpdate();
      onClose();
    } catch (error) {
      console.error("Error approving adoption:", error);
      toast({
        title: "Error",
        description: "Failed to approve the adoption request.",
        variant: "destructive"
      });
    }
  };

  const handleRejectAdoption = () => {
    if (!adoption) return;
    
    try {
      // Update the adoption status
      updateAdoptionStatus(adoption.id, "rejected");
      
      toast({
        title: "Adoption Rejected",
        description: "The adoption request has been rejected."
      });
      
      onStatusUpdate();
      onClose();
    } catch (error) {
      console.error("Error rejecting adoption:", error);
      toast({
        title: "Error",
        description: "Failed to reject the adoption request.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adoption Request Details</DialogTitle>
          <DialogDescription>
            Review the details of this adoption request and take appropriate action.
          </DialogDescription>
        </DialogHeader>
        
        {adoption && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Pet Information</h3>
              <p>{petDetails?.name} ({petDetails?.breed || 'Unknown breed'})</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Requester</h3>
              <p>{userDetails?.name || 'Unknown User'}</p>
              <p className="text-sm text-gray-500">{userDetails?.email || 'unknown@example.com'}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Request Reason</h3>
              <p className="text-gray-700">{adoption.requestReason}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  adoption.status === "approved" 
                    ? "bg-green-100 text-green-800" 
                    : adoption.status === "rejected" 
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}>
                  {adoption.status.charAt(0).toUpperCase() + adoption.status.slice(1)}
                </span>
              </p>
            </div>
          </div>
        )}
        
        <DialogFooter className="gap-2">
          {adoption && adoption.status === "pending" && (
            <>
              <Button 
                variant="destructive" 
                onClick={handleRejectAdoption}
              >
                Reject
              </Button>
              <Button 
                onClick={handleApproveAdoption}
              >
                Approve
              </Button>
            </>
          )}
          {(!adoption || adoption.status !== "pending") && (
            <Button onClick={onClose}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
