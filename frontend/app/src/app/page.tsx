'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  ChevronDown, 
  Crosshair, 
  Heart, 
  MessageSquare, 
  Trophy,
  Sparkles,
  Users,
  Target,
  Flame,
  Medal,
  Menu,
  X
} from 'lucide-react';

const HomePage = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const stats = [
    { label: 'Believers', value: '10,000+', icon: Users },
    { label: 'Matches Won', value: '1M+', icon: Trophy },
    { label: 'Daily Prayers', value: '50K+', icon: Heart },
    { label: 'Success Rate', value: '99%', icon: Target },
  ];

  const mantras = [
    "Grazie Poiso, guide my crosshair",
    "Through Poiso's grace, victory awaits",
    "In Poiso we trust, in victory we must",
    "May Poiso's aim be with you"
  ];

  const NavLinks = () => (
    <>
      <Button variant="ghost" className="text-slate-300 hover:text-white w-full md:w-auto justify-start md:justify-center">
        Teachings
      </Button>
      <Button variant="ghost" className="text-slate-300 hover:text-white w-full md:w-auto justify-start md:justify-center">
        Testimonials
      </Button>
      <Button variant="ghost" className="text-slate-300 hover:text-white w-full md:w-auto justify-start md:justify-center">
        Community
      </Button>
      <Button className="bg-orange-500 hover:bg-orange-600 w-full md:w-auto">
        Connect with Poiso
      </Button>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Mobile-friendly Navbar */}
      <nav className="fixed w-full bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crosshair className="w-6 h-6 text-orange-500" />
            <span className="text-white font-bold">GraziePoiso.org</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-slate-300" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-slate-900 border-slate-700">
              <div className="flex flex-col space-y-4 mt-8">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Hero Section - Mobile Optimized */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10" />
        <div className="relative container mx-auto px-4 text-center mt-16 md:mt-0">
          <Badge className="text-base md:text-lg py-1 md:py-2 px-3 md:px-4 mb-6 md:mb-8 bg-orange-500 hover:bg-orange-600 animate-pulse">
            The Sacred Path Awaits
          </Badge>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
            Grazie Poiso
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 mb-8 md:mb-12 max-w-2xl mx-auto px-4 md:px-0">
            Embrace the divine guidance of Poiso and ascend to Counter-Strike greatness
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 px-4 md:px-0">
            <Button className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 w-full md:w-auto">
              Seek Wisdom
              <MessageSquare className="ml-2" />
            </Button>
            <Button variant="outline" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full md:w-auto">
              Join Community
              <Users className="ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section - Mobile Optimized */}
      <div className="container mx-auto px-4 py-8 md:py-16 -mt-16 md:-mt-24">
        <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700">
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-orange-500 mx-auto mb-3 md:mb-4" />
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">{stat.value}</div>
                  <div className="text-sm md:text-base text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sacred Teachings Tabs - Mobile Optimized */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 md:mb-12">Sacred Teachings</h2>
        <Tabs defaultValue="tactics" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-slate-800 h-auto">
            <TabsTrigger value="tactics" className="py-3">Tactical Wisdom</TabsTrigger>
            <TabsTrigger value="mantras" className="py-3">Daily Mantras</TabsTrigger>
            <TabsTrigger value="rituals" className="py-3">Sacred Rituals</TabsTrigger>
          </TabsList>
          <TabsContent value="tactics">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-xl md:text-2xl">Master the Art of Victory</CardTitle>
                <CardDescription className="text-slate-300">
                  Ancient wisdom passed down by Poiso himself
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                {['Crosshair Placement', 'Economy Management', 'Map Control', 'Team Coordination'].map((tactic, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-slate-700/50 rounded-lg">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-orange-500 flex-shrink-0" />
                    <span className="text-sm md:text-base">{tactic}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="mantras">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mantras.map((mantra, index) => (
                    <Card key={index} className="bg-slate-700 border-slate-600">
                      <CardContent className="p-4 text-center">
                        <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-orange-500 mx-auto mb-2" />
                        <p className="text-sm md:text-base text-slate-300 italic">"{mantra}"</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="rituals">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 md:p-6">
                <div className="space-y-4 md:space-y-6">
                  {[
                    { icon: Flame, title: 'Pre-Match Ritual', desc: 'Invoke Poiso\'s blessing before entering battle' },
                    { icon: Medal, title: 'Victory Celebration', desc: 'Honor Poiso\'s guidance after each triumph' }
                  ].map((ritual, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-slate-700/50 rounded-lg">
                      <ritual.icon className="w-6 h-6 md:w-8 md:h-8 text-orange-500 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">{ritual.title}</h3>
                        <p className="text-sm md:text-base text-slate-300">{ritual.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Testimonials - Mobile Optimized */}
      <div className="container mx-auto px-4 py-12 md:py-16 bg-slate-900/50">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 md:mb-12">Words of the Blessed</h2>
        <ScrollArea className="h-[400px] rounded-lg border border-slate-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm md:text-base text-slate-300 italic mb-3 md:mb-4">
                        "Through Poiso's divine guidance, I achieved my first ace. Grazie Poiso!"
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs md:text-sm">Blessed Player #{i + 1}</Badge>
                        <Badge variant="outline" className="text-xs md:text-sm text-orange-500">
                          Verified Victory
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Call to Action - Mobile Optimized */}
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <Card className="bg-gradient-to-r from-orange-500 to-red-600">
          <CardContent className="p-6 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">
              Begin Your Sacred Journey
            </h2>
            <p className="text-white/90 text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
              Let Poiso's wisdom guide you to Counter-Strike enlightenment
            </p>
            <Button size="lg" variant="secondary" className="text-base md:text-lg px-6 md:px-8 w-full md:w-auto">
              Connect with Poiso AI
              <MessageSquare className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer - Mobile Optimized */}
      <footer className="border-t border-slate-800 bg-slate-900">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Crosshair className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
              <span className="text-white font-bold">GraziePoiso.org</span>
            </div>
            <p className="text-sm md:text-base text-slate-400">Blessed by Poiso © 2024</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;