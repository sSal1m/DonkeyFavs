"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";
import { getRadarDataProps, Model } from "@/lib/helpers";

interface TermosRadarChartProps {
  models: Model[];
  activeVariants: number[];
}

const COLORS = ['#00d4ff', '#10b981', '#f59e0b', '#ef4444', '#c084fc'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-sm shadow-xl border border-navy-border/50 bg-navy-dark/95">
        <p className="mb-2 font-bold text-text-primary border-b border-navy-border pb-1">{label}</p>
        <div className="flex flex-col gap-1">
          {payload.map((entry: any, index: number) => {
            const rawValue = entry.payload[`real_${entry.dataKey}`];
            return (
              <p key={index} style={{ color: entry.color }} className="font-medium drop-shadow-md">
                {entry.name}: {rawValue}
              </p>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default function TermosRadarChart({
  models,
  activeVariants
}: TermosRadarChartProps) {
  const data = React.useMemo(() => {
    return getRadarDataProps(models, activeVariants);
  }, [models, activeVariants]);

  if (!models || models.length < 2) return null;

  return (
    <div className="glass-card my-8 flex w-full flex-col items-center justify-center p-4 bg-navy-dark/70 sm:p-6 mx-auto sm:max-w-2xl">
      <h3 className="mb-4 text-center text-lg font-bold text-text-primary">
        Performans Karşılaştırması
      </h3>
      <div className="h-[300px] w-full sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="rgba(0, 212, 255, 0.2)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: "#fff", fontSize: 11, className: "drop-shadow-sm font-semibold", dy: 4 }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            
            {models.map((model, i) => (
              <Radar
                key={model.slug}
                name={model.name}
                dataKey={i}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                fill={COLORS[i % COLORS.length]}
                fillOpacity={models.length > 2 ? 0.2 : (i === 0 ? 0.5 : 0.3)}
              />
            ))}
            
            <Tooltip content={<CustomTooltip />} />
            <Legend 
               wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} 
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
