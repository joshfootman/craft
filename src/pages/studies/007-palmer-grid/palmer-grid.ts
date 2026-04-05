import gsap from 'gsap'
import Draggable from "gsap/src/Draggable";

gsap.registerPlugin(Draggable);

export class PalmerDraggableGrid {
  #container: HTMLElement | null;
  #grid: HTMLElement | null;
  #products: Array<HTMLElement>

  #draggable: Draggable | null
  #observer: IntersectionObserver | null
  #introTimeline: gsap.core.Timeline | null

  #onScroll: (evt: WheelEvent) => void

  #isObserverPaused: boolean;
  #ready: boolean;

  #destroyed: boolean

  constructor() {
    this.#container = null;
    this.#grid = null
    this.#products = []

    this.#draggable = null
    this.#observer = null
    this.#introTimeline = null

    this.#onScroll = (evt) => {
      if (!this.#grid || !this.#draggable) return;
      evt.preventDefault();

      const deltaX = -evt.deltaX * 7;
      const deltaY = -evt.deltaY * 7;

      const currentX = Number(gsap.getProperty(this.#grid, "x"))
      const currentY = Number(gsap.getProperty(this.#grid, "y"))

      const newX = currentX + deltaX
      const newY = currentY + deltaY

      const bounds = this.#draggable.vars.bounds as Draggable.BoundsMinMax
      const clampedX = Math.max(bounds.minX ?? 0, Math.min(bounds.maxX ?? 0, newX))
      const clampedY = Math.max(bounds.minY ?? 0, Math.min(bounds.maxY ?? 0, newY))

      gsap.to(this.#grid, {
        x: clampedX,
        y: clampedY,
        duration: 0.3,
        ease: "power3.out"
      })
    }

    this.#isObserverPaused = false
    this.#ready = false

    this.#destroyed = false
  }

  init() {
    this.#destroyed = false
    this.#container = document.querySelector('[data-slot="container"]')
    this.#grid = document.querySelector('[data-slot="grid"]')
    this.#products = Array.from(document.querySelectorAll('[data-slot="product"]'))

    this.#validateDOM();
    this.#centreGrid();
    this.#introAnimation().then(() => {
      if (this.#destroyed) return
      this.#ready = true;

      this.#setupDraggable();
      this.#addEventListeners();
      this.#observeProducts();
    });
  }

  destroy() {
    this.#destroyed = true
    this.#ready = false

    this.#introTimeline?.kill()
    this.#observer?.disconnect()
    this.#draggable?.kill()
    this.#removeEventListeners()

    gsap.killTweensOf(this.#grid)
    gsap.killTweensOf(this.#products)

    this.#introTimeline = null
    this.#observer = null
    this.#draggable = null
    this.#isObserverPaused = false
  }

  #validateDOM() {
    if (this.#container == null) throw new Error('PalmerContainer not found.')
    if (this.#grid == null) throw new Error('PalmerGrid not found.')
    if (this.#products.length == 0) throw new Error(`No PalmerGridProduct's found.`)
  }

  #centreGrid() {
    const gridWidth = this.#grid?.offsetWidth ?? 0;
    const gridHeight = this.#grid?.offsetHeight ?? 0;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const centerX = (windowWidth - gridWidth) / 2;
    const centerY = (windowHeight - gridHeight) / 2;
    gsap.set(this.#grid, {
      x: centerX,
      y: centerY,
    });
  }

  #introAnimation() {
    const timeline = gsap.timeline();
    this.#introTimeline = timeline
    timeline.set(this.#container, { scale: 0.5 });
    timeline.set(this.#products, { scale: 0.5, opacity: 0 });
    timeline.to(this.#products, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
      stagger: { amount: 1.2, from: "random" },
    });
    timeline.to(this.#container, { scale: 1, duration: 1.2, ease: "power3.inOut" });
    return new Promise((resolve) => timeline.eventCallback('onComplete', resolve))
  }

  #setupDraggable() {
    this.#draggable = Draggable.create(this.#grid, {
      type: "x,y",
      bounds: {
        minX: -((this.#grid?.offsetWidth ?? 0) - window.innerWidth) - 200,
        maxX: 200,
        minY: -((this.#grid?.offsetHeight ?? 0) - window.innerHeight) - 100,
        maxY: 100
      },
      inertia: true,
      allowEventDefault: true,
      edgeResistance: 0.9,
    })[0];
  }

  #addEventListeners() {
    window.addEventListener('wheel', this.#onScroll, { passive: false })
  }

  #removeEventListeners() {
    window.removeEventListener('wheel', this.#onScroll)
  }

  #observeProducts() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (this.#isObserverPaused) return

        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
          })
        } else {
          gsap.to(entry.target, {
            opacity: 0,
            scale: 0.5,
            duration: 0.5,
            ease: "power2.in"
          })
        }
      })
    }, {
      root: null,
      threshold: 0.1
    })
    this.#observer = observer

    this.#products.forEach(product => {
      observer.observe(product)
    })
  }

  pauseObserver() {
    this.#isObserverPaused = true;
  }

  resumeObserver() {
    this.#isObserverPaused = false;
  }

  isIntroComplete() {
    return this.#ready == true
  }
}
