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
  return (
    <div 
      className="cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] bg-white rounded-2xl p-3 border border-gray-100 hover:border-coral/20 hover:shadow-sm"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-sm mb-2.5">
        <img 
          src={cover || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80'} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="space-y-1.5">
        <h3 className="font-inter font-medium text-gray-900 leading-tight text-[13px] line-clamp-1">
          {title}
        </h3>
        
        <p className="font-inter text-gray-500 text-[11px] line-clamp-1">
          {author}
        </p>
        
        <div className="pt-1">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-coral via-[#FF8080] to-[#FF9B9B] rounded-full transition-all duration-400"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-coral font-semibold">
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
