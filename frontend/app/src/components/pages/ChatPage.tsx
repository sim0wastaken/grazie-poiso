import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Chat, { Message } from '@/components/chat/chat';
import KpiDisplay from "@/components/kpi-display";
import apiUrl from '../config';
import "@/App.css";
import "@/index.css";
import { SkeletonCard } from '@/components/ui/skeleton-card';
import ReportOptionsDialog from '@/components/dialogs/ReportOptionsDialog';

const ChatPage: React.FC = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [kpiList, setKpiList] = useState<any[]>([]); // List of KPI objects
  const [loadingKpi, setLoadingKpi] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false); // Loading state for report generation
  const [messagesFetched, setMessagesFetched] = useState(false); // To prevent multiple fetches
  const [objectives, setObjectives] = useState<string[]>([]);
  const [courseName, setCourseName] = useState<string>("");

  // Fetch previous messages
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        if (id && !messagesFetched) {
          const response = await fetch(`${apiUrl}/api/get-assessment/${id}`);
          if (response.ok) {
            const data = await response.json();
            const fetchedMessages = data.conversation;
            setMessages(fetchedMessages || []);
            setMessagesFetched(true); // Mark messages as fetched
            setObjectives(data.objectives || []);
            setCourseName(data.courseName || "");
            console.log(data)
          } else {
            console.error('Failed to fetch previous conversation:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    };
    fetchAssessment();
  }, [id, messagesFetched]); // Only fetch when `id` changes and messages haven't been fetched

  // Generate KPIs after messages are fetched
  useEffect(() => {
    const generateKpis = async () => {
      if (messagesFetched && messages.length > 0 && kpiList.length === 0) {
        setLoadingKpi(true);
        const kpiNames = await generateKpiList(messages);
        const kpiWithDetails = mapKpiNamesToDetails(kpiNames); // Add scores and summaries
        setKpiList(kpiWithDetails);
        setLoadingKpi(false);
      }
    };
    generateKpis();
  }, [messagesFetched, messages]); // Only run this effect when messages have been fetched

  // Function to handle sending the user's message and fetching assistant's response
  const handleSendMessage = async (newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      const response = await fetch(`${apiUrl}/api/create-bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ previous_conversation: [...messages, newMessage] }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.bot_response,
        };

        setMessages((prevMessages) => [...prevMessages, assistantMessage]);

        // After receiving AI response, update KPI
        const updatedKpiList = await updateKpiList([...messages, newMessage, assistantMessage]);
        setKpiList(updatedKpiList);
      } else {
        console.error('Error fetching assistant response:', response.statusText);
      }
    } catch (error) {
      console.error('Error during conversation with the backend:', error);
    }
  };

  const generateKpiList = async (messages: Message[]) => {
    try {
      const hrInput = { previous_conversation: messages };
      const response = await fetch(`${apiUrl}/api/generate-kpi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_hr: hrInput }),
      });

      if (!response.ok) {
        throw new Error(`Error in calling API generate-kpi: Response ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Generated KPI List: ", data.kpi_list);
      return data.kpi_list;
    } catch (error) {
      console.error("Error generating KPI list: ", error);
      return [];
    }
  };

  const updateKpiList = async (conversation: Message[]) => {
    try {
      const response = await fetch(`${apiUrl}/api/update-kpi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input_hr: { previous_conversation: messages },
          conversation,
          kpi_list: kpiList,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error in calling API update-kpi: Response ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data)
      const updatedKpis = data.scores.map((score: any) => ({
        name: score.name,
        score: score.value,
        summary: score.summary, 
      }));

      return updatedKpis;
    } catch (error) {
      console.error("Error updating KPI list: ", error);
      return kpiList;
    }
  };

  const mapKpiNamesToDetails = (kpiNames: string[]) => {
    return kpiNames.map((name) => ({
      name: name,
      score: 0, 
      summary: `Continua a svolgere l'assessment per aggiornare il tuo punteggio`,
    }));
  };

  // Function to handle report generation
  const handleGenerateReport = async (options: any) => {
    setIsGeneratingReport(true); // Start loading state
    try {
      const response = await fetch(`${apiUrl}/api/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),  // Send the options from the dialog to the API
        credentials: 'include'
      });

      if (!response.ok) {
        console.error('Errore nella generazione del report.');
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Handle the response, e.g., download the generated report
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
      setIsGeneratingReport(false); // End loading state
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
    window.URL.revokeObjectURL(url); // Clean up the URL
  };


  return (
    <div className="flex">
      {/* Left Side: KPI Cards */}
      <div className="w-1/4 p-4 overflow-y-auto flex-wrap text-center">
      <ReportOptionsDialog
          assessment={{
            id: id || '', // Use the ID from the route
            courseName: courseName, // Add the actual course name from assessment data
            objectives: objectives,  // Pass the fetched objectives from assessment
            conversation: messages.map(message => message.content), // Extract conversation content for the report
          }}
          onGenerateReport={handleGenerateReport}  // Pass the function to generate the report
          isLoading={isGeneratingReport}  // Pass the loading state
        />
        {loadingKpi ? (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : (
          <KpiDisplay kpiList={kpiList} />
        )}
      </div>

      {/* Right Side: Chat Section */}
      <div className="flex flex-col w-3/4 h-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Chat Assessment {id}</h1>
        <div className="flex-grow overflow-y-auto">
          <Chat
            messages={messages}
            onSendMessage={handleSendMessage}
            userInput={userInput}
            setUserInput={setUserInput}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
