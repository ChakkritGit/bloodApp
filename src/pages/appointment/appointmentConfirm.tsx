import { FC, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { HiOutlinePlus, HiOutlineXCircle } from 'react-icons/hi2'

interface SingleImageUploaderProps {
  label: string
  previewUrl: string
  isResizing?: boolean
  onFileSelect: (file: File | null) => void
}

const SingleImageUploader: FC<SingleImageUploaderProps> = ({
  label,
  previewUrl,
  isResizing = false,
  onFileSelect
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleRemove = () => {
    onFileSelect(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className='form-control w-full'>
      <label className='label'>
        <span className='label-text'>{label}</span>
      </label>
      <input
        type='file'
        accept='image/*'
        ref={fileInputRef}
        onChange={e => onFileSelect(e.target.files?.[0] || null)}
        className='hidden'
      />
      <div className='w-full h-52 md:h-60 rounded-3xl relative'>
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt='Preview'
              className='w-full h-full object-cover rounded-3xl'
            />
            <button
              type='button'
              onClick={handleRemove}
              className='btn btn-circle btn-sm btn-error absolute top-2 right-2'
            >
              <HiOutlineXCircle size={20} />
            </button>
          </>
        ) : isResizing ? (
          <div className='w-full h-full rounded-3xl flex justify-center items-center bg-base-200'>
            <span className='loading loading-spinner loading-md'></span>
          </div>
        ) : (
          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className='w-full h-full rounded-3xl flex flex-col justify-center items-center bg-base-200 hover:bg-base-300 transition-colors border-2 border-dashed'
          >
            <HiOutlinePlus size={40} className='text-base-content/50 mb-2' />
            <span className='text-sm text-base-content/70'>เพิ่มรูปภาพ</span>
          </button>
        )}
      </div>
    </div>
  )
}

interface MultiImageUploaderProps {
  label: string
  previews: string[]
  isResizing?: boolean
  maxFiles?: number
  onFilesAdd: (files: File[]) => void
  onFileRemove: (index: number) => void
}

const MultiImageUploader: FC<MultiImageUploaderProps> = ({
  label,
  previews,
  isResizing = false,
  maxFiles = 10,
  onFilesAdd,
  onFileRemove
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const totalFiles = previews.length

  return (
    <div className='form-control w-full'>
      <label className='label'>
        <span className='label-text'>
          {label} ({totalFiles}/{maxFiles})
        </span>
      </label>
      <input
        type='file'
        accept='image/*'
        multiple
        ref={fileInputRef}
        onChange={e => e.target.files && onFilesAdd(Array.from(e.target.files))}
        className='hidden'
      />
      <div className='w-full min-h-[13rem] md:min-h-[15rem] p-2 rounded-3xl bg-base-200'>
        <div className='flex gap-3 overflow-x-auto h-full'>
          {totalFiles < maxFiles && (
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              disabled={isResizing}
              className='flex-shrink-0 w-32 h-44 md:w-40 md:h-52 rounded-2xl flex flex-col justify-center items-center bg-base-100 hover:bg-base-300/50 transition-colors border-2 border-dashed disabled:cursor-wait'
            >
              {isResizing ? (
                <span className='loading loading-spinner'></span>
              ) : (
                <HiOutlinePlus size={32} className='text-base-content/50' />
              )}
            </button>
          )}
          {previews.map((url, index) => (
            <div
              key={index}
              className='flex-shrink-0 w-32 h-44 md:w-40 md:h-52 rounded-2xl relative'
            >
              <img
                src={url}
                alt={`Preview ${index}`}
                className='w-full h-full object-cover rounded-2xl'
              />
              <button
                type='button'
                onClick={() => onFileRemove(index)}
                className='btn btn-circle btn-xs btn-error absolute top-1 right-1'
              >
                <HiOutlineXCircle size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const AppointmentConfirm: FC = () => {
  const { id } = useParams()

  return (
    <div>
      <SingleImageUploader
        label={''}
        previewUrl={''}
        onFileSelect={file => {}}
        isResizing={false}
      />
      <MultiImageUploader
        label={''}
        previews={[]}
        onFilesAdd={newFiles => {}}
        onFileRemove={index => {}}
        isResizing={false}
      />
    </div>
  )
}

export default AppointmentConfirm
