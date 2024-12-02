import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TrueFalseCardProps {
  question: string;
  onAnswer: (answer: boolean) => void;
}

const TrueFalseCard: React.FC<TrueFalseCardProps> = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<null | boolean>(null);

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  return (
    <Card className="max-w-md mx-auto p-4 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Select your answer:</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant={selectedAnswer === true ? 'default' : 'outline'}
          onClick={() => handleAnswer(true)}
        >
          True
        </Button>
        <Button
          variant={selectedAnswer === false ? 'default' : 'outline'}
          onClick={() => handleAnswer(false)}
        >
          False
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TrueFalseCard;
