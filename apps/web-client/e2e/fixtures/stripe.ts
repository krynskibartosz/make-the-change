import type { Page } from '@playwright/test'

type StripeCard = {
  number: string
  expiry: string
  cvc: string
  postal?: string
}

const defaultCard: StripeCard = {
  number: '4242 4242 4242 4242',
  expiry: '12/34',
  cvc: '123',
  postal: '1000',
}

const fillStripeField = async (
  page: Page,
  selectors: string[],
  value: string,
  required = true,
): Promise<boolean> => {
  for (const frame of page.frames()) {
    for (const selector of selectors) {
      const locator = frame.locator(selector)
      if (await locator.count()) {
        await locator.first().fill(value)
        return true
      }
    }
  }

  if (required) {
    throw new Error(`Stripe input not found for selectors: ${selectors.join(', ')}`)
  }

  return false
}

export const fillStripeCard = async (page: Page, card: StripeCard = defaultCard) => {
  await page.waitForSelector('iframe[name^="__privateStripeFrame"]', { timeout: 15000 })

  await fillStripeField(
    page,
    ['input[name="cardnumber"]', 'input[autocomplete="cc-number"]'],
    card.number,
  )
  await fillStripeField(
    page,
    ['input[name="exp-date"]', 'input[autocomplete="cc-exp"]'],
    card.expiry,
  )
  await fillStripeField(page, ['input[name="cvc"]', 'input[autocomplete="cc-csc"]'], card.cvc)

  if (card.postal) {
    await fillStripeField(
      page,
      ['input[name="postal"]', 'input[autocomplete="postal-code"]', 'input[name="zip"]'],
      card.postal,
      false,
    )
  }
}
