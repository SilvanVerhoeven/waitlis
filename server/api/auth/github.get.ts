export default defineOAuthGitHubEventHandler({
  async onSuccess(event/* , { user, tokens } */) {
    // await setUserSession(event, {
    //   user: {
    //     id: user.id,
    //     token: tokens.access_token,
    //   },
    // })
    return sendRedirect(event, '/')
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/')
  },
})
