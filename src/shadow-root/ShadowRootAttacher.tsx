import { Component, JSX, onMount } from "solid-js";
import { render } from "solid-js/web";

import {
  adoptStyle,
  createStyleProviderFromCSSText,
  StyleProvider,
} from "./style-provider";

const hostAllInitial = createStyleProviderFromCSSText(":host{all:initial}");

const ShadowRootAttacher: Component<{
  mode?: ShadowRootMode;
  styleProviders?: StyleProvider[];

  hostStyle?: string | JSX.CSSProperties;
  preventHostStyleInheritance?: boolean;

  children: JSX.Element;
  onMount?: (opts: { host: HTMLElement }) => void;
}> = (props) => {
  let hostEl!: HTMLDivElement;

  onMount(() => {
    const shadowRoot = hostEl.attachShadow({ mode: props.mode ?? "open" });

    if (props.preventHostStyleInheritance) {
      adoptStyle(shadowRoot, hostAllInitial);
    }
    if (props.styleProviders) {
      for (const p of props.styleProviders) {
        adoptStyle(shadowRoot, p);
      }
    }

    render(() => {
      if (props.onMount) {
        onMount(() => props.onMount!({ host: hostEl }));
      }
      return props.children;
    }, shadowRoot);
  });

  return <div ref={hostEl} style={props.hostStyle} />;
};

export default ShadowRootAttacher;
