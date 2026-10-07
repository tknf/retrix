import type { Child } from "hono/jsx";
import { Button, type ButtonProps } from "./button";
import { Icon } from "./icon";

export const overlayAnchorName = (kind: "popover" | "hover-card" | "tooltip", id: string) =>
  `--rx-${kind}-${id
    .split("")
    .map((character) => character.charCodeAt(0).toString(16))
    .join("-")}`;

type OverlayCloseProps = Omit<ButtonProps, "children" | "variant" | "size"> & {
  label: string;
};

export const OverlayClose = ({ label, ...attributes }: OverlayCloseProps) => (
  <span class="close">
    <Button {...attributes} variant="primary" data-icon-only="true" aria-label={label}>
      <Icon name="x" />
    </Button>
  </span>
);

export const OverlayContent = ({
  title,
  description,
  close,
  actions,
  children,
}: {
  title: Child;
  description?: Child;
  close: Child;
  actions?: Child;
  children?: Child;
}) => (
  <>
    <header class="heading">
      <div class="heading-row">
        {title}
        {close}
      </div>
      {description}
    </header>
    <div class="body">{children}</div>
    {actions != null && actions !== false && <footer class="actions">{actions}</footer>}
  </>
);
