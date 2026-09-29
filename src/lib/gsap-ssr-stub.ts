/**
 * SSR stand-in for GSAP. The real library starts a timer at import time,
 * which Cloudflare Workers reject outside a request handler.
 * Animations still run from the client bundle.
 */
function chain(): CallableFunction {
  const fn = function chainFn() {
    return proxy;
  };
  const proxy = new Proxy(fn, {
    get(_target, prop) {
      if (prop === 'then') return undefined;
      return proxy;
    },
    apply() {
      return proxy;
    },
  });
  return proxy;
}

const gsap = chain();

export default gsap;
export const ScrollTrigger = gsap;
export const SplitText = gsap;
export const useGSAP = gsap;
