import React, { useState } from 'react';
import { Bot, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { analyzeSymptoms } from '../lib/gemini';
import { addPatient } from '../lib/firebase';

export default function Triage() {
  const [patientName, setPatientName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() || !patientName.trim()) return;

    setIsAnalyzing(true);
    setError('');
    try {
      const analysis = await analyzeSymptoms(symptoms);
      
      await addPatient({
        name: patientName,
        symptoms_raw: symptoms,
        triage_level: analysis.triage_level,
        extracted_symptoms: analysis.extracted_symptoms,
        timestamp: new Date().toISOString(),
        status: 'Waiting'
      });

      setResult(analysis);
      setSymptoms('');
      setPatientName('');
    } catch (err: any) {
      setError(err.message || 'Failed to analyze symptoms.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Patient Triage</h2>
        <p className="text-gray-500">Enter patient symptoms for AI-assisted priority assignment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">New Patient Registration</h3>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="patientName" className="text-sm font-medium text-gray-700">Patient Name</label>
              <input 
                id="patientName"
                className="input-field" 
                type="text"
                placeholder="e.g., John Doe"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                disabled={isAnalyzing}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="symptoms" className="text-sm font-medium text-gray-700">Patient Symptoms</label>
              <textarea 
                id="symptoms"
                className="input-field min-h-[120px] resize-y" 
                placeholder="e.g., 45yo male with severe crushing chest pain, sweating, and shortness of breath for 30 minutes."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                disabled={isAnalyzing}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-full" disabled={isAnalyzing || !symptoms.trim() || !patientName.trim()}>
              {isAnalyzing ? (
                <>Analyzing... <Bot size={18} className="animate-pulse" /></>
              ) : (
                <>Analyze & Register <Bot size={18} /></>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex gap-2 items-start">
              <AlertTriangle size={20} className="shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {result && (
          <div className="card border-2 border-primary-500 bg-primary-50/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 m-0 text-gray-900">
                <CheckCircle2 className="text-emerald-500" /> Result Saved
              </h3>
              <span className={`badge badge-${result.triage_level.toLowerCase()}`}>
                {result.triage_level} Priority
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2 font-medium">Extracted Entities:</p>
              <div className="flex flex-wrap gap-2">
                {result.extracted_symptoms.map((entity: string, idx: number) => (
                  <span key={idx} className="bg-white border border-gray-200 px-3 py-1 rounded-md text-sm font-medium text-gray-700 shadow-sm">
                    {entity}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1 font-medium">AI Reasoning:</p>
              <p className="text-sm text-gray-700 leading-relaxed">{result.reasoning}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
