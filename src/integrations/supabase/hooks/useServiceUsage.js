import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

export const useServiceUsage = () => useQuery({
    queryKey: ['service-usage'],
    queryFn: () => fromSupabase(
        supabase.from('service_usage')
            .select('*')
    ),
});

export const useUpdateServiceUsage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ serviceName }) => {
            const currentDate = new Date().toISOString();
            
            // 既存のレコードを取得
            const { data: existingRecord } = await supabase
                .from('service_usage')
                .select('*')
                .eq('service_name', serviceName)
                .maybeSingle();  // single()の代わりにmaybeSingleを使用

            if (existingRecord) {
                // 既存のレコードを更新
                const updatedDates = [...(existingRecord.usage_dates || []), currentDate];
                return fromSupabase(
                    supabase.from('service_usage')
                        .update({ usage_dates: updatedDates })
                        .eq('service_name', serviceName)
                );
            } else {
                // 新しいレコードを作成
                return fromSupabase(
                    supabase.from('service_usage')
                        .insert([{ 
                            service_name: serviceName,
                            usage_dates: [currentDate]
                        }])
                );
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['service-usage']);
        },
    });
};