import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Gift, ExternalLink, ArrowLeft, QrCode, Smartphone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface WishlistItem {
  id: string;
  title: string;
  description: string;
  url: string;
  store: string;
  price: string;
  image?: string;
}

const GuestRegistry = () => {
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [giftForm, setGiftForm] = useState({
    guestName: "",
    message: "",
    from: "",
    paymentMethod: ""
  });

  const wishlistItems: WishlistItem[] = [
    {
      id: "1",
      title: "Premium Coffee Maker",
      description: "Espresso machine for our morning coffee rituals together",
      url: "https://amazon.in/example",
      store: "Amazon",
      price: "₹25,000"
    },
    {
      id: "2",
      title: "Silk Bedsheet Set",
      description: "Luxurious silk bedsheets for our new home",
      url: "https://flipkart.com/example",
      store: "Flipkart",
      price: "₹8,500"
    },
    {
      id: "3",
      title: "Skincare Gift Set",
      description: "Premium skincare collection for the bride",
      url: "https://nykaa.com/example",
      store: "Nykaa",
      price: "₹12,000"
    }
  ];

  const handlePurchaseGift = (item: WishlistItem) => {
    if (!giftForm.guestName || !giftForm.message || !giftForm.from) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the required fields.",
        variant: "destructive",
      });
      return;
    }

    // Here you would integrate with payment processing
    toast({
      title: "Gift Sent! 🎁",
      description: "Thank you for your thoughtful gift! The couple will be notified.",
    });
    
    setGiftForm({ guestName: "", message: "", from: "", paymentMethod: "" });
    setSelectedItem(null);
  };

  const handleCashGift = () => {
    if (!giftForm.guestName || !giftForm.message || !giftForm.from) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thank You! 💝",
      description: "Your message has been sent to the couple. Please use the UPI details to complete your contribution.",
    });
    
    setGiftForm({ guestName: "", message: "", from: "", paymentMethod: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-elegant">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-6">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="font-wedding text-4xl md:text-5xl font-bold bg-gradient-wedding bg-clip-text text-transparent mb-4">
            Wedding Registry
          </h1>
          <p className="font-wedding text-xl text-muted-foreground mb-2">
            Nivedhitaa & Shreyas
          </p>
          <p className="font-elegant text-foreground/80 max-w-2xl mx-auto">
            Help us start our journey together by choosing from our wishlist or contributing to our future!
          </p>
        </div>

        <Tabs defaultValue="wishlist" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="cash">Cash Fund</TabsTrigger>
          </TabsList>

          {/* Wishlist */}
          <TabsContent value="wishlist" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="border-primary/20 shadow-elegant hover:shadow-gold transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary">{item.store}</Badge>
                        <span className="font-semibold text-primary">{item.price}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on {item.store}
                        </Button>
                      </a>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="wedding" 
                            className="w-full"
                            onClick={() => setSelectedItem(item)}
                          >
                            <Gift className="w-4 h-4 mr-2" />
                            Gift This Item
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle className="font-wedding">Gift: {item.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <div className="flex items-start gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium">Delivery Address:</p>
                                  <p className="text-sm text-muted-foreground">
                                    Nivedhitaa & Shreyas<br />
                                    123 Wedding Lane, Bangalore<br />
                                    Karnataka 560001<br />
                                    Phone: +91 98765 43210
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="guestName">Your Name</Label>
                              <Input
                                id="guestName"
                                value={giftForm.guestName}
                                onChange={(e) => setGiftForm({...giftForm, guestName: e.target.value})}
                                placeholder="Your name"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="from">Gift From (Family/Friends)</Label>
                              <Input
                                id="from"
                                value={giftForm.from}
                                onChange={(e) => setGiftForm({...giftForm, from: e.target.value})}
                                placeholder="e.g., The Smith Family, John & Sarah"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="message">Message to the Couple</Label>
                              <Textarea
                                id="message"
                                value={giftForm.message}
                                onChange={(e) => setGiftForm({...giftForm, message: e.target.value})}
                                placeholder="Write a beautiful message..."
                              />
                            </div>
                            
                            <Button 
                              variant="wedding" 
                              className="w-full"
                              onClick={() => handlePurchaseGift(item)}
                            >
                              Confirm Gift
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Cash Fund */}
          <TabsContent value="cash" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <Card className="border-primary/20 shadow-elegant">
                <CardHeader className="text-center">
                  <CardTitle className="font-wedding text-2xl flex items-center justify-center gap-2">
                    <Heart className="w-6 h-6 text-primary" />
                    Cash Fund
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Help us build our future together with a monetary contribution
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* UPI Payment Options */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-primary/10">
                      <CardContent className="p-6 text-center">
                        <Smartphone className="w-12 h-12 mx-auto mb-4 text-primary" />
                        <h3 className="font-semibold mb-2">UPI Payment</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Pay directly using any UPI app
                        </p>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="font-mono text-sm">shreyas.nivedhitaa@upi</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-primary/10">
                      <CardContent className="p-6 text-center">
                        <QrCode className="w-12 h-12 mx-auto mb-4 text-primary" />
                        <h3 className="font-semibold mb-2">QR Code</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Scan to pay instantly
                        </p>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="w-24 h-24 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
                            <QrCode className="w-12 h-12 text-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Gift Form */}
                  <div className="space-y-4">
                    <h3 className="font-wedding text-lg font-semibold">Send Your Message</h3>
                    
                    <div>
                      <Label htmlFor="cashGuestName">Your Name</Label>
                      <Input
                        id="cashGuestName"
                        value={giftForm.guestName}
                        onChange={(e) => setGiftForm({...giftForm, guestName: e.target.value})}
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cashFrom">Contribution From</Label>
                      <Input
                        id="cashFrom"
                        value={giftForm.from}
                        onChange={(e) => setGiftForm({...giftForm, from: e.target.value})}
                        placeholder="e.g., The Smith Family, John & Sarah"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cashMessage">Message to the Couple</Label>
                      <Textarea
                        id="cashMessage"
                        value={giftForm.message}
                        onChange={(e) => setGiftForm({...giftForm, message: e.target.value})}
                        placeholder="Share your blessings and wishes..."
                      />
                    </div>
                    
                    <Button 
                      variant="wedding" 
                      className="w-full"
                      onClick={handleCashGift}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Send Message & Payment Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GuestRegistry;