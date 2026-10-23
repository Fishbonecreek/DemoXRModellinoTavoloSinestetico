import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'start-animation-on-tracking-image-found',
  schema: {
    imageTarget: ecs.eid,
    positionAnimation: ecs.eid,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const {imageTarget, positionAnimation} = schemaAttribute.get(eid)
    const imageTargetName = ecs.ImageTarget.get(world, imageTarget).name
    console.log("image target name:", imageTargetName)
    const animationConfig = {...ecs.PositionAnimation.get(world, positionAnimation)}
    console.log("animation config:", animationConfig)

    // PositionAnimation has no pause control, so defer adding it until the target is found.
    ecs.PositionAnimation.remove(world, positionAnimation)

    let started = false

    ecs.defineState('waiting')
      .initial()
      .listen(world.events.globalId, 'reality.imagefound', (event) => {
        const {name} = event.data as {name: string}

        if (!started && name === imageTargetName) {
          console.log("adding animation")

          started = true
          ecs.PositionAnimation.set(world, positionAnimation, animationConfig)
        }
      })
  },
})
