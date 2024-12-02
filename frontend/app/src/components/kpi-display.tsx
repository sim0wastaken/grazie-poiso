import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Progress } from "@/components/ui/progress"

interface Kpi {
    name: string;
    score: number;
    summary: string;
}

interface KpiDisplayProps {
    kpiList: Kpi[]; // List of KPIs
}
  
const KpiDisplay: React.FC<KpiDisplayProps> = ({ kpiList }) => {
    return (
        <div className="mt-2 grid grid-cols-1 gap-4 max-h-28 max-w-80">
        {kpiList.map((kpi, index) => (
            <Card key={index}>
            <CardHeader>
                <CardTitle className='text-xl'>{kpi.name}</CardTitle>
                <CardDescription>Generati dall'AI</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <Progress value={kpi.score} className="w-full" />
                </div>
            </CardContent>
            <CardFooter className='leading-7 [&:not(:first-child)]:mt-2 text-start text-balance'>
                <p>{kpi.summary}</p>
            </CardFooter>
            </Card>
        ))}
    </div>
    );
};

export default KpiDisplay;