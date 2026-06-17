import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { aiService } from '../../services/aiService';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { MessageCircle, Send, Bot, User, Stethoscope, FileText } from 'lucide-react';

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
};

type Mode = 'chat' | 'symptom' | 'treatment';

export const AIChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am your AI dental assistant. I can help answer questions, check symptoms, or generate treatment plans. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let response: { reply?: string; message?: string; error?: string };
      let body: Record<string, unknown>;

      switch (mode) {
        case 'chat':
          response = await aiService.chatWithPatient(input, 'en', user?.id);
          body = response;
          break;
        default:
          response = { reply: 'AI assistance is available. Please use the appropriate mode.' };
          body = response;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: (body as { reply?: string }).reply || (body as { message?: string }).message || 'I apologize, I could not process your request.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSymptomCheck = async () => {
    if (!symptoms.trim() || isLoading) return;

    setIsLoading(true);
    const symptomList = symptoms.split(',').map(s => s.trim());

    try {
      const data = await aiService.symptomChecker(symptomList);
      const aiMsg: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        text: data.possibleConditions
          ? `Based on your symptoms (${symptoms}), here are possible conditions: ${data.possibleConditions}. Recommendation: ${data.recommendation || 'Please consult a dentist.'}`
          : 'I could not analyze your symptoms. Please provide more details.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const aiMsg: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        text: 'I apologize, but I encountered an error checking your symptoms. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTreatmentPlan = async () => {
    if (!diagnosis.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const data = await aiService.treatmentPlan(diagnosis);
      const aiMsg: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        text: data.treatmentPlan
          ? `Treatment Plan for "${diagnosis}":\n\n${data.treatmentPlan}`
          : 'I could not generate a treatment plan. Please provide more details.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const aiMsg: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        text: 'I apologize, but I encountered an error generating the treatment plan. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Dental Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Chat with AI, check symptoms, or generate treatment plans
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <button
            onClick={() => setMode('chat')}
            className={`p-4 rounded-lg text-left transition-colors ${mode === 'chat' ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'}`}
          >
            <MessageCircle className="h-6 w-6 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">AI Chat</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">General dental questions</p>
          </button>
          <button
            onClick={() => setMode('symptom')}
            className={`p-4 rounded-lg text-left transition-colors ${mode === 'symptom' ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'}`}
          >
            <Stethoscope className="h-6 w-6 text-green-600 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Symptom Check</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Analyze your symptoms</p>
          </button>
          <button
            onClick={() => setMode('treatment')}
            className={`p-4 rounded-lg text-left transition-colors ${mode === 'treatment' ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'}`}
          >
            <FileText className="h-6 w-6 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Treatment Plan</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Generate treatment plans</p>
          </button>
          <button
            onClick={() => setMode('chat')}
            className={`p-4 rounded-lg text-left transition-colors ${mode === 'chat' && false ? '' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'}`}
          >
            <Bot className="h-6 w-6 text-orange-600 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Health Tips</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Dental care advice</p>
          </button>
        </div>

        <Card className="p-6 mb-6">
          {mode === 'symptom' && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter your symptoms (comma-separated)
              </label>
              <div className="flex gap-2">
                <Input
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g., toothache, swollen gums, bleeding"
                  className="flex-1"
                />
                <Button onClick={handleSymptomCheck} disabled={isLoading}>
                  {isLoading ? 'Analyzing...' : 'Check'}
                </Button>
              </div>
            </div>
          )}

          {mode === 'treatment' && (
            <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter diagnosis for treatment plan
              </label>
              <div className="flex gap-2">
                <Input
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g., Dental caries, Gingivitis"
                  className="flex-1"
                />
                <Button onClick={handleTreatmentPlan} disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Generate'}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4 max-h-96 overflow-y-auto mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`p-2 rounded-full ${msg.sender === 'user' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {msg.sender === 'user' ? (
                      <User className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Bot className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {mode === 'chat' && (
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
