export class Node {
    constructor(public val: string, public prev: Node | null = null, public next: Node | null = null) {
        this.val = val;
        this.prev = prev;
        this.next = next;
    }
}