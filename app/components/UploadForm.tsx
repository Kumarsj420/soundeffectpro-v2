import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface AudioMetadata {
  title: string;
  tags: string[];
  description: string;
  category: string;
  isSensitive: boolean;
}

interface UploadFormProps {
  metadata: AudioMetadata;
  onMetadataChange: (metadata: Partial<AudioMetadata>) => void;
  onSubmit: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ metadata, onMetadataChange, onSubmit }) => {
  const [tagInput, setTagInput] = useState('');

  const categories = ['Meme', 'Anime', 'Games', 'Music', 'Movies', 'Random', 'Other'];

  const addTag = (tag: string) => {
    if (tag.trim() && !metadata.tags.includes(tag.trim())) {
      onMetadataChange({
        tags: [...metadata.tags, tag.trim()]
      });
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    onMetadataChange({
      tags: metadata.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  return (
    <div className="p-5 bg-white ring-[0.1em] ring-gray-200 dark:ring-0 dark:bg-gradient-to-b dark:from-zinc-800 dark:to-zinc-900 rounded-xl relative z-10 dark:after:absolute dark:after:inset-0.5 dark:after:-z-10  dark:dark:after:bg-zinc-900 dark:after:rounded-[inherit] shadow-lg shadow-gray-300/70 dark:shadow-none">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-200 mb-6">Sound Details</h3>
      
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-600/90 dark:text-zinc-300 mb-2">
            Sound title <span className='text-zinc-500'>*</span> 
          </label>
          <input
            type="text"
            value={metadata.title}
            onChange={(e) => onMetadataChange({ title: e.target.value })}
            placeholder="Enter a catchy title for your sound"
            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-400/80 dark:border-zinc-600 rounded-xl px-3.5 py-2.5 text-gray-900 dark:text-zinc-200 placeholder:text-gray-500/85 dark:placeholder:text-zinc-400/90 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
          />
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            A good title helps others discover your sound more easily!
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-600/90 dark:text-zinc-300 mb-2">
            Category <span className='text-zinc-500'>*</span> 
          </label>
          <select
            value={metadata.category}
            onChange={(e) => onMetadataChange({ category: e.target.value })}
            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-400/80 dark:border-zinc-600 rounded-xl px-3.5 py-2.5 text-gray-900 dark:text-zinc-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-600/90 dark:text-zinc-300 mb-2">
            Tags <span className='text-zinc-500'>*</span> 
          </label>
          <div className="space-y-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
              onBlur={() => tagInput && addTag(tagInput)}
              placeholder="Add tags to help others find your sound"
              className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-400/80 dark:border-zinc-600 rounded-xl px-3.5 py-2.5 text-gray-900 dark:text-zinc-200 placeholder:text-gray-500/85 dark:placeholder:text-zinc-400/90 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
            />
            
            {metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {metadata.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-300 hover:text-blue-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Tags help find your sounds later by others. Separate with commas or press enter to add multiple tags.
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-600/90 dark:text-zinc-300 mb-2">
            Description <span className='text-zinc-500'>*</span> 
          </label>
          <textarea
            value={metadata.description}
            onChange={(e) => onMetadataChange({ description: e.target.value })}
            placeholder="Describe your sound..."
            rows={4}
            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-400/80 dark:border-zinc-600 rounded-xl px-3.5 py-2.5 text-gray-900 dark:text-zinc-200 placeholder:text-gray-500/85 dark:placeholder:text-zinc-400/90 focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none outline-none"
          />
        </div>

        {/* Sensitive Content Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-zinc-800 rounded-xl">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-zinc-200">Sensitive content</h4>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
              This sound includes sensitive content. E.g., sexual content, violence.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={metadata.isSensitive}
              onChange={(e) => onMetadataChange({ isSensitive: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>

        {/* Warning Box */}
        <div className="flex items-start space-x-3 p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
          <div className="text-yellow-400 mt-0.5">⚠️</div>
          <div className="text-sm text-gray-900 dark:text-zinc-300">
            Any sounds with inappropriate audio, title or description will automatically be flagged as explicit to keep the Content Hub safe and enjoyable for everyone.
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="text-sm text-gray-500 dark:text-zinc-400">
          Remember to keep your content spam-free, respectful and to follow our{' '}
          <a href="#" className="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 underline">
            Community Guidelines
          </a>.
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          className="w-full bg-blue-500 hover:bg-blue-400 text-white rounded-lg px-4 py-3 font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Sound</span>
        </button>
      </div>
    </div>
  );
};

export default UploadForm;