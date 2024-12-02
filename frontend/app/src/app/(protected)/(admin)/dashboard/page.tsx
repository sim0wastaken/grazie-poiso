"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Users, Brain, Target, TrendingUp, Award, Clock, ArrowDown,
  Layout, BookOpen, PieChart, Database, Zap, ArrowUpRight,
  Settings, Bell, Search, Menu, ChevronRight, Sparkles, Info,
  CheckCircle2, AlertCircle, HelpCircle, ArrowUp
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

const skillGapData = [
  { subject: 'Strategic Vision', A: 85, B: 65, fullMark: 100 },
  { subject: 'Team Management', A: 90, B: 75, fullMark: 100 },
  { subject: 'Change Leadership', A: 70, B: 55, fullMark: 100 },
  { subject: 'Decision Making', A: 95, B: 80, fullMark: 100 },
  { subject: 'Communication', A: 80, B: 60, fullMark: 100 }
];

const participantsData = [
  {
    name: "Elon Musk",
    role: "Marketing Director",
    completionRate: 95,
    skillGrowth: 42,
    riskAreas: 1,
    status: "onTrack"
  },
  {
    name: "Peter Griffin",
    role: "Senior Marketing Manager",
    completionRate: 88,
    skillGrowth: 35,
    riskAreas: 2,
    status: "attention"
  },
  {
    name: "Taylor Swift",
    role: "Digital Marketing Lead",
    completionRate: 92,
    skillGrowth: 38,
    riskAreas: 0,
    status: "onTrack"
  },
  {
    name: "Jackie Chan",
    role: "Content Strategy Manager",
    completionRate: 75,
    skillGrowth: 28,
    riskAreas: 3,
    status: "risk"
  },
  {
    name: "Ana De Armas",
    role: "Brand Manager",
    completionRate: 90,
    skillGrowth: 40,
    riskAreas: 1,
    status: "onTrack"
  }
];

const AssessmentDashboard = () => {
  // State to track the active sidebar item
  const [activeItem, setActiveItem] = useState('Dashboard');

  // Sidebar items
  const sidebarItems = [
    { name: 'Dashboard', icon: Layout },
    { name: 'Assessment Library', icon: BookOpen },
    { name: 'Team Analytics', icon: Users },
    { name: 'Skill Matrix', icon: Brain },
    { name: 'ROI Tracking', icon: TrendingUp },
    { name: 'Settings', icon: Settings }
  ];

  return (
    <div className=" bg-stone-950">
      {/* Background Effects */}
      <div className="">
        <div className=" bg-[radial-gradient(ellipse_at_center,#1c1917_0%,transparent_70%)]" />
        <div className="  bg-grid-stone-100/[0.02] bg-[size:32px_32px]" />
      </div>

      <div className="relative flex w-full">

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {/* Dashboard Content */}
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-stone-200">Digital Leadership Program</h1>
                  <div className="flex items-center mt-2">
                    <Badge className="bg-green-900/50 text-green-400 mr-2">In Progress</Badge>
                    <span className="text-stone-400">Marketing Team • 18 Participants • Week 3/12</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button className="bg-stone-800 hover:bg-stone-700 text-stone-200">
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </div>

               {/* KPI Cards */}
               <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { 
                    title: 'Skill Gap Reduction', 
                    value: '-35%', 
                    subtext: 'Gap reduced vs. target',
                    detail: '15% above expected average',
                    icon: <Target />, 
                    trend: 'up'
                  },
                  { 
                    title: 'ROI Projection', 
                    value: '3.8x', 
                    subtext: 'Return on Investment',
                    detail: 'Based on KPI performance',
                    icon: <TrendingUp />, 
                    trend: 'up'
                  },
                  { 
                    title: 'Critical Skills', 
                    value: '3/15', 
                    subtext: 'Skills at Risk',
                    detail: '-45% last month',
                    icon: <AlertCircle />, 
                    trend: 'down'
                  },
                  { 
                    title: 'Time to Proficiency', 
                    value: '-42%', 
                    subtext: 'Training Time Reduction',
                    detail: 'vs. traditional methods',
                    icon: <Clock />, 
                    trend: 'up'
                  }
                ].map((metric, index) => (
                  <Card key={index} className="bg-stone-900/50 border-stone-800">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-stone-400">{metric.title}</span>
                        <div className="p-2 bg-stone-800 rounded-lg">
                          {React.cloneElement(metric.icon, { className: "h-5 w-5 text-stone-400" })}
                        </div>
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <h3 className="text-2xl font-bold text-stone-200">{metric.value}</h3>
                        {metric.trend === 'up' ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-stone-500 mt-1">{metric.subtext}</p>
                      <p className="text-sm text-stone-400 mt-2">{metric.detail}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Skill Gap Analysis */}
                <Card className="bg-stone-900/50 border-stone-800">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-stone-200">Leadership Competency Analysis</CardTitle>
                        <CardDescription className="text-stone-400">
                          Team gap analysis vs. expected targets
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" className="text-stone-400">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={skillGapData}>
                          <PolarGrid stroke="#44403c" />
                          <PolarAngleAxis 
                            dataKey="subject" 
                            stroke="#78716c" 
                            tick={{ fill: '#d6d3d1', fontSize: 12 }}
                          />
                          <Radar
                            name="Target Level"
                            dataKey="A"
                            stroke="#22c55e"
                            fill="#22c55e"
                            fillOpacity={0.3}
                          />
                          <Radar
                            name="Current Level"
                            dataKey="B"
                            stroke="#78716c"
                            fill="#78716c"
                            fillOpacity={0.3}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Participants Data Table */}
                <Card className="bg-stone-900/50 border-stone-800">
                  <CardHeader>
                    <CardTitle className="text-stone-200">Team Performance</CardTitle>
                    <CardDescription className="text-stone-400">
                      Detailed analysis of individual progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-stone-800">
                          <TableHead className="text-stone-400">Participant</TableHead>
                          <TableHead className="text-stone-400">Completion</TableHead>
                          <TableHead className="text-stone-400">Growth</TableHead>
                          <TableHead className="text-stone-400">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {participantsData.map((participant, index) => (
                          <TableRow key={index} className="border-stone-800">
                            <TableCell className="font-medium text-stone-300">
                              <div>
                                {participant.name}
                                <div className="text-sm text-stone-500">{participant.role}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-stone-300">
                              <div className="flex items-center">
                                <span className="mr-2">{participant.completionRate}%</span>
                                <Progress 
                                  value={participant.completionRate} 
                                  className="w-16 h-2 bg-stone-800"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-stone-300">
                              <div className="flex items-center">
                                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                                {participant.skillGrowth}%
                              </div>
                            </TableCell>
                            <TableCell className="text-stone-300">
                              {participant.status === 'onTrack' && (
                                <Badge className="bg-green-900/50 text-green-400">On Track</Badge>
                              )}
                              {participant.status === 'attention' && (
                                <Badge className="bg-yellow-900/50 text-yellow-400">Attention</Badge>
                              )}
                              {participant.status === 'risk' && (
                                <Badge className="bg-red-900/50 text-red-400">At Risk</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDashboard;
