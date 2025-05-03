
import { Pet, PetStatus, PetCategory } from "@/lib/types";
import petsData from "@/lib/data/pets.json";

// Create a local copy that will persist between renders
let localPets = [...petsData];

export const getAllPets = (): Pet[] => {
  return localPets.map(pet => ({
    ...pet,
    category: pet.category as PetCategory,
    status: pet.status as PetStatus
  }));
};

export const getPetById = (petId: string): Pet | undefined => {
  const pet = localPets.find(p => p.id === petId);
  
  if (pet) {
    return {
      ...pet,
      category: pet.category as PetCategory,
      status: pet.status as PetStatus
    };
  }
  
  return undefined;
};

export const updatePetStatus = (petId: string, newStatus: PetStatus): Pet => {
  const petIndex = localPets.findIndex(p => p.id === petId);
  
  if (petIndex === -1) {
    throw new Error(`Pet with ID ${petId} not found`);
  }
  
  // Update the status
  localPets[petIndex] = {
    ...localPets[petIndex],
    status: newStatus
  };
  
  console.log(`Pet ${petId} status updated to: ${newStatus}`);
  
  // Return the updated pet
  return {
    ...localPets[petIndex],
    category: localPets[petIndex].category as PetCategory,
    status: newStatus
  };
};
