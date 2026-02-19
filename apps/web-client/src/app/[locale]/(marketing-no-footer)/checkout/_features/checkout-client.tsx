'use client'

interface CheckoutClientProps {
  pointsBalance: number
  defaultAddress: {
    firstName: string
    lastName: string
    street: string
    city: string
    postalCode: string
    country: string
  }
}

export function CheckoutClient({ pointsBalance, defaultAddress }: CheckoutClientProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-xl font-semibold mb-2">Checkout Temporarily Unavailable</h2>
      <p className="text-muted-foreground mb-4">
        We are currently updating our checkout experience. Please try again later.
      </p>
      <div className="text-sm">
        <p>Points Balance: {pointsBalance}</p>
        <p>
          Shipping to: {defaultAddress.firstName} {defaultAddress.lastName}, {defaultAddress.city}
        </p>
      </div>
    </div>
  )
}
