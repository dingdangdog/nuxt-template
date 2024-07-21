import { canNavigate } from '@layouts/plugins/casl'
import { P, match } from 'ts-pattern'

function canGoNext() { /* does nothing on purpose */ }

export default defineNuxtRouteMiddleware(async (to) => {
  /*
     * If it's a public route, continue navigation. This kind of pages are allowed to visited by login & non-login users. Basically, without any restrictions.
     * Examples of public routes are, 404, under maintenance, etc.
     */
  if (to.meta.public)
    return

  const { status, data, signOut } = useAuth()

  const nuxtApp = useNuxtApp()

  return match([status.value, data.value?.user.id, to.meta.unauthenticatedOnly, canNavigate(to), to.name])
    .with(['unauthenticated', P.nonNullable, true, P.any, P.any], canGoNext)
    .with(['unauthenticated', P.nonNullable, P.nullish.or(false), P.any, P.not('auth-login')], () => {
      return navigateTo({
        name: 'auth-login',
        query: {
          ...to.query,
          to: to.fullPath !== '/' ? to.path : undefined,
        },
      })
    })
    .with([P.any, P.nullish /* for some reason, this can be nullish, like database failed, etc */, P.any, P.any, P.not('auth-login')], async () => {
      if (status.value === 'authenticated')
        await signOut({ redirect: false })

      // Signing out with await loses the nuxt context, so we run the navigateTo with the context explicitly
      // See explanation here: https://nuxt.com/docs/api/composables/use-nuxt-app#runwithcontext
      return nuxtApp.runWithContext(() => navigateTo({ name: 'auth-login' }))
    })
    .with(['authenticated', P.nonNullable, true, true, P.any], () => {
      return navigateTo('/')
    })
    .with(['authenticated', P.nonNullable, P.any, false, P.any], () => {
      return navigateTo({ name: 'error-not-authorized' })
    })
    .with([P.any, P.any, P.any, P.any, P.any], canGoNext)
    .exhaustive()
})
