import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {

    user: {
      /** The user's postal address. */
      address: string
      name: string
      email: string
      image: string
    }
  }
  

}



declare module "next-auth/jwt" {
  interface JWT {
    /** This is an example. You can find me in types/next-auth.d.ts */
    bar: number
  }
}