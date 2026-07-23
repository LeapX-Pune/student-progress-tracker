let tooltipIdCounter = 0

export function createTooltip(triggerEl, { content, position = 'top', delay = 200 } = {}) {
  const tooltipId = `tooltip-${++tooltipIdCounter}`
  const wrapper = document.createElement('span')
  wrapper.className = 'tooltip-wrapper'
  triggerEl.parentNode.insertBefore(wrapper, triggerEl)
  wrapper.appendChild(triggerEl)

  triggerEl.setAttribute('aria-describedby', tooltipId)

  const tooltip = document.createElement('span')
  tooltip.className = `tooltip tooltip--${position}`
  tooltip.setAttribute('role', 'tooltip')
  tooltip.id = tooltipId
  tooltip.textContent = content
  document.body.appendChild(tooltip)

  let showTimeout = null
  let hideTimeout = null

  function show() {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }

    showTimeout = setTimeout(() => {
      positionTooltip()
      tooltip.classList.add('tooltip--visible')
    }, delay)
  }

  function hide() {
    if (showTimeout) {
      clearTimeout(showTimeout)
      showTimeout = null
    }

    hideTimeout = setTimeout(() => {
      tooltip.classList.remove('tooltip--visible')
    }, 100)
  }

  function positionTooltip() {
    const triggerRect = triggerEl.getBoundingClientRect()
    const tooltipRect = tooltip.getBoundingClientRect()
    const gap = 8

    let top, left

    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - gap
        left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
        break
      case 'bottom':
        top = triggerRect.bottom + gap
        left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
        break
      case 'left':
        top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
        left = triggerRect.left - tooltipRect.width - gap
        break
      case 'right':
        top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
        left = triggerRect.right + gap
        break
    }

    const padding = 8
    if (left < padding) left = padding
    if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding
    }
    if (top < padding) top = padding
    if (top + tooltipRect.height > window.innerHeight - padding) {
      top = window.innerHeight - tooltipRect.height - padding
    }

    tooltip.style.top = `${top}px`
    tooltip.style.left = `${left}px`
  }

  triggerEl.addEventListener('mouseenter', show)
  triggerEl.addEventListener('mouseleave', hide)
  triggerEl.addEventListener('focus', show)
  triggerEl.addEventListener('blur', hide)

  return {
    destroy: () => {
      triggerEl.removeEventListener('mouseenter', show)
      triggerEl.removeEventListener('mouseleave', hide)
      triggerEl.removeEventListener('focus', show)
      triggerEl.removeEventListener('blur', hide)
      tooltip.remove()
    },
    update: (newContent) => {
      tooltip.textContent = newContent
    },
  }
}
