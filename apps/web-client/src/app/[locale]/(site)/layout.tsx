import { Suspense, type PropsWithChildren } from 'react'


export default function Layout({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<></>}>
      {children}
    </Suspense>
  )
}
