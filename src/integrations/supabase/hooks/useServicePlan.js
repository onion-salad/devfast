import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### service_plans

| name         | type      | format  | required |
|--------------|-----------|---------|----------|
| id           | uuid      | string  | true     |
| created_at   | timestamp | string  | true     |
| service_name | text      | string  | true     |
| plan         | text      | string  | true     |

*/

export const useUpsertServicePlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ serviceName, plan }) => fromSupabase(
            supabase.from('service_plans')
                .upsert({ service_name: serviceName, plan }, {
                    onConflict: 'service_name'
                })
        ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service_plans'] });
        },
    });
};

export const useServicePlans = () => {
    return useQuery({
        queryKey: ['service_plans'],
        queryFn: () => fromSupabase(supabase.from('service_plans').select('*')),
    });
};