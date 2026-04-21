import { Step0Hook } from '../_features/step-0-hook'

export default function Step0Page() {
  return (
    <div className="fixed inset-0 z-[100] h-[100dvh] w-full bg-[#0B0F15] overflow-hidden overscroll-none flex flex-col relative selection:bg-emerald-500/30">
      <Step0Hook />
    </div>
  )
}
