import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { toast } = useToast();
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in both email and password.",
        variant: "destructive",
      });
      return;
    }

    try {
      await signIn(formData.email, formData.password);
      toast({
        title: "Welcome back! 💕",
        description: "Successfully logged in to your admin panel.",
      });
      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-elegant flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="mb-6 animate-float">
            <Heart className="w-12 h-12 mx-auto text-primary mb-4" />
          </div>
          
          <h1 className="font-wedding text-3xl font-bold bg-gradient-wedding bg-clip-text text-transparent mb-2">
            Couple Login
          </h1>
          <p className="font-wedding text-lg text-muted-foreground mb-2">
            Nivedhitaa & Shreyas
          </p>
          <p className="font-elegant text-sm text-foreground/80">
            Access your wedding registry admin panel
          </p>
        </div>

        {/* Login Form */}
        <Card className="border-primary/20 shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="font-wedding text-xl">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your-email@example.com"
                  disabled={loading}
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                variant="wedding" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>First time?</strong> You'll need to create your account first.
                Check the setup instructions in your project documentation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
