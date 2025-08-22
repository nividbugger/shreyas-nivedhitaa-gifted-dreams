import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Gift, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/wedding-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-elegant">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/95"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <div className="mb-8 animate-float">
            <Heart className="w-16 h-16 mx-auto text-primary mb-4" />
          </div>
          
          <h1 className="font-wedding text-5xl md:text-7xl font-bold bg-gradient-wedding bg-clip-text text-transparent mb-6">
            Nivedhitaa & Shreyas
          </h1>
          
          <p className="font-wedding text-xl md:text-2xl text-muted-foreground mb-8">
            Wedding Registry
          </p>
          
          <p className="font-elegant text-lg text-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join us in celebrating our special day! Browse our wishlist or contribute to our journey together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/registry">
              <Button variant="wedding" size="lg" className="w-full sm:w-auto">
                <Gift className="w-5 h-5 mr-2" />
                View Registry
              </Button>
            </Link>
            
            <Link to="/admin">
              <Button variant="elegant" size="lg" className="w-full sm:w-auto">
                <Users className="w-5 h-5 mr-2" />
                Couple Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-wedding text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-primary/20 shadow-elegant hover:shadow-gold transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Gift className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-wedding text-xl font-semibold mb-4 text-foreground">Browse Wishlist</h3>
                <p className="text-muted-foreground font-elegant">
                  Explore our carefully curated wishlist from Amazon, Flipkart, Nykaa, and more.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20 shadow-elegant hover:shadow-gold transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-wedding rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-wedding text-xl font-semibold mb-4 text-foreground">Send Love</h3>
                <p className="text-muted-foreground font-elegant">
                  Contribute via UPI, send cash gifts, or purchase items with a personal message.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20 shadow-elegant hover:shadow-gold transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-wedding text-xl font-semibold mb-4 text-foreground">Celebrate Together</h3>
                <p className="text-muted-foreground font-elegant">
                  Your messages and gifts become part of our beautiful wedding story.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;