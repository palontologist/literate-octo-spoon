"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, Truck, Droplets, ShoppingBag, AlertCircle, ThumbsUp } from "lucide-react";

// Sample product data
const PRODUCT = {
  id: "eco-tshirt-001",
  name: "Organic Cotton T-Shirt",
  price: 35,
  brand: "EcoThreads",
  materials: {
    organic_cotton: 95,
    recycled_polyester: 5
  },
  emissions: {
    conventional: 5.6, // kg CO2e for conventional product
    sustainable: 1.8,  // kg CO2e for this sustainable product
    saved: 3.8         // kg CO2e saved
  },
  water: {
    conventional: 2700, // liters for conventional product
    sustainable: 850,   // liters for this sustainable product
    saved: 1850         // liters saved
  },
  sdgs: ["SDG 12: Responsible Consumption", "SDG 13: Climate Action"]
};

// Delivery options
const DELIVERY_OPTIONS = [
  { 
    id: "standard", 
    name: "Standard Delivery", 
    price: 5.99, 
    time: "5-7 business days",
    emissions: 2.5 // kg CO2e
  },
  { 
    id: "express", 
    name: "Express Delivery", 
    price: 9.99, 
    time: "1-2 business days",
    emissions: 4.8
  },
  { 
    id: "carbon_neutral", 
    name: "Carbon Neutral Delivery", 
    price: 7.99, 
    time: "3-5 business days",
    emissions: 0
  }
];

export default function CheckoutPreview() {
  const [quantity, setQuantity] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState(DELIVERY_OPTIONS[0].id);
  const [offsetEnabled, setOffsetEnabled] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    address: ""
  });

  // Calculate total emissions and savings
  const selectedDelivery = DELIVERY_OPTIONS.find(option => option.id === deliveryOption) || DELIVERY_OPTIONS[0];
  
  const totalEmissionsSaved = (PRODUCT.emissions.saved * quantity) + (offsetEnabled ? selectedDelivery.emissions : 0);
  const totalWaterSaved = PRODUCT.water.saved * quantity;
  
  const subtotal = PRODUCT.price * quantity;
  const deliveryPrice = selectedDelivery.price;
  const offsetPrice = offsetEnabled ? 1.99 : 0;
  const total = subtotal + deliveryPrice + offsetPrice;

  // For visual display of impact
  const treesEquivalent = Math.round(totalEmissionsSaved / 25 * 10) / 10; // 1 tree absorbs ~25kg CO2 per year
  const emissionSavingPercentage = Math.round((totalEmissionsSaved / (PRODUCT.emissions.conventional * quantity + selectedDelivery.emissions)) * 100);

  // Handle form changes
  const handleQuantityChange = (value: string) => {
    const qty = parseInt(value);
    if (!isNaN(qty) && qty > 0 && qty <= 10) {
      setQuantity(qty);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-2">Checkout Preview</h1>
      <p className="text-muted-foreground mb-8">
        Demo of how sustainable impact metrics can be displayed during checkout
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>Enter your details for shipping</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Jane Smith" 
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Shipping Address</Label>
                <Input 
                  id="address" 
                  name="address" 
                  placeholder="123 Main St, City, Country" 
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery">Delivery Method</Label>
                <Select value={deliveryOption} onValueChange={setDeliveryOption}>
                  <SelectTrigger id="delivery">
                    <SelectValue placeholder="Select a delivery method" />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_OPTIONS.map(option => (
                      <SelectItem key={option.id} value={option.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{option.name} ({option.time})</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ${option.price.toFixed(2)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-1"
                    checked={offsetEnabled}
                    onChange={() => setOffsetEnabled(!offsetEnabled)}
                  />
                  <div>
                    <h4 className="font-medium">Carbon Offset Delivery (+$1.99)</h4>
                    <p className="text-sm text-muted-foreground">
                      Neutralize the carbon emissions from your delivery
                    </p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sustainable Impact</CardTitle>
              <CardDescription>Environmental impact of your purchase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 text-center">
                  <Leaf className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-lg font-bold text-green-700 dark:text-green-400">
                    {totalEmissionsSaved.toFixed(1)} kg
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-500">CO2e Saved</p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 text-center">
                  <Droplets className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-lg font-bold text-blue-700 dark:text-blue-400">
                    {totalWaterSaved.toLocaleString()} L
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-500">Water Saved</p>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 text-center">
                  <ThumbsUp className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                  <div className="text-lg font-bold text-amber-700 dark:text-amber-400">
                    {emissionSavingPercentage}%
                  </div>
                  <p className="text-sm text-amber-600 dark:text-amber-500">Lower Impact</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Your impact is equivalent to:</h4>
                  <p className="text-sm text-muted-foreground">
                    Planting {treesEquivalent} trees 🌳
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-950/50 px-3 py-1 rounded-full text-sm text-green-700 dark:text-green-400">
                  {PRODUCT.sdgs[0]}
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-800 mt-2">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-300">Transparency Note</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      Impact calculations are based on industry averages and specific brand data. 
                      Methodology details can be viewed in our transparency report.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-md h-16 w-16 flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">{PRODUCT.name}</h4>
                    <p className="text-sm text-muted-foreground">{PRODUCT.brand}</p>
                    <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <Leaf className="h-3 w-3" /> Sustainable Product
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${PRODUCT.price.toFixed(2)}</div>
                  <div className="flex items-center mt-1">
                    <Label htmlFor="quantity" className="sr-only">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      className="w-12 h-7 text-center"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{selectedDelivery.name}</span>
                  <span>${selectedDelivery.price.toFixed(2)}</span>
                </div>
                {offsetEnabled && (
                  <div className="flex justify-between text-green-600">
                    <span>Carbon Offset</span>
                    <span>$1.99</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between font-medium text-lg border-t pt-3">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <Button className="w-full mt-4" size="lg">
                Complete Order
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2">
                <Truck className="h-3 w-3" />
                <span>
                  {selectedDelivery.name} ({selectedDelivery.time})
                </span>
              </div>
              
              <div className="text-center text-xs text-muted-foreground mt-4">
                This is a demonstration of how sustainable impact information
                can be integrated into your checkout flow.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 