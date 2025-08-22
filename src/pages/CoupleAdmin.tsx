import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Gift, MessageSquare, ExternalLink, Trash2, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useRegistry } from "@/contexts/RegistryContext";

const CoupleAdmin = () => {
  const { toast } = useToast();
  const { wishlistItems, gifts, addWishlistItem, removeWishlistItem } = useRegistry();
  
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    url: "",
    store: "",
    price: ""
  });

  const handleAddItem = () => {
    if (!newItem.title || !newItem.url) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the title and URL.",
        variant: "destructive",
      });
      return;
    }

    addWishlistItem(newItem);
    setNewItem({ title: "", description: "", url: "", store: "", price: "" });
    
    toast({
      title: "Item Added",
      description: "Your wishlist item has been added successfully!",
    });
  };

  const handleRemoveItem = (id: string) => {
    removeWishlistItem(id);
    toast({
      title: "Item Removed",
      description: "The item has been removed from your wishlist.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-elegant">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="font-wedding text-3xl font-bold bg-gradient-wedding bg-clip-text text-transparent">
                Couple Dashboard
              </h1>
              <p className="text-muted-foreground font-elegant">Manage your wedding registry</p>
            </div>
          </div>
          <Heart className="w-8 h-8 text-primary animate-float" />
        </div>

        <Tabs defaultValue="wishlist" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="wishlist">Wishlist Management</TabsTrigger>
            <TabsTrigger value="gifts">Gifts & Messages</TabsTrigger>
          </TabsList>

          {/* Wishlist Management */}
          <TabsContent value="wishlist" className="space-y-6">
            <Card className="border-primary/20 shadow-elegant">
              <CardHeader>
                <CardTitle className="font-wedding flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Item
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Item Title</Label>
                    <Input
                      id="title"
                      value={newItem.title}
                      onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                      placeholder="Coffee Maker"
                    />
                  </div>
                  <div>
                    <Label htmlFor="store">Store</Label>
                    <Input
                      id="store"
                      value={newItem.store}
                      onChange={(e) => setNewItem({...newItem, store: e.target.value})}
                      placeholder="Amazon, Flipkart, Nykaa..."
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    placeholder="Why you want this item..."
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="url">Product URL</Label>
                    <Input
                      id="url"
                      value={newItem.url}
                      onChange={(e) => setNewItem({...newItem, url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (Optional)</Label>
                    <Input
                      id="price"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                      placeholder="₹25,000"
                    />
                  </div>
                </div>
                
                <Button onClick={handleAddItem} variant="wedding">
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Wishlist
                </Button>
              </CardContent>
            </Card>

            {/* Current Wishlist */}
            <div className="space-y-4">
              <h3 className="font-wedding text-xl font-semibold">Current Wishlist</h3>
            {wishlistItems.map((item) => (
                <Card key={item.id} className="border-primary/20 shadow-elegant">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg">{item.title}</h4>
                          {item.status === 'purchased' && (
                            <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Purchased
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-2">{item.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="secondary">{item.store}</Badge>
                          {item.price && <span className="text-primary font-semibold">{item.price}</span>}
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            View Product <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        {item.status === 'purchased' && item.purchasedBy && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            Purchased by: <span className="font-medium">{item.purchasedBy}</span>
                            {item.purchaseDate && <span> on {item.purchaseDate}</span>}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Gifts & Messages */}
          <TabsContent value="gifts" className="space-y-6">
            <div>
              <h3 className="font-wedding text-xl font-semibold mb-4">Recent Gifts & Messages</h3>
              <div className="space-y-4">
                {gifts.map((gift) => (
                  <Card key={gift.id} className="border-primary/20 shadow-elegant">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center">
                            {gift.type === "cash" ? <Heart className="w-5 h-5 text-primary-foreground" /> : <Gift className="w-5 h-5 text-primary-foreground" />}
                          </div>
                          <div>
                            <h4 className="font-semibold">{gift.guestName}</h4>
                            <p className="text-sm text-muted-foreground">From: {gift.from}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={gift.type === "cash" ? "default" : "secondary"}>
                            {gift.type === "cash" ? gift.amount : gift.itemTitle}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{gift.date}</p>
                        </div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                          <p className="text-sm italic">{gift.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoupleAdmin;