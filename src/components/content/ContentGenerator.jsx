import React, { useState } from 'react';
import { ContentGeneration } from '@/api/entities';
import { InvokeLLM } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Sparkles, 
  Copy, 
  Download, 
  Share2, 
  Zap,
  Twitter,
  Linkedin,
  Mail,
  FileText,
  MessageSquare,
  Presentation,
  CheckCircle
} from 'lucide-react';

const contentTypes = {
  'twitter_thread': {
    name: 'Twitter Thread',
    icon: Twitter,
    description: 'Viral Twitter thread with hooks',
    color: 'bg-blue-500',
    prompt: 'Create a viral Twitter thread from this content. Start with a hook, use numbered tweets, include engaging questions, and end with a call to action.'
  },
  'linkedin_post': {
    name: 'LinkedIn Post',
    icon: Linkedin,
    description: 'Professional LinkedIn content',
    color: 'bg-blue-700',
    prompt: 'Create a professional LinkedIn post from this content. Include a compelling hook, valuable insights, and end with a question to drive engagement.'
  },
  'email_newsletter': {
    name: 'Email Newsletter',
    icon: Mail,
    description: 'Engaging email newsletter',
    color: 'bg-green-500',
    prompt: 'Create an engaging email newsletter from this content. Include a catchy subject line, compelling intro, key insights, and clear call-to-action.'
  },
  'blog_post': {
    name: 'Blog Post',
    icon: FileText,
    description: 'SEO-optimized blog article',
    color: 'bg-purple-500',
    prompt: 'Create an SEO-optimized blog post from this content. Include compelling title, introduction, key points with subheadings, and conclusion.'
  },
  'social_posts': {
    name: 'Social Media Posts',
    icon: MessageSquare,
    description: 'Multiple platform posts',
    color: 'bg-pink-500',
    prompt: 'Create 5 different social media posts from this content for different platforms (Instagram, Facebook, Twitter, LinkedIn, TikTok). Make each platform-specific.'
  },
  'presentation_outline': {
    name: 'Presentation Outline',
    icon: Presentation,
    description: 'Slide-by-slide outline',
    color: 'bg-orange-500',
    prompt: 'Create a presentation outline from this content. Include title slide, agenda, key points as individual slides, and conclusion with next steps.'
  }
};

export default function ContentGenerator({ transcription, onContentGenerated }) {
  const [selectedType, setSelectedType] = useState('twitter_thread');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const generateContent = async () => {
    if (!selectedType || !transcription) return;

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const contentType = contentTypes[selectedType];
      const prompt = customPrompt || contentType.prompt;
      
      const fullPrompt = `${prompt}

Source Content: "${transcription.processed_content || transcription.raw_transcription}"

Key Topics: ${transcription.key_topics?.join(', ') || 'None'}
Action Items: ${transcription.action_items?.join(', ') || 'None'}

Instructions:
- Make it engaging and viral-worthy
- Use the exact tone and style for ${contentType.name}
- Include relevant hashtags where appropriate
- Make it actionable and valuable
- Optimize for maximum engagement`;

      const response = await InvokeLLM({
        prompt: fullPrompt,
        add_context_from_internet: false
      });

      setGeneratedContent(response);

      // Save to database
      await ContentGeneration.create({
        transcription_id: transcription.id,
        content_type: selectedType,
        generated_content: response,
        custom_prompt: customPrompt,
        generation_settings: {
          source_type: 'transcription',
          use_custom_prompt: !!customPrompt
        }
      });

      onContentGenerated?.();

    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedContent('Error generating content. Please try again.');
    }

    setIsGenerating(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadContent = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${contentTypes[selectedType].name.replace(' ', '_')}_${transcription.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-black/60 to-purple-900/20 border border-purple-500/30 backdrop-blur-sm shadow-2xl">
        <CardHeader>
          <CardTitle className="text-purple-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content Type Selection */}
          <div>
            <label className="text-sm font-medium text-purple-200 mb-3 block">Choose Content Type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(contentTypes).map(([key, type]) => {
                const Icon = type.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedType(key)}
                    className={`p-4 rounded-lg border text-left transition-all duration-300 ${
                      selectedType === key
                        ? 'bg-purple-500/20 border-purple-400 shadow-lg shadow-purple-500/20'
                        : 'bg-purple-900/20 border-purple-500/30 hover:bg-purple-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 ${type.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-purple-100 text-sm">{type.name}</span>
                    </div>
                    <p className="text-xs text-purple-300/80">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Prompt */}
          <div>
            <label className="text-sm font-medium text-purple-200 mb-2 block">
              Custom Instructions (Optional)
            </label>
            <Textarea
              placeholder="Add specific instructions for how you want the content generated..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-purple-100 h-20"
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateContent}
            disabled={isGenerating || !selectedType}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 relative overflow-hidden group"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                Generating Legendary Content...
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Zap className="w-5 h-5 mr-3" />
                Generate {contentTypes[selectedType]?.name}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Content */}
      {generatedContent && (
        <Card className="bg-gradient-to-br from-black/60 to-green-900/20 border border-green-500/30 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-green-100 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Generated Content
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500 text-white">
                  {contentTypes[selectedType]?.name}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="border-green-500/50 text-green-200 hover:bg-green-900/30"
                >
                  {isCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={downloadContent}
                  className="border-green-500/50 text-green-200 hover:bg-green-900/30"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-black/30 rounded-lg p-4 border border-green-500/20">
              <pre className="text-green-100 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {generatedContent}
              </pre>
            </div>
            <div className="mt-4 flex gap-3">
              <Button
                onClick={copyToClipboard}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                {isCopied ? 'Copied!' : 'Copy Content'}
              </Button>
              <Button
                onClick={downloadContent}
                variant="outline"
                className="border-green-500/50 text-green-200 hover:bg-green-900/30"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                className="border-green-500/50 text-green-200 hover:bg-green-900/30"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}