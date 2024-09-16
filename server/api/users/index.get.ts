import { useUserCrud } from '~/server/composables/useUserCrud'

export default defineEventHandler(async (event) => {
  try {
    await defineEventOptions(event, { auth: true })

    const { getUsersPaginated } = useUserCrud()

    const response = await getUsersPaginated(getFilter(event))

    setResponseStatus(event, 200)

    return response
  }
  catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }
})
