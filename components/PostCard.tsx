
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Plus, Sparkles } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
  viewMode: 'grid' | 'list';
}

export const PostCard: React.FC<PostCardProps> = ({ post, onClick, viewMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const aspectRatioClass = {
    '1:1': 'aspect-square',
    '16:9': 'aspect-video',
    '9:16': 'aspect-[9/16]',
    '4:3': 'aspect-[4/3]',
    '3:4': 'aspect-[3/4]'
  }[post.aspectRatio] || 'aspect-square';

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-100 rounded-xl mb-6 overflow-hidden max-w-lg mx-auto shadow-sm">
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={post.authorAvatar} className="w-8 h-8 rounded-full border border-gray-100" alt={post.author} />
            <span className="font-semibold text-sm">{post.author}</span>
            {post.isAI && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5" />
                <span>AI</span>
              </div>
            )}
          </div>
          <button className="text-gray-400 hover:text-black">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div 
          className={`w-full overflow-hidden bg-gray-100 cursor-pointer ${aspectRatioClass}`}
          onClick={() => onClick(post)}
        >
          <img src={post.url} className="w-full h-full object-cover transition-transform hover:scale-105" alt={post.title} />
        </div>
        <div className="p-3">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => setIsLiked(!isLiked)}>
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
            </button>
            <button>
              <MessageCircle className="w-6 h-6 text-gray-700" />
            </button>
            <button className="ml-auto">
              <Share2 className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          <p className="text-sm font-bold mb-1">{post.likes + (isLiked ? 1 : 0)} likes</p>
          <p className="text-sm">
            <span className="font-bold mr-2">{post.author}</span>
            {post.title}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative mb-4 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(post)}
    >
      <div className={`w-full overflow-hidden rounded-2xl bg-gray-100 ${aspectRatioClass}`}>
        <img 
          src={post.url} 
          alt={post.title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay - Pinterest style */}
        <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 flex flex-col justify-between p-4 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-end gap-2">
             <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-1 shadow-lg">
               Save
             </button>
          </div>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <img src={post.authorAvatar} className="w-6 h-6 rounded-full" alt={post.author} />
              <span className="text-xs font-medium truncate max-w-[100px]">{post.author}</span>
            </div>
            <div className="flex gap-2">
               <button className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors">
                  <Share2 className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 px-1 flex justify-between items-start">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{post.title}</h3>
        {post.isAI && <Sparkles className="w-3 h-3 text-purple-500 flex-shrink-0 ml-1" />}
      </div>
    </div>
  );
};
