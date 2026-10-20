import { BrainCircuit, SendHorizonal, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const starterMessages = [
  { from: 'bot', text: 'Hi! I can help you understand your civic rights, route a complaint, or explain legal terms.' },
]

function getLocalAssistantReply(message: string): string {
  const lower = message.toLowerCase().trim().replace(/[.!?,]+$/g, '')

  if (/^(hi|hello|hey)( there|, how are you)?$|^(good morning|good afternoon|good evening)( there)?$/.test(lower)) {
    return 'Hi! I can help you understand civic rights, track a complaint, or route an issue to the right department.'
  }

  if (/^(thanks|thank you|thank you so much|thx)$/.test(lower)) {
    return 'You’re welcome! If you have another civic question or need help with a complaint, just ask.'
  }

  if (/^(bye|goodbye|see you|see you later)$/.test(lower)) {
    return 'Goodbye! I’m here whenever you need help with a civic service or complaint.'
  }

  if (/^(okay|ok|got it|understood)$/.test(lower)) {
    return 'Great. If you tell me a little about the civic issue, I can suggest the right department or next step.'
  }

  if (/^(who are you|what can you do|help|help me)$/.test(lower)) {
    return 'I’m YUVA’s civic assistant. I can guide you to the right department, explain complaint tracking, and share general information about civic rights.'
  }

  if (
    lower.includes('which department') ||
    lower.includes('department handles') ||
    lower.includes('who handles') ||
    lower.includes('which authority') ||
    /road|pothole|street|drain|bridge/.test(lower)
  ) {
    return 'For road, pothole, drainage, and street issues, the correct authority is the Road Management System. If it is a major safety risk, the complaint is usually routed to the Public Works Division for inspection and repair.'
  }

  if (lower.includes('track my complaint') || lower.includes('how can i track') || lower.includes('track complaint') || lower.includes('status')) {
    return 'You can track your complaint from the citizen dashboard using the complaint ID. The system shows the current status, assigned department, and the timeline of updates from the responsible authority.'
  }

  if (lower.includes('what are my rights') || lower.includes('rights as a citizen') || lower.includes('rights') || lower.includes('citizen rights') || lower.includes('legal')) {
    return 'As a citizen, you have the right to safe public services, timely grievance redressal, transparency, and accountability from the relevant department. If a service is delayed or ignored, you can escalate the complaint through the portal or through the appropriate civic authority.'
  }

  if (lower.includes('health') || lower.includes('hospital') || lower.includes('clinic') || lower.includes('medical') || lower.includes('disease')) {
    return 'Health-related issues are usually handled by the Health Department. The District Health Officer can coordinate medical response, sanitation checks, and public health safety actions.'
  }

  if (lower.includes('women') || lower.includes('safety') || lower.includes('harassment') || lower.includes('security') || lower.includes('abuse')) {
    return 'Women safety and harassment complaints should be routed to the Women Safety Cell. This authority handles immediate support, intervention, and protection-related follow-up.'
  }

  if (lower.includes('water') || lower.includes('leak') || lower.includes('pipeline') || lower.includes('supply') || lower.includes('sanitation') || lower.includes('garbage') || lower.includes('drainage')) {
    return 'Water, leak, pipeline, and sanitation issues are generally routed to the Water Supply Board or Urban Sanitation Wing depending on the exact complaint type. The department can inspect the site and assign repair or cleanup actions.'
  }

  if (lower.includes('finance') || lower.includes('budget') || lower.includes('grant') || lower.includes('payment') || lower.includes('scheme') || lower.includes('welfare')) {
    return 'Finance and budget-related public grievances are handled by the Finance & Budget Office, which reviews welfare schemes, public funds, grants, and service accountability concerns.'
  }

  return 'I’m not sure which civic topic you mean yet. Tell me what happened and where—for example, a road pothole, water leak, health concern, sanitation issue, or complaint status—and I’ll point you to the right next step.'
}

type AIChatWidgetProps = {
  inline?: boolean
  title?: string
  placeholder?: string
}

export function AIChatWidget({ inline = false, title = 'Nyaya & Civic AI', placeholder = 'Ask about government services...' }: AIChatWidgetProps) {
  const [messages, setMessages] = useState(starterMessages)
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const onPrompt = (event: Event) => {
      const customEvent = event as CustomEvent<string>
      const nextValue = customEvent.detail?.trim()
      if (!nextValue) return
      setIsOpen(true)
      setValue(nextValue)
      window.setTimeout(() => {
        void handleSubmit(nextValue)
      }, 0)
    }

    window.addEventListener('yuva-chat-question', onPrompt)
    return () => window.removeEventListener('yuva-chat-question', onPrompt)
  }, [])

  const handleSubmit = async (customValue?: string) => {
    const trimmed = (customValue ?? value).trim()
    if (!trimmed || isLoading) return

    setMessages((current) => [...current, { from: 'user', text: trimmed }])
    setValue('')
    setIsLoading(true)

    const reply = getLocalAssistantReply(trimmed)
    setMessages((current) => [...current, { from: 'bot', text: reply }])
    setIsLoading(false)
  }

  if (inline) {
    return (
      <div className="w-full rounded-[28px] border border-white/10 bg-slate-950/85 p-4 shadow-[0_0_35px_rgba(168,85,247,0.12)] backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <BrainCircuit className="h-4 w-4 text-cyan-300" />
            <span className="font-medium">{title}</span>
          </div>
          <button className="text-xs uppercase tracking-[0.18em] text-slate-400">Online</button>
        </div>

        <div className="max-h-[420px] space-y-3 overflow-auto pr-1 text-sm">
          {messages.map((message, index) => (
            <div
              key={`${message.from}-${index}`}
              className={`rounded-2xl p-3 ${message.from === 'bot' ? 'bg-violet-500/10 text-violet-100' : 'bg-cyan-500/10 text-cyan-50'}`}
            >
              {message.text}
            </div>
          ))}
          {isLoading ? <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-100">Thinking...</div> : null}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void handleSubmit()
              }
            }}
            placeholder={placeholder}
            className="flex-1 rounded-full border border-white/10 bg-slate-900/90 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <button onClick={() => void handleSubmit()} disabled={isLoading} className="rounded-full bg-cyan-500 p-2 text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {!isOpen ? (
        <button
          type="button"
          aria-label="Open AI chatbot"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/40 bg-gradient-to-br from-cyan-500 via-violet-500 to-[#641C2A] shadow-[0_0_30px_rgba(34,211,238,0.4)] transition hover:scale-105"
        >
          <BrainCircuit className="h-7 w-7 text-white" />
        </button>
      ) : (
        <div className="fixed bottom-5 right-5 z-50 w-[340px] rounded-[28px] border border-white/10 bg-slate-950/85 p-4 shadow-[0_0_40px_rgba(168,85,247,0.12)] backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <BrainCircuit className="h-4 w-4 text-cyan-300" />
              <span className="font-medium">{title}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-xs uppercase tracking-[0.18em] text-slate-400">Online</button>
              <button type="button" aria-label="Close AI chatbot" onClick={() => setIsOpen(false)} className="rounded-full border border-white/10 bg-white/5 p-1 text-slate-300 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="max-h-48 space-y-3 overflow-auto pr-1 text-sm">
            {messages.map((message, index) => (
              <div
                key={`${message.from}-${index}`}
                className={`rounded-2xl p-3 ${message.from === 'bot' ? 'bg-violet-500/10 text-violet-100' : 'bg-cyan-500/10 text-cyan-50'}`}
              >
                {message.text}
              </div>
            ))}
            {isLoading ? <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-100">Thinking...</div> : null}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void handleSubmit()
                }
              }}
              placeholder={placeholder}
              className="flex-1 rounded-full border border-white/10 bg-slate-900/90 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button onClick={() => void handleSubmit()} disabled={isLoading} className="rounded-full bg-cyan-500 p-2 text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">
              <SendHorizonal className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
