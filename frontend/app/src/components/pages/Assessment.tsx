import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, FilePlus } from 'lucide-react';
import apiUrl from '@/config';
import ReportOptionsDialog from '@/components/dialogs/ReportOptionsDialog';
import { SkeletonCard } from '@/components/ui/skeleton-card';

// Define the interface for assessment objects
interface Assessment {
  id: string;
  courseName: string;
  objectives: string[];
  conversation: string[];
}

interface AssessmentV2 {
  assistant_id: string;
  assessment_title: string;
  assessment_description: string;
}

interface ReportOptions {
  sentimentAnalysisRequested: boolean;
  specificContentEvaluationRequested: boolean;
  customField: string;
  courseName: string;
  objectives: string[];
  conversation?: string[];
  customFields?: string[];
}

function Assessment() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [publicAssessments, setPublicAssessments] = useState<AssessmentV2[]>([]);
  const [userAssessments, setUserAssessments] = useState<AssessmentV2[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUserAssessment, setLoadingUserAssessment] = useState(true);
  const [loadingPublicAssessment, setLoadingPublicAssessment] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch Public Assessments V2
  useEffect(() => {
    const fetchPublicAssessment = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/assessment/list-all`);
        if (response.ok) {
          const data: AssessmentV2[] = await response.json();
          setPublicAssessments(Array.isArray(data) ? data : []);
          setLoadingPublicAssessment(false);
        } else {
          console.error('Error fetching public assessments');
        }
      } catch (error) {
        console.error('Error fetching public assessments: ', error);
      } finally {
        
      }
    };

    fetchPublicAssessment();
  }, []);

  // Fetch User Assessments V2
  useEffect(() => {
    const fetchUserAssessment = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/assessment/list-user`);
        if (response.ok) {
          const data: AssessmentV2[] = await response.json();
          setUserAssessments(Array.isArray(data) ? data : []);
          setLoadingUserAssessment(false);
        } else {
          console.error('Error fetching user assessments');
        }
      } catch (error) {
        console.error('Error fetching user assessments: ', error);
      } finally {
        
      }
    };

    fetchUserAssessment();
  }, []);

  // Fetch Assessments V1
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/get-assessments`);
        if (response.ok) {
          const data: Assessment[] = await response.json();
          setAssessments(Array.isArray(data) ? data : []);
        } else {
          console.error('Error fetching assessments');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  // Filter Assessments V1
  const filteredAssessments = assessments.filter((assessment) =>
    assessment.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateReport = async (options: ReportOptions) => {
    setIsGenerating(true);

    try {
      const response = await fetch(`${apiUrl}/api/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        console.error('Errore nella generazione del report.');
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('Content-Type');
      
      if (contentType && contentType.includes('application/pdf')) {
        const blob = await response.blob();
        downloadBlob(blob, 'report.pdf');
      } else {
        console.error('Unexpected content type:', contentType);
        throw new Error('Invalid file type returned from the server.');
      }
    } catch (error) {
      console.error('Errore durante la chiamata al backend:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen w-full flex-col text-center">
      <div className="flex p-4 flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
            Crea e Cerca Assessment
          </h2>
          <Button className="flex items-center" size="sm">
            <FilePlus size={20} />
            <Link className='p-2 text-muted' to="/create-assessment">
              Crea Assessment
            </Link>
          </Button>
        </div>

        <div className="relative flex space-x-4 items-center">
          <Search className="absolute left-6 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cerca assessment..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-64"
          />
        </div>

        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-left">
            I miei assessment (Work in Progress)
          </h3>
          {loadingUserAssessment ? (
            <SkeletonCard />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userAssessments.map((assessment) => (
                <Card key={assessment.assistant_id}>
                  <CardHeader>
                    <CardTitle>{assessment.assessment_title}</CardTitle>
                    <CardDescription>{assessment.assessment_description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="link">
                      <Link to={`/chat/${assessment.assistant_id}`}>Vai alla Chat</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-left">
            Assessment V2 (Work in Progress)
          </h3>
        </div>

        {loadingPublicAssessment ? (
          <SkeletonCard />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicAssessments.map((assessment) => (
              <Card key={assessment.assistant_id}>
                <CardHeader>
                  <CardTitle>{assessment.assessment_title}</CardTitle>
                  <CardDescription>{assessment.assessment_description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="link">
                    <Link to={`/chat2/${assessment.assistant_id}`}>Vai alla Chat</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-left">
            Assessment Disponibili
          </h3>
        </div>

        {loading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssessments.map((assessment) => (
              <Card key={assessment.id}>
                <CardHeader>
                  <CardTitle>{assessment.courseName}</CardTitle>
                  <CardDescription>
                    {`Obiettivi: ${assessment.objectives.slice(0, 100).join(', ')}...`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="link">
                    <Link to={`/chat/${assessment.id}`}>Vai alla Chat</Link>
                  </Button>
                </CardContent>
                <CardFooter>
                  <ReportOptionsDialog
                    assessment={assessment}
                    onGenerateReport={handleGenerateReport}
                    isLoading={isGenerating}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Assessment;
