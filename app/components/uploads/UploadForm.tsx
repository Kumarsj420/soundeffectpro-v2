import React, { useState, useEffect } from 'react';
import { Head3, Para, CardSpan } from '../Ui';
import Input from '../form/Input';
import Label from '../form/Label';
import { Select, Option } from '../form/Select';
import TagInput from '../form/TagInput';
import Textarea from '../form/Textarea';
import Toggle from '../form/Toggle';
import Link from 'next/link';
import Button from '../form/Button';
import { ArrowUpOnSquareStackIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';
import Card from '../Card';
import { FileSchema } from '@/app/lib/validators/file.schema';
import { TAG_LIMIT, MIN_TAGS } from '@/app/global';

interface AudioMetadata {
  title: string;
  tags: string[];
  description: string;
  category: string;
  nsfw: boolean;
}

interface UploadFormProps {
  metadata: AudioMetadata;
  onMetadataChange: (metadata: Partial<AudioMetadata>) => void;
  onSubmit: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ metadata, onMetadataChange, onSubmit }) => {

  const categories = ['Random', 'Meme', 'Anime', 'Gaming', 'Music', 'Movies', 'Sports', 'Series', 'Politics', 'Comedy'];

  const [titleInp, setTitleInp] = useState(metadata.title);

  const [tagInput, setTagInput] = useState<string[]>([]);
  const [descriptionInp, setDescriptionInp] = useState('');

  const titleSchema = FileSchema.shape.title;
  const tagsSchema = FileSchema.shape.tags;
  const descriptionSchema = FileSchema.shape.description;

  const [tagsTouched, setTagsTouched] = useState(false);
  const [descriptionTouched, setDescriptionTouched] = useState(false);

  const [titleError, setTitleError] = useState<string | null>(null);
  const [tagsError, setTagsError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  useEffect(() => {
    onMetadataChange({ title: titleInp });
    const result = titleSchema.safeParse(titleInp);
    if (!result.success) {
      setTitleError(result.error.issues[0].message);
    } else {
      setTitleError(null);
    }

  }, [titleInp, onMetadataChange, titleSchema])

  useEffect(() => {
    onMetadataChange({ tags: tagInput })
    if (!tagsTouched) return;
    const result = tagsSchema.safeParse(tagInput);

    if (!result.success) {
      setTagsError(result.error.issues[0].message);
    } else {
      setTagsError(null);
    }

  }, [tagInput, onMetadataChange, tagsSchema])

  useEffect(() => {
    onMetadataChange({ description: descriptionInp })
    if (!descriptionTouched) return;
    const result = descriptionSchema.safeParse(descriptionInp);

    if (!result.success) {
      setDescriptionError(result.error.issues[0].message)
    } else {
      setDescriptionError(null)
    }

  }, [descriptionInp, onMetadataChange, descriptionSchema])



  return (
    <Card>
      <Head3 className="mb-5">Sound Details</Head3>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <Label className="mb-1.5" required htmlFor='s-title'>
            Sound title
          </Label>
          <Input
            type="text"
            id='s-title'
            value={titleInp}
            onChange={(e) => setTitleInp(e.target.value)}
            placeholder="Enter a catchy title for your sound"
            message=' A good title helps others discover your sound more easily!'
            error={titleError ?? undefined}
            success={!titleError && titleInp.length > 3}
          />
        </div>

        {/* Category */}
        <div>
          <Label className="mb-1.5" htmlFor='s-cat' required>
            Category
          </Label>
          <Select
            id='s-cat'
            value={metadata.category}
            onChange={(val) => onMetadataChange({ category: val })}
          >
            {categories.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
        </div>

        {/* Tags */}
        <div>
          <Label className='mb-1.5' required>
            Tags
          </Label>

          <TagInput
            value={tagInput}
            onChange={(val) => {
              if (!tagsTouched) setTagsTouched(true);
              setTagInput(val)
            }}
            placeholder="Add tags to help others find your sound"
            message="Separate with commas or press enter to add multiple tags."
            maxTags={TAG_LIMIT}
            error={tagsTouched ? tagsError ?? undefined : undefined}
            success={tagsTouched && !tagsError && tagInput.length > MIN_TAGS}
          />

        </div>


        <div>
          <Label className="mb-1.5">
            Description
          </Label>
          <Textarea
            value={descriptionInp}
            onChange={(e) => {
              if (!descriptionTouched) setDescriptionTouched(true);
              setDescriptionInp(e.target.value)
            }}
            placeholder="Describe your sound..."
            rows={4}
            className='resize-none'
            error={descriptionTouched ? descriptionError ?? undefined : undefined}
            success={descriptionTouched && !descriptionError}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-zinc-800/70 rounded-xl">
          <div>
            <Para>Sensitive content</Para>
            <CardSpan>
              This sound includes sensitive content. E.g., sexual content, violence.
            </CardSpan>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <Toggle checked={metadata.nsfw} onChange={(e) => onMetadataChange({ nsfw: e.currentTarget.checked })} />
          </label>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-warning-600/15 border border-warning-500/40 rounded-lg">
          <div className="text-warning-400 mt-0.5">
            <ShieldExclamationIcon className='size-6' />
          </div>
          <div className="text-sm text-gray-900 dark:text-zinc-300">
            Any sounds with inappropriate audio, title or description will be flagged as NSFW to keep the Content Hub safe and enjoyable for everyone.
          </div>
        </div>

        <CardSpan >
          Remember to keep your content spam-free, respectful and to follow our{' '}
          <Link href="#" className="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 underline">
            Community Guidelines
          </Link>.
        </CardSpan>

        <Button
          onClick={onSubmit}
          className='mt-3 w-full'
          size='md'
          type='button'
        >
          <ArrowUpOnSquareStackIcon className="size-5" />
          <span>Upload Sound</span>
        </Button>
      </div>
    </Card>
  );
};

export default UploadForm;