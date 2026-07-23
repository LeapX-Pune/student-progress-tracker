export const ANIMATION_CLASSES = {
  fadeIn: 'anim-fade-in',
  slideUp: 'anim-slide-up',
  slideDown: 'anim-slide-down',
  slideInRight: 'anim-slide-in-right',
  slideInLeft: 'anim-slide-in-left',
  scaleIn: 'anim-scale-in',
  pulse: 'anim-pulse',
  shimmer: 'skeleton-shimmer',
}

export function animate(el, animation, options = {}) {
  const { duration = 300, delay = 0, fill = 'forwards', onEnd } = options

  el.classList.add(animation)

  if (duration !== 300) el.style.animationDuration = `${duration}ms`
  if (delay > 0) el.style.animationDelay = `${delay}ms`

  const handler = (e) => {
    e.target.classList.remove(animation)
    el.style.animationDuration = ''
    el.style.animationDelay = ''
    if (onEnd) onEnd(e)
    el.removeEventListener('animationend', handler)
  }

  el.addEventListener('animationend', handler, { once: true })
}

export function stagger(el, animation, { staggerDelay = 50, ...rest } = {}) {
  const children = Array.from(el.children)
  children.forEach((child, i) => {
    animate(child, animation, { delay: i * staggerDelay, ...rest })
  })
}

let prefersReducedMotion = false

export function initMotionPreferences() {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion = mq.matches

  mq.addEventListener('change', (e) => {
    prefersReducedMotion = e.matches
    document.documentElement.classList.toggle('reduced-motion', e.matches)
  })

  document.documentElement.classList.toggle('reduced-motion', prefersReducedMotion)
}

export function shouldAnimate() {
  return !prefersReducedMotion
}
