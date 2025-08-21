import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Heart, Star, MessageCircle } from "lucide-react";
import { MatchesAPI, Profile } from "@/lib/api/matches";
import { useAuth } from "@/hooks/use-auth-simple";
import { useLoggedHandlers } from "@/components/ActionLoggerProvider";

export default function MatchesLive() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { createClickHandler } = useLoggedHandlers();
  
  const [activeTab, setActiveTab] = useState<"likes" | "superlikes">("likes");
  const [searchQuery, setSearchQuery] = useState("");
  const [likes, setLikes] = useState<Profile[]>([]);
  const [superLikes, setSuperLikes] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLikesData();
    }
  }, [isAuthenticated]);

  const fetchLikesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [likesData, superLikesData] = await Promise.all([
        MatchesAPI.getLikes(),
        MatchesAPI.getSuperLikes()
      ]);
      
      setLikes(likesData);
      setSuperLikes(superLikesData);
    } catch (err) {
      console.error('Error fetching likes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load likes');
    } finally {
      setLoading(false);
    }
  };

  const currentProfiles = activeTab === "likes" ? likes : superLikes;
  
  const filteredProfiles = currentProfiles.filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProfileClick = createClickHandler(
    'profile_view_from_matches',
    'button',
    (profileId: string) => {
      navigate(`/profile/${profileId}`);
    }
  );

  const handleLikeBack = createClickHandler(
    'like_back_from_matches',
    'button',
    async (profileId: string) => {
      try {
        const result = await MatchesAPI.likeProfile(profileId);
        if (result.isMatch) {
          // Handle match - could show match modal or navigate to chat
          navigate(`/chat/${result.matchId}`);
        }
        // Refresh the data
        await fetchLikesData();
      } catch (err) {
        console.error('Error liking back:', err);
      }
    }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to view your matches</p>
          <button
            onClick={() => navigate('/signin')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchLikesData}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={createClickHandler('back_from_matches', 'button', () => navigate(-1))}
            data-action="click_back_from_matches"
            className="p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">
            {user?.name ? `${user.name}'s Matches` : 'Matches'}
          </h1>
          <div className="w-10" />
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={createClickHandler('likes_tab', 'button', () => setActiveTab('likes'))}
            data-action="click_likes_tab"
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'likes'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500'
            }`}
          >
            <Heart className="w-5 h-5 inline mr-2" />
            Likes ({likes.length})
          </button>
          <button
            onClick={createClickHandler('superlikes_tab', 'button', () => setActiveTab('superlikes'))}
            data-action="click_superlikes_tab"
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'superlikes'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500'
            }`}
          >
            <Star className="w-5 h-5 inline mr-2" />
            Super Likes ({superLikes.length})
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'likes' ? 'likes' : 'super likes'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              {activeTab === 'likes' ? (
                <Heart className="w-12 h-12 text-gray-400" />
              ) : (
                <Star className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No results found' : `No ${activeTab} yet`}
            </h3>
            <p className="text-gray-500">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : activeTab === 'likes' 
                ? 'People who like you will appear here'
                : 'People who super like you will appear here'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={profile.photos[0] || '/placeholder.svg'}
                    alt={profile.name}
                    className="w-full h-48 object-cover"
                  />
                  {activeTab === 'superlikes' && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-blue-500 text-white p-1 rounded-full">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  )}
                  {profile.verified && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-blue-500 text-white p-1 rounded-full">
                        <span className="text-xs font-bold">✓</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {profile.name}, {profile.age}
                  </h3>
                  {profile.distance && (
                    <p className="text-sm text-gray-500 mb-2">
                      {profile.distance} km away
                    </p>
                  )}
                  {profile.bio && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {profile.bio}
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleProfileClick(profile.id)}
                      data-action="view_profile_from_matches"
                      className="flex-1 py-2 px-3 border border-purple-600 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-50"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleLikeBack(profile.id)}
                      data-action="like_back_from_matches"
                      className="flex-1 py-2 px-3 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center justify-center gap-1"
                    >
                      <Heart className="w-4 h-4" />
                      Like
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
