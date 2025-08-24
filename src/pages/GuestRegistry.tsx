import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Gift, ExternalLink, ArrowLeft, QrCode, Smartphone, MapPin, CheckCircle, X, Copy, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useRegistry, WishlistItem } from "@/contexts/RegistryContext";

const GuestRegistry = () => {
  const { toast } = useToast();
  const { wishlistItems, purchaseItem, addCashGift } = useRegistry();
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [giftForm, setGiftForm] = useState({
    guestName: "",
    message: "",
    from: "",
    paymentMethod: "",
    transactionId: ""
  });

  // Transaction ID validation regex (supports common UPI/bank transaction IDs)
  const validateTransactionId = (transactionId: string): boolean => {
    if (!transactionId) return true; // Optional field
    
    // Common patterns for Indian transaction IDs:
    // - UPI: 12 digit numbers or alphanumeric
    // - Bank: 8-16 characters alphanumeric
    // - Razorpay: pay_XXXXXXXXX format
    // - PhonePe: T + numbers
    const patterns = [
      /^[0-9]{12}$/, // 12 digit UPI transaction ID
      /^[A-Za-z0-9]{8,16}$/, // 8-16 alphanumeric (general bank)
      /^pay_[A-Za-z0-9]{14}$/, // Razorpay format
      /^T[0-9]{10,15}$/, // PhonePe format
      /^[0-9]{10,20}$/, // General numeric transaction ID
      /^UTR[A-Za-z0-9]{8,12}$/, // NEFT/RTGS UTR format
    ];
    
    return patterns.some(pattern => pattern.test(transactionId));
  };

  const handlePurchaseGift = (item: WishlistItem) => {
    if (!giftForm.guestName || !giftForm.message || !giftForm.from) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the required fields.",
        variant: "destructive",
      });
      return;
    }

    purchaseItem(item.id, giftForm.guestName, giftForm.from, giftForm.message);
    
    toast({
      title: "Gift Sent! 🎁",
      description: "Thank you for your thoughtful gift! The couple will be notified.",
    });
    
    setGiftForm({ guestName: "", message: "", from: "", paymentMethod: "", transactionId: "" });
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

    if (giftForm.transactionId && !validateTransactionId(giftForm.transactionId)) {
      toast({
        title: "Invalid Transaction ID",
        description: "Please enter a valid transaction ID format (12 digits, UTR format, or similar).",
        variant: "destructive",
      });
      return;
    }

    addCashGift(giftForm.guestName, giftForm.from, giftForm.message, giftForm.transactionId);

    toast({
      title: "Thank You! 💝",
      description: giftForm.transactionId 
        ? "Your message and transaction details have been sent to the couple."
        : "Your message has been sent to the couple. Please use the UPI details to complete your contribution.",
    });
    
    setGiftForm({ guestName: "", message: "", from: "", paymentMethod: "", transactionId: "" });
  };

  const copyAddress = () => {
    const address = "Nivedhitaa Ranganathan, 4002, Sobha Jasmine, Green Glen Layout, Bellandur, Bangalore, 560103";
    navigator.clipboard.writeText(address).then(() => {
      toast({
        title: "Address Copied! 📋",
        description: "The delivery address has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the address.",
        variant: "destructive",
      });
    });
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
              {wishlistItems
                .sort((a, b) => {
                  // Show unpurchased items first, then purchased items
                  if (a.status === 'available' && b.status === 'purchased') return -1;
                  if (a.status === 'purchased' && b.status === 'available') return 1;
                  return 0;
                })
                .map((item) => (
                <Card key={item.id} className={`border-primary/20 shadow-elegant hover:shadow-gold transition-all duration-300 group ${item.status === 'purchased' ? 'opacity-75' : ''}`}>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold text-lg group-hover:text-primary transition-colors ${item.status === 'purchased' ? 'line-through text-muted-foreground' : ''}`}>
                          {item.title}
                        </h3>
                        {item.status === 'purchased' && (
                          <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Purchased
                          </Badge>
                        )}
                      </div>
                      <p className={`text-muted-foreground text-sm mb-3 ${item.status === 'purchased' ? 'line-through' : ''}`}>{item.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary">{item.store}</Badge>
                        <span className={`font-semibold text-primary ${item.status === 'purchased' ? 'line-through' : ''}`}>{item.price}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="w-full" disabled={item.status === 'purchased'}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on {item.store}
                        </Button>
                      </a>
                      
                      {item.status === 'purchased' ? (
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <CheckCircle className="w-8 h-8 mx-auto text-green-600 mb-2" />
                          <p className="text-sm text-muted-foreground">
                            This item has been purchased by {item.purchasedBy}
                          </p>
                        </div>
                      ) : (
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
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium">Delivery Address:</p>
                                    <p className="text-sm text-muted-foreground">
                                      Nivedhitaa Ranganathan<br />
                                      4002, Sobha Jasmine<br />
                                      Green Glen Layout, Bellandur<br />
                                      Bangalore, 560103
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={copyAddress}
                                  className="text-primary hover:text-primary/80 p-2"
                                  title="Copy address"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                💡 Click the copy button to use this address when purchasing online
                              </p>
                            </div>

                            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                <Gift className="w-4 h-4 text-primary" />
                                Purchase This Item
                              </h4>
                              <a 
                                href={selectedItem?.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block mb-3"
                              >
                                <Button variant="outline" className="w-full">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Buy Now on {selectedItem?.store}
                                </Button>
                              </a>
                              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                                <p className="text-xs text-amber-800">
                                  <strong>📝 Important:</strong> After purchasing, please come back here and fill out the form below to let the couple know about your gift!
                                </p>
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
                      )}
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
                          <p className="font-mono text-sm">7795766860@pthdfc</p>
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
                          <img 
                            src="/upi-qr-code.png" 
                            alt="UPI QR Code for 7795766860@pthdfc"
                            className="w-24 h-24 mx-auto rounded-lg"
                          />
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

                    {/* Transaction ID Field */}
                    <div>
                      <Label htmlFor="transactionId" className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        Transaction ID (Optional)
                      </Label>
                      <Input
                        id="transactionId"
                        value={giftForm.transactionId}
                        onChange={(e) => setGiftForm({...giftForm, transactionId: e.target.value})}
                        placeholder="e.g., 123456789012 or UTR123456789"
                        className={giftForm.transactionId && !validateTransactionId(giftForm.transactionId) 
                          ? "border-destructive focus:border-destructive" 
                          : ""
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        💡 Add your UPI/bank transaction ID for safe tracking of your gift. This helps both you and the couple keep records.
                      </p>
                      {giftForm.transactionId && !validateTransactionId(giftForm.transactionId) && (
                        <p className="text-xs text-destructive mt-1">
                          Please enter a valid transaction ID (12 digits, UTR format, or similar)
                        </p>
                      )}
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
