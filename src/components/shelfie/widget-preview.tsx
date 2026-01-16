'use client';

import { cn } from '@/lib/utils';
import { Smartphone, Users, ChevronRight } from 'lucide-react';

interface Book {
  id: string;
  cover_url: string;
  title: string;
  author: string;
  percentage: number;
}

interface FriendWithBook {
  id: string;
  user_id: string;
  display_name: string;
  avatar_config: any;
  book: Book;
}

interface WidgetPreviewProps {
  friends: FriendWithBook[];
  showWidgetHint?: boolean;
  onFriendClick?: (friendId: string) => void;
}

export default function WidgetPreview({ 
  friends = [],
  showWidgetHint = true,
  onFriendClick
}: WidgetPreviewProps) {
  return (
    <div className="space-y-2">
      {/* iOS Widget Sync Indicator */}
      {showWidgetHint && (
        <div className="flex items-center gap-1.5 px-1">
          <Smartphone className="w-3 h-3 text-coral/60" />
          <span className="text-[11px] font-inter text-gray-400">Syncs to iOS widget</span>
        </div>
      )}

      {/* Friends Reading List */}
      {friends.length > 0 ? (
        <div className="space-y-2">
          {friends.map((friend) => (
            <div 
              key={friend.id}
              onClick={() => onFriendClick?.(friend.user_id)}
              className="bg-white rounded-2xl p-3 border border-gray-100 hover:border-coral/20 cursor-pointer transition-all hover:shadow-sm active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                {/* Friend Avatar */}
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white font-inter font-medium text-base flex-shrink-0 shadow-sm",
                    friend.avatar_config?.gradient 
                      ? `bg-gradient-to-br ${friend.avatar_config.gradient}` 
                      : "bg-gradient-to-br from-coral to-coral-light"
                  )}
                >
                  {friend.display_name[0]}
                </div>

                {/* Book Cover */}
                <div className="w-8 h-12 rounded-md overflow-hidden shadow-sm flex-shrink-0 border border-gray-100">
                  <img 
                    src={friend.book.cover_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&q=80'} 
                    alt={friend.book.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Book Info + Progress */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-inter font-medium text-gray-900 truncate">
                    {friend.display_name}
                  </p>
                  <p className="text-[11px] font-inter text-gray-500 truncate mb-1.5">
                    {friend.book.title}
                  </p>
                  {/* Progress Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-coral via-[#FF8080] to-[#FF9B9B] rounded-full"
                        style={{ width: `${friend.book.percentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-coral font-semibold">
                      {friend.book.percentage}%
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm font-inter text-gray-500 mb-1">
            No friends yet
          </p>
          <p className="text-xs font-inter text-gray-400">
            Add friends to see what they're reading
          </p>
        </div>
      )}
    </div>
  );
}
