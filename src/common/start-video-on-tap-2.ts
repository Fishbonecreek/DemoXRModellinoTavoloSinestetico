import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'start-video-on-tap-2',
  schema: {
    uiElement: ecs.eid,
    videoUrl: ecs.string,
    videoControls: ecs.eid,
    uiElementToHide: ecs.eid,
  },
  stateMachine: ({world, eid, schemaAttribute, defineState}) => {
    const {uiElement, videoUrl, videoControls, uiElementToHide} = schemaAttribute.get(eid)

    defineState('waiting')
      .initial()
      .onEvent(ecs.input.UI_CLICK, 'start-video', {target: uiElement})

    defineState('start-video')
      .onEnter(() => {
        ecs.VideoMaterial.mutate(world, videoControls, (material) => {
          material.textureSrc = videoUrl
        })
        ecs.VideoControls.mutate(world, videoControls, (controls) => {
          controls.paused = false
        })
        ecs.Hidden.set(world, uiElementToHide)
      })
  },
})
