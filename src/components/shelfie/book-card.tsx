import { cn } from '@/lib/utils';

interface BookCardProps {
  cover: string;
  title: string;
  author: string;
  progress: number;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export default function BookCard({ 
  cover, 
  title, 
  author, 
  progress, 
  onClick,
  size = 'large' 
}: BookCardProps) {
  const sizes = {
    small: 'w-[120px]',
    medium: 'w-[80px]',
    large: 'w-[200px]'
  };

  return (
    <div 
      className={cn(
        "cursor-pointer transition-transform hover:scale-105 active:scale-95",
        sizes[size]
      )}
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-3">
        <img 
          src={cover || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80'} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="space-y-2">
        <h3 className={cn(
          "font-inter font-medium text-gray-900 leading-tight",
          size === 'large' ? 'text-lg line-clamp-2' : 'text-sm line-clamp-1'
        )}>
          {title}
        </h3>
        
        <p className={cn(
          "font-inter text-coral-light",
          size === 'large' ? 'text-sm' : 'text-xs'
        )}>
          {author}
        </p>
        
        <div className="space-y-1">
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-coral rounded-full transition-all duration-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-end">
            <span className="text-xs font-mono text-gray-500">
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
