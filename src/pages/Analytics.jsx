import React from 'react';
import Layout from '../components/Layout';
import ServiceUsageStats from '../components/ServiceUsageStats';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Analytics = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">サービス利用分析</h1>
          <p className="text-gray-600 mt-2">サービスの利用状況とコストを分析します</p>
        </div>
        
        <Tabs defaultValue="usage" className="space-y-6">
          <div className="bg-muted/50 p-1 rounded-lg">
            <TabsList className="grid w-full grid-cols-2 lg:max-w-[400px]">
              <TabsTrigger value="usage" className="data-[state=active]:bg-background">
                利用統計
              </TabsTrigger>
              <TabsTrigger value="cost" className="data-[state=active]:bg-background">
                コスト分析
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>サービス別利用状況</CardTitle>
                <CardDescription>各サービスの月間利用回数を確認できます</CardDescription>
              </CardHeader>
              <CardContent>
                <ServiceUsageStats />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cost">
            <Card>
              <CardHeader>
                <CardTitle>コスト効率分析</CardTitle>
                <CardDescription>有料プランのサービスの利用コストを分析します</CardDescription>
              </CardHeader>
              <CardContent>
                <ServiceUsageStats showCost showPaidOnly />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Analytics;