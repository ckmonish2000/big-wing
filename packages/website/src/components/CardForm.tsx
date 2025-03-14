
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Calendar, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface SavedCard {
  id: string;
  cardNumber: string;
  nameOnCard: string;
  expiryDate: string;
  isDefault: boolean;
}

interface CardFormProps {
  savedCards: SavedCard[];
  onPaymentComplete: () => void;
  totalAmount: number;
  currency: string;
}

const CardForm = ({ savedCards, onPaymentComplete, totalAmount, currency }: CardFormProps) => {
  const [selectedCardId, setSelectedCardId] = useState<string | "new">(
    savedCards.length > 0 ? savedCards.find(card => card.isDefault)?.id || savedCards[0].id : "new"
  );
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment successful!",
        description: "Your booking has been confirmed.",
        variant: "success",
      });
      onPaymentComplete();
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        {savedCards.length > 0 && (
          <div className="mb-6 space-y-4">
            <div className="text-lg font-medium">Saved Cards</div>
            <div className="space-y-2">
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  className={`flex items-center p-3 border rounded-md cursor-pointer ${
                    selectedCardId === card.id
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                  onClick={() => setSelectedCardId(card.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>•••• •••• •••• {card.cardNumber.slice(-4)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {card.nameOnCard} • Expires {card.expiryDate}
                    </div>
                  </div>
                  {card.isDefault && (
                    <div className="bg-primary/10 text-primary text-xs py-1 px-2 rounded-full">
                      Default
                    </div>
                  )}
                </div>
              ))}
              <div
                className={`flex items-center p-3 border rounded-md cursor-pointer ${
                  selectedCardId === "new"
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
                onClick={() => setSelectedCardId("new")}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Add a new card</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedCardId === "new" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="cardNumber"
                  placeholder="4111 1111 1111 1111"
                  className="pl-10"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameOnCard">Name on Card</Label>
              <Input
                id="nameOnCard"
                placeholder="John Doe"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    className="pl-10"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength={5}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="cvv"
                    type="password"
                    placeholder="123"
                    className="pl-10"
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="saveCard"
                className="rounded border-gray-300"
                checked={saveCard}
                onChange={() => setSaveCard(!saveCard)}
              />
              <Label htmlFor="saveCard" className="text-sm cursor-pointer">
                Save this card for future payments
              </Label>
            </div>
          </form>
        )}

        <div className="mt-6">
          <div className="text-lg font-medium mb-2">Amount</div>
          <div className="text-2xl font-bold">
            {currency} {totalAmount.toFixed(2)}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isProcessing || (selectedCardId === "new" && (!cardNumber || !nameOnCard || !expiryDate || !cvv))}
          onClick={handleSubmit}
        >
          {isProcessing ? "Processing..." : `Pay ${currency} ${totalAmount.toFixed(2)}`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardForm;
