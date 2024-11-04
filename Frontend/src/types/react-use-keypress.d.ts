declare module "react-use-keypress" {
  export default function useKeypress(
    key: string[],
    callback: (e: KeyboardEvent) => void
  ): void;
}
