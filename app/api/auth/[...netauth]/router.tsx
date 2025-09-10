 import NextAuth from 'next-auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
})

 export{ handlers as GET, handlers as POST}