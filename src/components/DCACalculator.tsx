
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import { ResultsDisplay } from "./ResultsDisplay";
import { fetchHistoricalBTCPrice, fetchCurrentBTCPrice } from "@/utils/bitcoinApi";
import { toast } from "sonner";

export const DCACalculator = () => {
  const [amount, setAmount] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("monthly");
  const [startDate, setStartDate] = useState<string>("");
  const [btcGoal, setBtcGoal] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const calculateDCA = async () => {
    if (!amount || !startDate) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    const investmentAmount = parseFloat(amount);
    const startDateTime = new Date(startDate);
    const today = new Date();
    const goal = btcGoal ? parseFloat(btcGoal) : null;

    if (isNaN(investmentAmount) || investmentAmount <= 0) {
      toast.error("Please enter a valid investment amount.");
      return;
    }

    if (startDateTime >= today) {
      toast.error("Start date must be in the past.");
      return;
    }

    setLoading(true);
    console.log("Starting DCA calculation...");

    try {
      let btcAccumulated = 0;
      let totalInvested = 0;
      let currentDate = new Date(startDateTime);
      let investmentCount = 0;

      while (currentDate <= today) {
        const formattedDate = `${(currentDate.getDate()).toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
        console.log(`Fetching price for ${formattedDate}`);
        
        const price = await fetchHistoricalBTCPrice(formattedDate);

        if (price) {
          const btcBought = investmentAmount / price;
          btcAccumulated += btcBought;
          totalInvested += investmentAmount;
          investmentCount++;
          console.log(`Investment ${investmentCount}: $${investmentAmount} bought ${btcBought.toFixed(6)} BTC at $${price}`);
        }

        // Advance to next date
        if (frequency === "weekly") {
          currentDate.setDate(currentDate.getDate() + 7);
        } else {
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }

      const currentPrice = await fetchCurrentBTCPrice();
      const currentValue = btcAccumulated * currentPrice;
      const roi = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;

      let goalInfo = null;
      if (goal && goal > 0) {
        const remaining = goal - btcAccumulated;
        const periodsLeft = remaining > 0 ? remaining / (investmentAmount / currentPrice) : 0;
        goalInfo = {
          remaining: Math.max(0, remaining),
          periodsLeft: Math.ceil(periodsLeft),
          achieved: btcAccumulated >= goal
        };
      }

      const calculationResults = {
        totalInvested,
        btcAccumulated,
        currentValue,
        currentPrice,
        roi,
        investmentCount,
        frequency,
        goalInfo
      };

      console.log("Calculation complete:", calculationResults);
      setResults(calculationResults);
      toast.success("DCA calculation completed successfully!");

    } catch (error) {
      console.error("Error calculating DCA:", error);
      toast.error("Failed to calculate DCA. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calculator className="h-6 w-6" />
            DCA Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                Investment amount per period (USD)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g. 100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency" className="text-sm font-medium text-gray-700">
                Frequency
              </Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                Start date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="btcGoal" className="text-sm font-medium text-gray-700">
                BTC goal (optional)
              </Label>
              <Input
                id="btcGoal"
                type="number"
                step="0.0001"
                placeholder="e.g. 0.1"
                value={btcGoal}
                onChange={(e) => setBtcGoal(e.target.value)}
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>

          <Button
            onClick={calculateDCA}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 transition-all duration-200 transform hover:scale-[1.02]"
          >
            {loading ? (
              <LoadingSpinner />
            ) : (
              "Calculate DCA Strategy"
            )}
          </Button>
        </CardContent>
      </Card>

      {results && <ResultsDisplay results={results} />}
    </div>
  );
};
