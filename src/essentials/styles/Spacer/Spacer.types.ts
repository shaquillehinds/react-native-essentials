export type Spaces = [number, number?, number?, number?];
export type Spacing = {
  /**
   * @description This padding shorthand follows the classic css padding shorthand.
   * The numbers passed are used as percentages of either the screen width or height.
   * - [10] = {top: 10%, right: 10%, bottom: 10%, left: 10%}
   * - [10, 20] = {top: 10%, right: 20%, bottom: 10%, left: 20%}
   * - [10, 20, 30] = {top: 10%, right: 20%, bottom: 30%, left: 20%}
   * - [10, 20, 30, 40] = {top: 10%, right: 20%, bottom: 30%, left: 40%}
   */
  padding?: Spaces;
  /**
   * @description This margin shorthand follows the classic css margin shorthand.
   * The numbers passed are used as percentages of either the screen width or height.
   * - [10] = {top: 10%, right: 10%, bottom: 10%, left: 10%}
   * - [10, 20] = {top: 10%, right: 20%, bottom: 10%, left: 20%}
   * - [10, 20, 30] = {top: 10%, right: 20%, bottom: 30%, left: 20%}
   * - [10, 20, 30, 40] = {top: 10%, right: 20%, bottom: 30%, left: 40%}
   */
  margin?: Spaces;
};
