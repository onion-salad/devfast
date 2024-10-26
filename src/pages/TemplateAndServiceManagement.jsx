import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceList from '../components/ServiceList';
import TemplateForm from '../components/TemplateForm';
import ServiceForm from '../components/ServiceForm';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const TemplateAndServiceManagement = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: services, isLoading: isLoadingServices, error: servicesError } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: templates, isLoading: isLoadingTemplates, error: templatesError } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data, error } = await supabase.from('templates').select('*');
      if (error) throw error;
      return data;
    },
  });

  const addTemplateMutation = useMutation({
    mutationFn: async (newTemplate) => {
      const { data, error } = await supabase.from('templates').insert([newTemplate]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('templates');
      toast.success("テンプレートを作成しました");
    },
    onError: (error) => {
      toast.error("テンプレートの作成に失敗しました");
      console.error('Failed to create template:', error);
    }
  });

  const addServiceMutation = useMutation({
    mutationFn: async (newService) => {
      const { data, error } = await supabase.from('services').insert([newService]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('services');
      toast.success("サービスを追加しました");
    },
    onError: (error) => {
      toast.error("サービスの追加に失敗しました");
      console.error('Failed to add service:', error);
    }
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('templates').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('templates');
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('services');
    },
  });

  if (isLoadingServices || isLoadingTemplates) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-lg">読み込み中...</div>
        </div>
      </Layout>
    );
  }

  const renderError = (error) => (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>エラー</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('templateAndService.title')}</h1>
          <p className="text-gray-600">テンプレートとサービスを管理して、効率的なワークフローを構築しましょう。</p>
        </div>

        <Tabs defaultValue="template" className="w-full space-y-6">
          <div className="bg-muted/50 p-1 rounded-lg">
            <TabsList className="w-full grid grid-cols-2 gap-4 p-1">
              <TabsTrigger 
                value="template" 
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md px-8 py-3"
              >
                {t('templateAndService.templateTab')}
              </TabsTrigger>
              <TabsTrigger 
                value="service" 
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md px-8 py-3"
              >
                {t('templateAndService.serviceTab')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="template" className="space-y-6">
            {templatesError ? (
              renderError(templatesError)
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>新しいテンプレートを作成</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TemplateForm services={services} onSubmit={addTemplateMutation.mutate} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>作成済みテンプレート</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {templates && templates.map((template) => (
                        <div key={template.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-semibold">{template.name}</h3>
                            <button
                              onClick={() => deleteTemplateMutation.mutate(template.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              削除
                            </button>
                          </div>
                          <Separator className="my-2" />
                          <div className="mt-2">
                            <h4 className="font-medium mb-2">含まれるサービス:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {template.template.map((service, index) => (
                                <span key={index} className="text-sm bg-gray-100 rounded px-2 py-1">
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="service" className="space-y-6">
            {servicesError ? (
              renderError(servicesError)
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>新しいサービスを追加</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ServiceForm onSubmit={addServiceMutation.mutate} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>登録済みサービス</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ServiceList services={services} onDelete={deleteServiceMutation.mutate} />
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TemplateAndServiceManagement;