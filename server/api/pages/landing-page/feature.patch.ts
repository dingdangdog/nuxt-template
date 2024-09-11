import { getLandingPageId } from './landingPageID.get'
import type { FeatureSectionType } from '~/utils/types/landing-page'

export default defineEventHandler(async (event) => {
  const featureReqData = await readBody<FeatureSectionType>(event)

  const landingPageId = await getLandingPageId()

  const { error } = await supabaseAdmin
    .from('sys_landing_page')
    .update({
      feature_title: featureReqData.feature_title,
      feature_title_desc: featureReqData.feature_title_desc,
      feature_data: featureReqData.feature_data,
    })
    .match({ id: landingPageId })

  if (error)
    setResponseStatus(event, 400, error.message)
  else
    setResponseStatus(event, 201)

  return { success: true, status: 201 }
})
