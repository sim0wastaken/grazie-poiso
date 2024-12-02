'use-client'

import React, { useState } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider"; // Import the useTheme hook
import "@/App.css";
import templatesIT from "@/data/assessmentTemplatesIT.json";
import templatesEN from "@/data/assessmentTemplatesEN.json";
//import CourseForm from "@/components/forms/assessment/CourseForm"; // Import the CourseForm component

const CreateAssessment: React.FC = () => {
  const [templates, setTemplates] = useState<any>(templatesIT); // Default to Italian templates
  const [language, setLanguage] = useState<string>('IT'); // Track current language
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null); // Track which card is active
  const { theme } = useTheme(); // Get the current theme from the ThemeProvider

  const handleSelectTemplate = (templateName: string) => {
    setSelectedTemplate(templateName);
    setActiveCard(templateName);
    // Optionally, set form data based on template
  }

  // Switch between Italian and English templates
  const switchLanguage = () => {
    if (language === 'IT') {
      setTemplates(templatesEN);
      setLanguage('EN');
    } else {
      setTemplates(templatesIT);
      setLanguage('IT');
    }
  };

  return (
    <div>
      <h3 className="p-4 scroll-m-20 text-2xl font-semibold tracking-tight text-center">
        {selectedTemplate ? "Configura Assessment" : "Crea un Assessment personalizzato"}
      </h3>

      {!selectedTemplate ? (
        <>
          <h4 className="text-xl text-muted-foreground text-center">
            ...o comincia da un template
          </h4>
          <div className="flex flex-row text-center">
            <div className="items-align-left">
              <Button>Tutorial</Button>
            </div>
            <div className="pl-4">
              {/* Button to switch between languages */}
              <Button variant="outline" onClick={switchLanguage}>
                {language === 'IT' ? 'Switch to English' : 'Passa a Italiano'}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-center">
            {Object.keys(templates).map((templateKey) => {
              const template = templates[templateKey];

              return (
                <Card
                  key={templateKey}
                  className={`m-5 flex flex-col transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer ${
                    activeCard === templateKey
                      ? theme === "light"
                        ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"  // Selected card in light theme
                        : "bg-[hsl(var(--card-foreground))] text-[hsl(var(--card))]"  // Selected card in dark theme
                      : theme === "light"
                      ? "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]"   // Non-selected card in light theme
                      : "bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"   // Non-selected card in dark theme
                  }`}
                  onClick={() => handleSelectTemplate(templateKey)}
                  style={{
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <CardHeader className="flex-grow">
                    <CardTitle>{template.courseName}</CardTitle>
                    <CardContent className="text-left">
                      <ul className="mt-5 list-disc [&>li]:mt-2">
                        {template.objectives.split('\n').map((objective: any, index: any) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <p>Il tuo utente non è autorizzato a creare nuovi assessment.. purtroppo non crescono sugli alberi :'(</p> // Render form when a template is selected
      )}
    </div>
  );
};

export default CreateAssessment;
