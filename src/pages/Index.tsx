
import { DCACalculator } from "@/components/DCACalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <span className="text-orange-500">Bitcoin</span>Plan
            </h1>
            <p className="text-lg text-gray-600">
              Simulate how much BTC you'd have accumulated using a smart DCA strategy
            </p>
          </div>
          
          <DCACalculator />
        </div>
      </div>
    </div>
  );
};

export default Index;
