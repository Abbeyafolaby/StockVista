import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertInvestmentSchema, updateInvestmentSchema, type Investment } from "@shared/schema";
import { z } from "zod";

interface InvestmentFormProps {
  investment?: Investment;
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = z.infer<typeof insertInvestmentSchema>;

export default function InvestmentForm({ investment, onClose, onSuccess }: InvestmentFormProps) {
  const [calculations, setCalculations] = useState({
    totalInvestment: 0,
    currentValue: 0,
    gainLoss: 0,
    gainLossPercent: 0,
  });

  const { toast } = useToast();
  const isEditing = !!investment;

  const form = useForm<FormData>({
    resolver: zodResolver(isEditing ? updateInvestmentSchema.omit({ id: true }) : insertInvestmentSchema),
    defaultValues: investment ? {
      symbol: investment.symbol,
      companyName: investment.companyName,
      quantity: investment.quantity,
      purchasePrice: investment.purchasePrice,
      currentPrice: investment.currentPrice,
      purchaseDate: investment.purchaseDate,
    } : {
      symbol: "",
      companyName: "",
      quantity: 0,
      purchasePrice: "0.00",
      currentPrice: "0.00",
      purchaseDate: new Date().toISOString().split('T')[0],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (isEditing) {
        await apiRequest("PUT", `/api/investments/${investment.id}`, data);
      } else {
        await apiRequest("POST", "/api/investments", data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Investment ${isEditing ? "updated" : "added"} successfully`,
      });
      onSuccess();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} investment`,
        variant: "destructive",
      });
    },
  });

  // Watch form values to update calculations
  const watchedValues = form.watch();

  useEffect(() => {
    const quantity = Number(watchedValues.quantity) || 0;
    const purchasePrice = parseFloat(watchedValues.purchasePrice) || 0;
    const currentPrice = parseFloat(watchedValues.currentPrice) || 0;

    const totalInvestment = quantity * purchasePrice;
    const currentValue = quantity * currentPrice;
    const gainLoss = currentValue - totalInvestment;
    const gainLossPercent = totalInvestment > 0 ? (gainLoss / totalInvestment) * 100 : 0;

    setCalculations({
      totalInvestment,
      currentValue,
      gainLoss,
      gainLossPercent,
    });
  }, [watchedValues.quantity, watchedValues.purchasePrice, watchedValues.currentPrice]);

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {isEditing ? "Edit Investment" : "Add New Investment"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                {...form.register("purchaseDate")}
              />
              {form.formState.errors.purchaseDate && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.purchaseDate.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="symbol">Stock Symbol</Label>
              <Input
                id="symbol"
                placeholder="AAPL"
                className="uppercase"
                {...form.register("symbol")}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  form.setValue("symbol", e.target.value);
                }}
              />
              {form.formState.errors.symbol && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.symbol.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="Apple Inc."
              {...form.register("companyName")}
            />
            {form.formState.errors.companyName && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.companyName.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                step="1"
                placeholder="100"
                {...form.register("quantity", { valueAsNumber: true })}
              />
              {form.formState.errors.quantity && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.quantity.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="purchasePrice">Purchase Price per Share</Label>
              <Input
                id="purchasePrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="150.00"
                {...form.register("purchasePrice")}
              />
              {form.formState.errors.purchasePrice && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.purchasePrice.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="currentPrice">Current Price per Share</Label>
            <Input
              id="currentPrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="160.00"
              {...form.register("currentPrice")}
            />
            <p className="text-xs text-slate-500 mt-1">
              Enter the current market price to calculate your portfolio value
            </p>
            {form.formState.errors.currentPrice && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.currentPrice.message}
              </p>
            )}
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Total Investment:</span>
              <span className="font-medium text-slate-900">
                ${calculations.totalInvestment.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-slate-600">Current Value:</span>
              <span className="font-medium text-slate-900">
                ${calculations.currentValue.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-slate-600">Gain/Loss:</span>
              <span className={`font-medium ${calculations.gainLoss >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {calculations.gainLoss >= 0 ? '+' : ''}${calculations.gainLoss.toFixed(2)} 
                ({calculations.gainLoss >= 0 ? '+' : ''}{calculations.gainLossPercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : isEditing ? "Update Investment" : "Add Investment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
