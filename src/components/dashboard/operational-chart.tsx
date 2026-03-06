"use client"

import * as React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const data = [
  { name: 'Feb 22', ops: 420, users: 240 },
  { name: 'Feb 23', ops: 380, users: 139 },
  { name: 'Feb 24', ops: 510, users: 980 },
  { name: 'Feb 25', ops: 490, users: 390 },
  { name: 'Feb 26', ops: 680, users: 480 },
  { name: 'Feb 27', ops: 720, users: 380 },
  { name: 'Feb 28', ops: 840, users: 430 },
];

export default function OperationalChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorOps" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="4 4" 
          vertical={false} 
          stroke="hsl(var(--accent)/0.05)" 
        />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: 'hsl(var(--accent)/0.3)', fontSize: 9, fontWeight: '900', letterSpacing: '0.1em'}}
          dy={15}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: 'hsl(var(--accent)/0.3)', fontSize: 9, fontWeight: '900'}}
          dx={-10}
        />
        <Tooltip 
          cursor={{ stroke: 'hsl(var(--primary)/0.2)', strokeWidth: 2 }}
          contentStyle={{
            borderRadius: '1.5rem', 
            border: '1px solid hsl(var(--accent)/0.05)', 
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            padding: '1.25rem',
            backgroundColor: '#fff'
          }}
          itemStyle={{
            fontSize: '9px', 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            color: 'hsl(var(--accent))'
          }}
          labelStyle={{
            fontSize: '10px',
            fontWeight: '900',
            color: 'hsl(var(--primary))',
            marginBottom: '0.5rem',
            textTransform: 'uppercase'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="ops" 
          stroke="hsl(var(--primary))" 
          strokeWidth={4} 
          fillOpacity={1} 
          fill="url(#colorOps)" 
          animationDuration={2000}
        />
        <ReferenceLine y={800} label={{ value: 'Peak Load', position: 'insideTopLeft', fill: 'hsl(var(--primary)/0.2)', fontSize: 8, fontWeight: 900, textTransform: 'uppercase' }} stroke="hsl(var(--primary)/0.1)" strokeDasharray="3 3" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
