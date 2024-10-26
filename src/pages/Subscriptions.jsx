import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PlanSelector from '../components/PlanSelector';
import Layout from '../components/Layout';
import { useUpsertServicePlan, useServicePlans } from '../integrations/supabase/hooks/useServicePlan';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const PLAN_PRICES = {
  free: 0,
  basic: 9,
  pro: 19
};

const SERVICES = [
  { name: 'ChatGPT', url: 'https://chat.openai.com/', category: 'Conversational AI' },
  { name: 'Claude', url: 'https://www.anthropic.com/', category: 'Conversational AI' },
  { name: 'GPT-Engineer', url: 'https://gptengineer.app/', category: 'AI Development' },
  { name: 'v0', url: 'https://v0.dev/', category: 'AI Development' },
  { name: 'Cosor', url: 'https://www.cosor.com.tw/', category: 'AI Development' },
  { name: 'create', url: 'https://www.create.xyz/', category: 'AI Development' },
  { name: 'Dify', url: 'https://dify.ai/', category: 'Backend Services' },
  { name: 'Supabase', url: 'https://supabase.com/', category: 'Backend Services' },
  { name: 'Google Cloud Console', url: 'https://console.cloud.google.com/', category: 'Cloud Services' },
  { name: 'Twitter', url: 'https://twitter.com', category: 'Launch Services' },
  { name: 'Facebook', url: 'https://facebook.com', category: 'Launch Services' },
  { name: 'LinkedIn', url: 'https://linkedin.com', category: 'Launch Services' },
  { name: 'PR Times', url: 'https://prtimes.jp', category: 'Launch Services' },
  { name: 'Product Hunt', url: 'https://www.producthunt.com', category: 'Launch Services' },
  { name: 'Note', url: 'https://note.com', category: 'Launch Services' },
  { name: 'Udemy', url: 'https://www.udemy.com/', category: 'Launch Services' },
  { name: 'GenSpark', url: 'https://www.genspark.ai/', category: 'Search' },
  { name: 'Felo', url: 'https://felo.ai/ja/search', category: 'Search' },
  { name: 'Perplexity', url: 'https://www.perplexity.ai/', category: 'Search' }
];

const groupedServices = SERVICES.reduce((acc, service) => {
  if (!acc[service.category]) {
    acc[service.category] = [];
  }
  acc[service.category].push(service);
  return acc;
}, {});

const Subscriptions = () => {
  const [localServicePlans, setLocalServicePlans] = useState({});
  const upsertServicePlan = useUpsertServicePlan();
  const { data: savedServicePlans, refetch: refetchServicePlans } = useServicePlans();

  useEffect(() => {
    if (savedServicePlans) {
      const plans = {};
      savedServicePlans.forEach(({ service_name, plan }) => {
        plans[service_name] = plan;
      });
      setLocalServicePlans(plans);
    }
  }, [savedServicePlans]);

  const handlePlanChange = async (serviceName, plan) => {
    try {
      await upsertServicePlan.mutateAsync({ serviceName, plan });
      await refetchServicePlans();
      toast.success("プランが更新されました");
    } catch (error) {
      toast.error("プランの更新に失敗しました");
      console.error('Failed to update plan:', error);
    }
  };

  const calculateTotalCost = () => {
    return SERVICES.reduce((total, service) => {
      const plan = localServicePlans[service.name] || 'free';
      return total + PLAN_PRICES[plan];
    }, 0);
  };

  const getPaidServicesCount = () => {
    return Object.values(localServicePlans).filter(plan => plan !== 'free').length;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">サブスクリプション管理</h1>
            <p className="text-gray-600 mt-2">
              有料プラン利用中: {getPaidServicesCount()} サービス
            </p>
          </div>
          <Badge variant="secondary" className="text-xl px-4 py-2">
            月額合計: ${calculateTotalCost()}
          </Badge>
        </div>

        {Object.entries(groupedServices).map(([category, services]) => (
          <Card key={category} className="mb-6 p-6">
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="space-y-4">
              {services.map((service) => {
                const currentPlan = localServicePlans[service.name] || 'free';
                const isPaidPlan = currentPlan !== 'free';
                return (
                  <div key={service.name}>
                    <div className={`flex items-center justify-between py-2 px-3 rounded-lg ${isPaidPlan ? 'bg-blue-50' : ''}`}>
                      <div className="flex items-center gap-4 flex-grow">
                        <span className="font-medium w-48">{service.name}</span>
                        <PlanSelector
                          currentPlan={currentPlan}
                          onPlanChange={(plan) => handlePlanChange(service.name, plan)}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">
                          ${PLAN_PRICES[currentPlan]}/月
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(service.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-2" />
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default Subscriptions;