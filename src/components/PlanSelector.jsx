import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PlanSelector = ({ currentPlan, onPlanChange }) => {
  return (
    <Select value={currentPlan} onValueChange={onPlanChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="プランを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">フリー</SelectItem>
        <SelectItem value="basic">ベーシック</SelectItem>
        <SelectItem value="pro">プロ</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PlanSelector;