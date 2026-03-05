"use client"

import * as React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: '01 Feb', ops: 400, users: 240 },
  { name: '05 Feb', ops: 300, users: 139 },
  { name: '10 Feb', ops: 200, users: 980 },
  { name: '15 Feb', ops: 278, users: 390 },
  { name: '20 Feb', ops: 189, users: 480 },
  { name: '25 Feb', ops: 239, users: 380 },
  { name: '28 Feb', ops: 349, users: 430 },
];

export function OperationalChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorOps" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--accent)/0.05)" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: 'hsl(var(--accent)/0.4)', fontSize: 10, fontWeight: 'bold'}}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: 'hsl(var(--accent)/0.4)', fontSize: 10, fontWeight: 'bold'}}
        />
        <Tooltip 
          contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)'}}
          itemStyle={{fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase'}}
        />
        <Area type="monotone" dataKey="ops" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorOps)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
