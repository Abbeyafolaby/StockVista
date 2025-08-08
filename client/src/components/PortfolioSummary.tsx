import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Briefcase, BarChart3 } from "lucide-react";
import type { Investment } from "@shared/schema";

interface PortfolioStats {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  gainLossPercent: number;
  totalHoldings: number;
}

function calculatePortfolioStats(investments: Investment[]): PortfolioStats {
  if (!investments.length) {
    return {
      totalValue: 0,
      totalInvested: 0,
      totalGainLoss: 0,
      gainLossPercent: 0,
      totalHoldings: 0,
    };
  }

  const totalInvested = investments.reduce((sum, inv) => 
    sum + (parseFloat(inv.purchasePrice) * inv.quantity), 0
  );
  
  const totalValue = investments.reduce((sum, inv) => 
    sum + (parseFloat(inv.currentPrice) * inv.quantity), 0
  );
  
  const totalGainLoss = totalValue - totalInvested;
  const gainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  return {
    totalValue,
    totalInvested,
    totalGainLoss,
    gainLossPercent,
    totalHoldings: investments.length,
  };
}

export default function PortfolioSummary() {
  const { data: investments = [], isLoading } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
  });

  const stats = calculatePortfolioStats(investments);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-slate-200 rounded w-32"></div>
                  </div>
                  <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-slate-900">
                ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Gain/Loss</p>
              <p className={`text-2xl font-bold ${stats.totalGainLoss >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {stats.totalGainLoss >= 0 ? '+' : ''}${stats.totalGainLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className={`text-sm ${stats.totalGainLoss >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {stats.totalGainLoss >= 0 ? '+' : ''}{stats.gainLossPercent.toFixed(2)}%
              </p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stats.totalGainLoss >= 0 ? 'bg-success-50' : 'bg-danger-50'}`}>
              <TrendingUp className={`w-6 h-6 ${stats.totalGainLoss >= 0 ? 'text-success-600' : 'text-danger-600'}`} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Invested</p>
              <p className="text-2xl font-bold text-slate-900">
                ${stats.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Holdings</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalHoldings}</p>
              <p className="text-sm text-slate-600">investments</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
