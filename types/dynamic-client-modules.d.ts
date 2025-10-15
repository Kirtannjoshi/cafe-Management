// Ambient module declarations for client components dynamically imported from pages.
// This prevents TypeScript from complaining in the editor about missing module
// declarations for these relative dynamic imports.

declare module "./PaymentClient" {
  const Component: any
  export default Component
}

declare module "./CardPaymentClient" {
  const Component: any
  export default Component
}

declare module "./UpiPaymentClient" {
  const Component: any
  export default Component
}

declare module "./WalletPaymentClient" {
  const Component: any
  export default Component
}

declare module "./UnauthorizedClient" {
  const Component: any
  export default Component
}
