export const useScrollAnimation = () => {
  const observe = (elements: NodeListOf<Element> | Element[]) => {
    if (!process.client) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    elements.forEach((element) => {
      observer.observe(element)
    })
  }

  return { observe }
}
