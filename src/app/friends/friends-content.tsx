'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserPlus, Check, X, BookOpen } from 'lucide-react';
import { createClient } from '../../../supabase/client';
import { cn } from '@/lib/utils';

interface FriendsContentProps {
  friendships: any[];
  pendingRequests: any[];
  friendsBooks: any[];
}

export default function FriendsContent({ 
  friendships: initialFriendships, 
  pendingRequests: initialRequests,
  friendsBooks: initialFriendsBooks 
}: FriendsContentProps) {
  const [friendships, setFriendships] = useState(initialFriendships);
  const [pendingRequests, setPendingRequests] = useState(initialRequests);
  const [friendsBooks, setFriendsBooks] = useState(initialFriendsBooks);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [adding, setAdding] = useState(false);
  const supabase = createClient();

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('friends-books')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'books' },
        () => {
          // Refetch friends books
          refreshFriendsBooks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const refreshFriendsBooks = async () => {
    const acceptedFriendIds = friendships.filter(f => f.status === 'accepted').map(f => f.friend_id);
    
    const { data } = await supabase
      .from('books')
      .select(`
        *,
        profiles (
          display_name,
          avatar_config
        )
      `)
      .in('user_id', acceptedFriendIds)
      .eq('status', 'reading')
      .order('updated_at', { ascending: false });

    if (data) setFriendsBooks(data);
  };

  const handleAddFriend = async () => {
    if (!phoneNumber.trim()) return;

    setAdding(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Find user by phone number
      const { data: friend } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone_number', phoneNumber)
        .single();

      if (!friend) {
        alert('User not found with this phone number');
        return;
      }

      // Create friendship request
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user?.id,
          friend_id: friend.id,
          status: 'pending'
        });

      if (!error) {
        setShowAddFriend(false);
        setPhoneNumber('');
        // Refresh friendships
        const { data } = await supabase
          .from('friendships')
          .select(`
            *,
            friend:profiles!friendships_friend_id_fkey (
              id,
              display_name,
              avatar_config,
              phone_number
            )
          `)
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });
        
        if (data) setFriendships(data);
      }
    } catch (error) {
      console.error('Failed to add friend:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleAcceptRequest = async (requestId: string, requesterId: string) => {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    if (!error) {
      setPendingRequests(pendingRequests.filter(r => r.id !== requestId));
      
      // Also create reverse friendship
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('friendships').insert({
        user_id: user?.id,
        friend_id: requesterId,
        status: 'accepted'
      });
      
      // Refresh
      refreshFriendsBooks();
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', requestId);

    if (!error) {
      setPendingRequests(pendingRequests.filter(r => r.id !== requestId));
    }
  };

  const acceptedFriends = friendships.filter(f => f.status === 'accepted');

  return (
    <div className="px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-fraunces text-4xl font-light tracking-wide text-gray-900 mb-2">
            Friends
          </h1>
          <p className="font-inter text-gray-600">
            See what your friends are reading
          </p>
        </div>
        <Button
          onClick={() => setShowAddFriend(true)}
          className="bg-coral hover:bg-coral/90 text-white"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div>
          <h2 className="font-fraunces text-xl font-light text-gray-900 mb-4">
            Pending Requests
          </h2>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-xl p-4 border border-coral/10 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-inter font-medium text-coral">
                    {request.requester.display_name[0]}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-inter font-medium text-gray-900">
                    {request.requester.display_name}
                  </h3>
                  <p className="text-sm font-inter text-gray-500">
                    wants to connect
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptRequest(request.id, request.requester.id)}
                    className="bg-coral hover:bg-coral/90 text-white"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRejectRequest(request.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends Activity Feed */}
      {friendsBooks.length > 0 ? (
        <div>
          <h2 className="font-fraunces text-2xl font-light text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {friendsBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl p-5 border border-coral/10 hover:border-coral/30 transition-all"
              >
                <div className="flex gap-4">
                  {/* User Avatar */}
                  <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-inter font-medium text-coral">
                      {book.profiles.display_name[0]}
                    </span>
                  </div>

                  {/* Book Info */}
                  <div className="flex-1">
                    <p className="font-inter text-sm text-gray-600 mb-2">
                      <span className="font-medium text-gray-900">
                        {book.profiles.display_name}
                      </span>{' '}
                      is reading
                    </p>
                    
                    <div className="flex gap-3">
                      {book.cover_url && (
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          className="w-12 h-18 object-cover rounded-lg shadow-sm"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-inter font-medium text-gray-900 leading-tight mb-1">
                          {book.title}
                        </h3>
                        <p className="text-sm font-inter text-coral-light mb-2">
                          {book.author}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
                            <div 
                              className="h-full bg-gradient-to-r from-coral to-[#FF8E8E] rounded-full shadow-[0_0_6px_rgba(255,107,107,0.5)]"
                              style={{ width: `${book.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-gray-500">
                            {book.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : acceptedFriends.length > 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-coral/10">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="font-inter text-gray-500">
            Your friends haven't added any books yet
          </p>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-coral/10">
          <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="font-inter text-gray-500 mb-4">
            Add friends to see what they're reading
          </p>
          <Button
            onClick={() => setShowAddFriend(true)}
            className="bg-coral hover:bg-coral/90 text-white"
          >
            Add Your First Friend
          </Button>
        </div>
      )}

      {/* Add Friend Modal */}
      <Dialog open={showAddFriend} onOpenChange={setShowAddFriend}>
        <DialogContent className="bg-cream border-coral/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-fraunces text-2xl font-light text-gray-900">
              Add Friend
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <label className="block text-sm font-inter text-gray-600 mb-2">
                Friend's Phone Number
              </label>
              <Input
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAddFriend(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddFriend}
                disabled={!phoneNumber || adding}
                className="flex-1 bg-coral hover:bg-coral/90 text-white"
              >
                {adding ? 'Adding...' : 'Send Request'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
