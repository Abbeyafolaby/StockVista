import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Shield, DollarSign } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Portfolio Tracker</span>
            </div>
            <Button onClick={() => window.location.href = '/api/login'}>
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl">
            Track Your Investment Portfolio
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto">
            Take control of your investments with our comprehensive portfolio tracking platform. 
            Monitor performance, calculate gains/losses, and make informed decisions.
          </p>
          <div className="mt-10">
            <Button 
              size="lg" 
              className="px-8 py-3 text-lg"
              onClick={() => window.location.href = '/api/login'}
            >
              Get Started Free
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Portfolio Overview</h3>
              <p className="text-slate-600">
                Get a comprehensive view of your entire investment portfolio in one place.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg mb-4">
                <TrendingUp className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Real-time Calculations</h3>
              <p className="text-slate-600">
                Automatically calculate your gains, losses, and portfolio performance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Manual Price Updates</h3>
              <p className="text-slate-600">
                Enter current stock prices manually to keep your portfolio up to date.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg mb-4">
                <Shield className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure & Private</h3>
              <p className="text-slate-600">
                Your investment data is secure and private, accessible only to you.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
