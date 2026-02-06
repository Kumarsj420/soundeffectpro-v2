import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useDismiss,
  useInteractions,
} from "@floating-ui/react";

export function useDropdown(
  id: string,
  openDropdown: string | null,
  setOpenDropdown: (id: string | null) => void
) {
  const open = openDropdown === id;

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: (isOpen) => setOpenDropdown(isOpen ? id : null),
    middleware: [offset(14), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement: "bottom-end",
  });

  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } =
    useInteractions([dismiss]);

  const toggle = () =>
    setOpenDropdown(open ? null : id);

  const close = () => setOpenDropdown(null);

  return {
    open,
    refs,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
    toggle,
    close,
  };
}
