
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const { isAuthenticated, user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }
  
  const handleSaveChanges = () => {
    // Validate inputs
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    if (!email.trim() || !email.includes("@")) {
      toast({
        title: "Error",
        description: "Please enter a valid email",
        variant: "destructive"
      });
      return;
    }
    
    if (password && password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    // Update user information
    const updatedUser = {
      ...user,
      name,
      email,
      ...(password ? { password } : {})
    };
    
    updateUser(updatedUser);
    
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
    
    setIsEditing(false);
    setPassword("");
    setConfirmPassword("");
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">My Profile</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              {isEditing ? (
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Your name"
                />
              ) : (
                <p className="p-2 border rounded-md bg-gray-50">{user.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input 
                  id="email"
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                />
              ) : (
                <p className="p-2 border rounded-md bg-gray-50">{user.email}</p>
              )}
            </div>
            
            {isEditing && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password (optional)</Label>
                  <Input 
                    id="password"
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword"
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label>Account Type</Label>
              <p className="p-2 border rounded-md bg-gray-50 capitalize">{user.role}</p>
            </div>
            
            <div className="space-y-2">
              <Label>Member Since</Label>
              <p className="p-2 border rounded-md bg-gray-50">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/dashboard")}
                >
                  View Dashboard
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm mb-4">
              Be careful, these actions cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="destructive" 
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfilePage;
