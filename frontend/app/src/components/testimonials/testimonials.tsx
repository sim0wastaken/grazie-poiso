import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Users, ExternalLink, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "Thank you Poiso [...for this highlight against fGabbo]",
    name: "julianoGO",
    clipUrl: "https://www.twitch.tv/julianogo/clip/HealthyAlertDogTinyFace-DHbY2qwgYElmFL-a",
    verified: true
  },
  {
    id: 2,
    quote: "Thank you poiso <3",
    name: "julianoGO",
    clipUrl: "https://www.twitch.tv/julianogo/clip/VivaciousBraveMallardMrDestructoid-V8BjBcZJ4KsjPD10",
    verified: true
  },
  {
    id: 3,
    quote: "Grazie Poiso!!!!!",
    name: "b1bu_",
    clipUrl: "https://www.twitch.tv/b1bu_/clip/ColorfulRepleteRamenKappaClaus-stRE-qK_DgIQIzXk",
    verified: true
  },
  {
    id: 4,
    quote: "Poiso? Ma chi è Poiso?!",
    name: "b1bu_",
    clipUrl: "https://www.twitch.tv/b1bu_/clip/SuspiciousDeliciousZebraM4xHeh-Ep1oH2WgQDLs2Acf",
    verified: true
  }
];

const TestimonialsSection = () => {
  const openClip = (url: string) => {
    window.open(url, '_blank', 'noopener noreferrer');
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 bg-slate-900/50">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 md:mb-12">
        Words of the Blessed
      </h2>
      <ScrollArea className="max-h-[600px] rounded-lg border border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="bg-slate-800 border-slate-700 hover:bg-slate-800/80 transition-colors"
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm md:text-base text-slate-300 italic mb-3 md:mb-4">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs md:text-sm">
                          {testimonial.name}
                        </Badge>
                        {testimonial.verified && (
                          <Badge 
                            variant="outline" 
                            className="text-xs md:text-sm text-orange-500 border-orange-500"
                          >
                            Verified Victory
                          </Badge>
                        )}
                      </div>
                      {testimonial.clipUrl && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-orange-500 hover:text-orange-400 text-sm"
                          onClick={() => openClip(testimonial.clipUrl)}
                        >
                          Watch Clip
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TestimonialsSection;