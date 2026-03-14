import { Node } from "./node";

export class DoublyLinkedList {
    constructor(public head: Node | null = null, public tail: Node | null = null, public length: number = 0) {
        this.head = head;
        this.tail = tail;
        this.length = length;
    }
    rpush(val: string) {
        const newNode = new Node(val);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.prev = this.tail;
            if (this.tail) this.tail.next = newNode;
            this.tail = newNode;
        }
        this.length++;
    }
    lpush(val: string) {
        const newNode = new Node(val);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        }
        else {
            newNode.next = this.head;
            if (this.head) this.head.prev = newNode;
            this.head = newNode;
        }
        this.length++;
    }
    rpop() {
        if (!this.tail) return null;
        const poppedValue = this.tail.val;
        if (this.head === this.tail) {
            this.head = null;
            this.tail = null;
        } else {
            this.tail = this.tail.prev;
            if (this.tail) this.tail.next = null;
        }
        this.length--;
        return poppedValue;
    }
    lpop() {
        if (!this.head) return null;
        const poppedValue = this.head.val;
        if (this.head == this.tail) {
            this.head = null;
            this.tail = null;
        } else {
            this.head = this.head.next;
            if (this.head) this.head.prev = null;
        }
        this.length--;
        return poppedValue;
    }
    lrange(start: number, stop: number) {
        const val: string[] = [];

        if (start < 0) {
            let current = this.head;
            let index = 0;
            while (current) {
                if (index >= this.length + start && index <= this.length + stop) {
                    val.push(current.val);
                }
                current = current.next;
                index++;
            }
        }
        else {
            let current = this.tail;
            let index = this.length - 1;

        }
        return val;
    }
    llen() {
        return this.length;
    }
}