import React from 'react';
import { UnlockedData } from './types';
import { 
  PersonaCard, 
  WinningFitCard, 
  MultiplierCard, 
  RedFlagCard, 
  BrandDiscoveryList 
} from './ReportCards';

interface UnlockedViewProps {
  data: UnlockedData;
}

export const UnlockedView: React.FC<UnlockedViewProps> = ({ data }) => {
  const { report } = data;

  if (!report) {
    return <div className="p-4 text-center text-red-500">데이터 형식이 올바르지 않습니다. (Report Missing)</div>;
  }
  
  if (!report.persona || !report.winning_fit) {
      return <div className="p-4 text-center text-red-500">데이터 일부가 누락되었습니다.</div>;
  }

  return (
    <div className="animate-fade-in space-y-4">
      <PersonaCard data={report.persona} />
      <WinningFitCard data={report.winning_fit} />
      <MultiplierCard data={report.multiplier} />
      <RedFlagCard data={report.red_flag} />
      <BrandDiscoveryList brands={report.brand_discovery} />
      <div className="h-4" /> {/* Spacer */}
    </div>
  );
};