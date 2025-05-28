
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, DollarSign, Bitcoin, Calculator } from "lucide-react";

interface ResultsProps {
  results: {
    totalInvested: number;
    btcAccumulated: number;
    currentValue: number;
    currentPrice: number;
    averagePrice: number;
    roi: number;
    investmentCount: number;
    frequency: string;
    goalInfo?: {
      remaining: number;
      periodsLeft: number;
      achieved: boolean;
    } | null;
  };
}

export const ResultsDisplay = ({ results }: ResultsProps) => {
  const {
    totalInvested,
    btcAccumulated,
    currentValue,
    currentPrice,
    averagePrice,
    roi,
    investmentCount,
    frequency,
    goalInfo
  } = results;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatBTC = (amount: number) => {
    return amount.toFixed(8);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl">
          <TrendingUp className="h-6 w-6" />
          📊 Results
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-700">Total Invested</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(totalInvested)}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Bitcoin className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-gray-700">BTC Accumulated</span>
              </div>
              <span className="text-lg font-bold text-orange-600">
                {formatBTC(btcAccumulated)} BTC
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-gray-700">Average Price</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">
                {formatCurrency(averagePrice)}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-700">Current Value</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(currentValue)}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">ROI</span>
              </div>
              <span className={`text-lg font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Current BTC Price</span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {formatCurrency(currentPrice)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Investment Summary:</strong> You made {investmentCount} {frequency} investments
          </p>
          <p className="text-sm text-gray-600">
            <strong>Price Comparison:</strong> Your average price was {formatCurrency(averagePrice)} vs current price of {formatCurrency(currentPrice)}
            {averagePrice < currentPrice ? (
              <span className="text-green-600 font-medium"> (You bought at a discount! 📈)</span>
            ) : (
              <span className="text-orange-600 font-medium"> (Current price is lower 📉)</span>
            )}
          </p>
        </div>

        {goalInfo && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">🎯 Goal Progress</span>
            </div>
            {goalInfo.achieved ? (
              <p className="text-green-700 font-medium">
                🎉 Congratulations! You've reached your Bitcoin goal!
              </p>
            ) : (
              <div className="space-y-1 text-blue-700">
                <p>
                  You need <strong>{formatBTC(goalInfo.remaining)} BTC</strong> more to hit your goal.
                </p>
                <p>
                  At this rate, it would take approximately{" "}
                  <strong>{goalInfo.periodsLeft}</strong> more{" "}
                  {frequency === "weekly" ? "weeks" : "months"} to reach your target.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
