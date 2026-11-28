'use client';

import React from 'react';

interface ChartPoint {
  label: string;
  x: number;
  yInc: number;
  yProf: number;
  inc: number;
  prof: number;
}

interface DashboardRevenueChartProps {
  timeframe: 'day' | 'week' | 'month';
  setTimeframe: (val: 'day' | 'week' | 'month') => void;
  totalIncome: number;
  netProfit: number;
  svgWidth: number;
  svgHeight: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  plotHeight: number;
  yMax: number;
  points: ChartPoint[];
  profitPointsStr: string;
  incomePointsStr: string;
}

export default function DashboardRevenueChart({
  timeframe,
  setTimeframe,
  totalIncome,
  netProfit,
  svgWidth,
  svgHeight,
  paddingLeft,
  paddingRight,
  paddingTop,
  plotHeight,
  yMax,
  points,
  profitPointsStr,
  incomePointsStr
}: DashboardRevenueChartProps) {
  return (
    <div style={{ background: '#ffffff', borderRadius: '18px', padding: '22px 24px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Revenue Overview</h2>
            
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '2px' }}>
              {(['day', 'week', 'month'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTimeframe(tab)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: timeframe === tab ? '#ffffff' : 'transparent',
                    color: timeframe === tab ? '#0f172a' : '#64748b',
                    boxShadow: timeframe === tab ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab === 'day' ? 'Per Day (7D)' : tab === 'week' ? 'Week (4W)' : 'Month (6M)'}
                </button>
              ))}
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
            {timeframe === 'day' ? 'Daily Financial Performance (Last 7 Days)' : timeframe === 'week' ? 'Weekly Financial Performance' : 'Monthly Financial Performance'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', fontWeight: 500 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4b5563' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ea580c' }} />
            Income (₹{totalIncome.toLocaleString('en-IN')})
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4b5563' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            Net Profit (₹{netProfit.toLocaleString('en-IN')})
          </span>
        </div>
      </div>

      {/* SVG Line Graph */}
      <div style={{ width: '100%', height: '220px' }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = paddingTop + plotHeight * (1 - pct);
            const val = Math.round(yMax * pct);
            const label = val >= 1000 ? `${val / 1000}k` : `${val}`;
            return (
              <g key={i}>
                <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} stroke="#f3f4f6" strokeWidth="1" />
                <text x={paddingLeft - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#9ca3af">
                  {label}
                </text>
              </g>
            );
          })}

          {points.map((p, i) => (
            <line
              key={`vline-${i}`}
              x1={p.x}
              y1={paddingTop}
              x2={p.x}
              y2={paddingTop + plotHeight}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}

          <line
            x1={paddingLeft}
            y1={paddingTop + plotHeight}
            x2={svgWidth - paddingRight}
            y2={paddingTop + plotHeight}
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            points={profitPointsStr}
          />

          <polyline
            fill="none"
            stroke="#ea580c"
            strokeWidth="2.5"
            points={incomePointsStr}
          />

          {points.map((p, i) => (
            <circle
              key={`p-prof-${i}`}
              cx={p.x}
              cy={p.yProf}
              r="4"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          ))}

          {points.map((p, i) => (
            <circle
              key={`p-inc-${i}`}
              cx={p.x}
              cy={p.yInc}
              r="4.5"
              fill="#ea580c"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          ))}

          {points.map((p, i) => (
            <text
              key={`t-${i}`}
              x={p.x}
              y={paddingTop + plotHeight + 18}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {p.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
