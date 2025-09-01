import { FC, useState, useMemo } from 'react'

export interface TakenQueue {
  f_appidno: string
  f_appadmindueque: number
}

interface QueueSelectorProps {
  totalQueues?: number
  takenQueues: TakenQueue[]
  onQueueSelect: (queue: number | null) => void
}

const QueueSelector: FC<QueueSelectorProps> = ({
  totalQueues = 30,
  takenQueues,
  onQueueSelect
}) => {
  const [selectedQueue, setSelectedQueue] = useState<number | null>(null)

  const takenQueueSet = useMemo(
    () => new Set(takenQueues.map(q => q.f_appadmindueque)),
    [takenQueues]
  )

  const allQueues = Array.from({ length: totalQueues }, (_, i) => i + 1)

  const handleQueueClick = (queueNumber: number) => {
    if (takenQueueSet.has(queueNumber)) return

    const newSelectedQueue = selectedQueue === queueNumber ? null : queueNumber

    setSelectedQueue(newSelectedQueue)
    onQueueSelect(newSelectedQueue)
  }

  return (
    <div className='w-full'>
      <div className='grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 px-1 py-3'>
        {allQueues.map(queueNumber => {
          const isTaken = takenQueueSet.has(queueNumber)
          const isSelected = selectedQueue === queueNumber

          const buttonClass = isTaken
            ? 'btn-disabled text-base-content/40 line-through'
            : isSelected
            ? 'btn-primary'
            : 'btn-outline'

          return (
            <button
              key={queueNumber}
              type='button'
              disabled={isTaken}
              onClick={() => handleQueueClick(queueNumber)}
              className={`btn w-13 h-13 ${buttonClass} font-medium rounded-3xl`}
            >
              {queueNumber}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QueueSelector
