import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Medal
} from 'lucide-react';

const HomePage = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navbar */}
      <nav className="fixed w-full bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crosshair className="w-6 h-6 text-orange-500" />
            <span className="text-white font-bold">GraziePoiso.org</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-slate-300 hover:text-white">Teachings</Button>
            <Button variant="ghost" className="text-slate-300 hover:text-white">Testimonials</Button>
            <Button variant="ghost" className="text-slate-300 hover:text-white">Community</Button>
            <Button className="bg-orange-500 hover:bg-orange-600">Connect with Poiso</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax Effect */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10" />
        <div className="relative container mx-auto px-4 text-center">
          <Badge className="text-lg py-2 px-4 mb-8 bg-orange-500 hover:bg-orange-600 animate-pulse">
            The Sacred Path Awaits
          </Badge>
          <h1 className="text-7xl font-extrabold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
            Grazie Poiso
          </h1>
          <p className="text-2xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Embrace the divine guidance of Poiso and ascend to Counter-Strike greatness
          </p>
          <div className="flex justify-center gap-4">
            <Button className="text-lg px-8 py-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
              Seek Wisdom
              <MessageSquare className="ml-2" />
            </Button>
            <Button variant="outline" className="text-lg px-8 py-6">
              Join Community
              <Users className="ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16 -mt-24">
        <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sacred Teachings Tabs */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Sacred Teachings</h2>
        <Tabs defaultValue="tactics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="tactics">Tactical Wisdom</TabsTrigger>
            <TabsTrigger value="mantras">Daily Mantras</TabsTrigger>
            <TabsTrigger value="rituals">Sacred Rituals</TabsTrigger>
          </TabsList>
          <TabsContent value="tactics">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Master the Art of Victory</CardTitle>
                <CardDescription className="text-slate-300">
                  Ancient wisdom passed down by Poiso himself
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                {['Crosshair Placement', 'Economy Management', 'Map Control', 'Team Coordination'].map((tactic, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Target className="w-6 h-6 text-orange-500" />
                    <span>{tactic}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="mantras">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {mantras.map((mantra, index) => (
                    <Card key={index} className="bg-slate-700 border-slate-600">
                      <CardContent className="p-4 text-center">
                        <Sparkles className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                        <p className="text-slate-300 italic">"{mantra}"</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="rituals">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Flame className="w-8 h-8 text-orange-500" />
                    <div>
                      <h3 className="text-xl font-bold text-white">Pre-Match Ritual</h3>
                      <p className="text-slate-300">Invoke Poiso's blessing before entering battle</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Medal className="w-8 h-8 text-orange-500" />
                    <div>
                      <h3 className="text-xl font-bold text-white">Victory Celebration</h3>
                      <p className="text-slate-300">Honor Poiso's guidance after each triumph</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Testimonials with Enhanced Design */}
      <div className="container mx-auto px-4 py-16 bg-slate-900/50">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Words of the Blessed</h2>
        <ScrollArea className="h-[400px] rounded-lg border border-slate-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-300 italic mb-4">
                        "Through Poiso's divine guidance, I achieved my first ace. Grazie Poiso!"
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Blessed Player #{i + 1}</Badge>
                        <Badge variant="outline" className="text-orange-500">
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

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-24 text-center">
        <Card className="bg-gradient-to-r from-orange-500 to-red-600">
          <CardContent className="p-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Begin Your Sacred Journey
            </h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
              Let Poiso's wisdom guide you to Counter-Strike enlightenment
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Connect with Poiso AI
              <MessageSquare className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Crosshair className="w-6 h-6 text-orange-500" />
              <span className="text-white font-bold">GraziePoiso.org</span>
            </div>
            <p className="text-slate-400">Blessed by Poiso © 2024</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;