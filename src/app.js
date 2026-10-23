

// Keep Vimeo MP4s as remote media sources. The default asset loader fetches
// the complete file into a Blob before constructing its video texture.
const loadAsset = ecs.assets.load.bind(ecs.assets)
ecs.assets.load = (request) => {
  let url
  try { url = new URL(request.url) } catch (_) { return loadAsset(request) }
  if (url.hostname === 'player.vimeo.com' &&
      url.pathname.startsWith('/progressive_redirect/playback/') &&
      /\.mp4$/i.test(url.pathname)) {
    return Promise.resolve({
      data: new Blob([], {type: 'video/mp4'}),
      remoteUrl: request.url,
      localUrl: request.url,
    })
  }
  return loadAsset(request)
}

const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [
      require('../image-targets/logoICcubo.json'),
      require('../image-targets/tavolo_image_target.json'),
    ],
  })
  XR8.addCameraPipelineModule(LandingPage.pipelineModule())
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)

