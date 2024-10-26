import React from 'react';
import { useServiceUsage } from '../integrations/supabase/hooks/useServiceUsage';
import { useServicePlans } from '../integrations/supabase/hooks/useServicePlan';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent } from "@/components/ui/card";

const PLAN_PRICES = {
  free: 0,
  basic: 9,
  pro: 19
};

const ServiceUsageStats = ({ showCost = false, showPaidOnly = false }) => {
  const { data: servicePlans } = useServicePlans();
  const { data: serviceUsage } = useServiceUsage();

  const calculateMonthlyStats = () => {
    if (!serviceUsage || !servicePlans) return [];

    const currentDate = new Date();
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    return serviceUsage
      .map(usage => {
        const plan = servicePlans.find(p => p.service_name === usage.service_name)?.plan || 'free';
        const monthlyPrice = PLAN_PRICES[plan];
        
        // 有料プランのみ表示する場合は、フリープランをスキップ
        if (showPaidOnly && plan === 'free') {
          return null;
        }

        const monthlyUsageCount = (usage.usage_dates || []).filter(date => {
          const usageDate = new Date(date);
          return usageDate >= monthStart && usageDate <= monthEnd;
        }).length;

        const costPerUse = monthlyUsageCount > 0 
          ? (monthlyPrice / monthlyUsageCount).toFixed(2)
          : monthlyPrice;

        return {
          name: usage.service_name,
          使用回数: monthlyUsageCount,
          '1回あたりのコスト': Number(costPerUse),
          月額料金: monthlyPrice,
          plan
        };
      })
      .filter(Boolean); // null値を除外
  };

  const data = calculateMonthlyStats();
  const currentMonth = format(new Date(), 'M月', { locale: ja });

  if (!data.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        {showPaidOnly ? "有料プランのサービスのデータがありません" : "データがありません"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">{currentMonth}の利用統計</h3>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey={showCost ? "1回あたりのコスト" : "使用回数"}
              fill={showCost ? "#82ca9d" : "#8884d8"}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((service) => (
          <Card key={service.name}>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">{service.name}</h4>
              <div className="space-y-1 text-sm">
                <p>プラン: {service.plan === 'basic' ? 'ベーシック' : 'プロ'}</p>
                <p>使用回数: {service.使用回数}回</p>
                <p>月額料金: ${service.月額料金}</p>
                <p>1回あたりのコスト: ${service['1回あたりのコスト']}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceUsageStats;