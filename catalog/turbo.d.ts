// Turbo 8は型を同梱しないので、カタログで使う分だけを宣言する。
declare module "@hotwired/turbo" {
  export const visit: (location: string) => void;
}
