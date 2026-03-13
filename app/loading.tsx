import { BookOpen } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <BookOpen 
            className="w-16 h-16 text-foreground mx-auto opacity-60" 
            strokeWidth={1.5}
          />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-serif font-medium text-foreground mb-4">
          Loading Your Library
        </h1>
        
        <div className="flex items-center justify-center gap-2">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-foreground rounded-full animate-bounce [animation-delay:0ms] opacity-60"></div>
            <div className="w-2 h-2 bg-foreground rounded-full animate-bounce [animation-delay:150ms] opacity-60"></div>
            <div className="w-2 h-2 bg-foreground rounded-full animate-bounce [animation-delay:300ms] opacity-60"></div>
          </div>
          <span className="text-muted-foreground text-sm font-sans">Organizing your books...</span>
        </div>
      </div>
    </div>
  )
};
