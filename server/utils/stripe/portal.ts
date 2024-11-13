export function createStripeSelfServicePortal(customerUId: string, currentPath: string) {
  return tryWithCache(
    getStorageStripeKey(`customer:${customerUId}:portal`),
    () => stripeAdmin.billingPortal.sessions.create({
      customer: customerUId,
      return_url: getURL(currentPath),
    }),
  )
}
