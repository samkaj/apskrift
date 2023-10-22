/**
 * Scrolls the content of an element, one line at a time.
 * @param elementId The id of the element to scroll.
 */
export default class Scroller {
    private position: number = 0;
    private offset: number;
    private elementToScroll: HTMLElement | null;

    constructor(elementId: string) {
        this.elementToScroll = document.getElementById(elementId);
        this.offset = this.size();
    }

    up() {
        this.position = Math.max(this.position - this.offset, 0);
        this.scroll();
    }

    down() {
        this.position += this.offset;
        this.scroll();
    }

    top() {
        this.position = 0;
        this.scroll();
    }

    private scroll() {
        this.elementToScroll?.scrollTo({
            top: this.position,
            behavior: "smooth",
        });
    }

    private size(): number {
        if (this.elementToScroll) {
            return parseFloat(
                window
                    .getComputedStyle(this.elementToScroll)
                    .getPropertyValue("line-height")
            );
        }
        return 0;
    }
}
