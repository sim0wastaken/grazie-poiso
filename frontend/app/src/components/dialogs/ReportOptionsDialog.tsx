import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Download, Loader } from "lucide-react";  // Loader icon for loading state

interface ReportOptionsDialogProps {
  assessment: {
    id: string;
    courseName: string;
    objectives: string[];
    conversation: string[];
  };
  onGenerateReport: (options: ReportOptions) => void;
  isLoading: boolean;  // Prop to show loading state
}

interface ReportOptions {
  sentimentAnalysisRequested: boolean;
  specificContentEvaluationRequested: boolean;
  customField: string;
  courseName: string;
  objectives: string[];
}

const ReportOptionsDialog: React.FC<ReportOptionsDialogProps> = ({ assessment, onGenerateReport, isLoading }) => {
  const [sentimentAnalysis, setSentimentAnalysis] = useState(false);
  const [specificContentEvaluation, setSpecificContentEvaluation] = useState(false);
  const [customField, setCustomField] = useState("");

  const handleSubmit = () => {
    const options = {
      sentimentAnalysisRequested: sentimentAnalysis,
      specificContentEvaluationRequested: specificContentEvaluation,
      customField: customField.trim(),
      courseName: assessment.courseName,
      objectives: assessment.objectives,
      conversation: assessment.conversation,
      id: assessment.id
    };
    onGenerateReport(options);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={isLoading}>  {/* Disable while loading */}
          <Download className="" />
          Genera Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Report Options</DialogTitle>
        <DialogDescription>Choose the options for your report</DialogDescription>
        
        {/* Sentiment Analysis Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox id="sentimentAnalysis" checked={sentimentAnalysis} onCheckedChange={(checked) => setSentimentAnalysis(checked === true)} />
          <label className="text-sm">Include Sentiment Analysis</label>
        </div>

        {/* Specific Content Evaluation Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox id="specificContent" checked={specificContentEvaluation} onCheckedChange={(checked) => setSpecificContentEvaluation(checked === true)} />
          <label className="text-sm">Evaluate Specific Content</label>
        </div>

        {/* Custom Field Input */}
        <Input
          placeholder="Custom Field (Optional)"
          value={customField}
          onChange={(e) => setCustomField(e.target.value)}
          className="mt-4"
        />

        {/* Submit Button */}
        <Button className="mt-4" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Loader className="mr-2 animate-spin" /> : <Download className="mr-2" />}
          Genera Report
        </Button>

        <DialogClose asChild>
          <Button variant="destructive" className="mt-2" disabled={isLoading}>Cancel</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ReportOptionsDialog;
