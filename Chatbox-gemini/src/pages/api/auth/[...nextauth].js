import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The "authorize" callback is called when a
      // user attempts to sign in with a credentials authorization flow.
      async authorize(credentials, req) {
        // Add your logic here to validate the user's credentials
        // In a real application, you would verify the email and password
        // against a database or authentication service.

        const { email, password } = credentials;

        if (email === 'test@example.com' && password === 'password') {
          // Any object returned will be saved in the session
          return { email: credentials.email };
        }

        // If you return null then an error will be displayed advising the user to check their details.
        return null;
      },
    }),
  ],
  // Add any other NextAuth configuration options here
  // such as session management, callbacks, etc.
});
