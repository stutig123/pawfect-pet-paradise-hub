
import { AdoptionRequest, AdoptionStatus } from "@/lib/types";
import adoptionRequestsData from "@/lib/data/adoption_requests.json";
import { updatePetStatus } from "@/services/petService";

// Create a local copy that will persist between renders
let localAdoptionRequests = [...adoptionRequestsData];

export const getAdoptionRequests = (): AdoptionRequest[] => {
  return localAdoptionRequests.map(adoption => ({
    ...adoption,
    status: adoption.status as AdoptionStatus
  }));
};

export const updateAdoptionStatus = (
  adoptionId: string, 
  newStatus: AdoptionStatus,
  updatePet: boolean = false,
  petId?: string
): AdoptionRequest => {
  const adoptionIndex = localAdoptionRequests.findIndex(a => a.id === adoptionId);
  
  if (adoptionIndex === -1) {
    throw new Error(`Adoption request with ID ${adoptionId} not found`);
  }
  
  // Update the status
  localAdoptionRequests[adoptionIndex] = {
    ...localAdoptionRequests[adoptionIndex],
    status: newStatus,
    updatedAt: new Date().toISOString()
  };
  
  // If updatePet is true and petId is provided, also update the pet status
  if (updatePet && petId) {
    updatePetStatus(petId, newStatus === "approved" ? "adopted" : "available");
  }
  
  // Return the updated adoption request
  return {
    ...localAdoptionRequests[adoptionIndex],
    status: newStatus as AdoptionStatus
  };
};

export const getUserAdoptionRequests = (userId: string): AdoptionRequest[] => {
  return localAdoptionRequests
    .filter(adoption => adoption.userId === userId)
    .map(adoption => ({
      ...adoption,
      status: adoption.status as AdoptionStatus
    }));
};
