import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'start-video-on-tap',
  schema: {
    uiElement: ecs.eid,
    videoControls: ecs.eid,
  },
  stateMachine: ({world, eid, schemaAttribute, defineState}) => {
    const {uiElement, videoControls} = schemaAttribute.get(eid)

    defineState('waiting')
      .initial()
      .onEvent(ecs.input.UI_CLICK, 'start-video', {target: uiElement})

    defineState('start-video')
      .onEnter(() => {
        ecs.VideoControls.mutate(world, videoControls, (controls) => {
          controls.paused = false
        })
        ecs.Hidden.set(world, uiElement)
      })
  },
})
