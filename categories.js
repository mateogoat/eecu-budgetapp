/**
 * @template {string} T
 */
class Category {
    /** @type {Map<T, Input>} */
    inputs = new Map();
    name;
    /**
     * @param {string} name
     * @param {Array<Input & { name: T }>} inputs
     */
    constructor(name, ...inputs) {
        this.name = name;
        for (const input of inputs) {
            input.setCategory(name);
            this.inputs.set(input.name, input);
        }
    }
}

const SPENDING = 1 << 1;
const EARNING = 1 << 2;

// 
class Input {
    #flags = 0;
    get spending() {
        return (this.#flags & SPENDING) !== 0;
    }
    set spending(value) {
        if (value) {
            this.#flags |= SPENDING;
        } else {
            this.#flags &= ~SPENDING;
        }
    }
    get earning() {
        return (this.#flags & EARNING) !== 0;
    }
    set earning(value) {
        if (value) {
            this.#flags |= EARNING;
        } else {
            this.#flags &= ~EARNING;
        }
    }
    name;
    #element_getter;
    #storageKey = '';
    #cachedValue = 0;

    static storagePrefix = 'eecu-budget:';

    static #normalizeToken(value) {
        return value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    static #asNumber(value) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    #saveToStorage(value) {
        if (!this.#storageKey) {
            return;
        }
        localStorage.setItem(this.#storageKey, String(value));
    }

    #readFromStorage() {
        if (!this.#storageKey) {
            return 0;
        }
        return Input.#asNumber(localStorage.getItem(this.#storageKey));
    }

    setCategory(categoryName) {
        this.#storageKey =
            Input.storagePrefix +
            Input.#normalizeToken(categoryName) +
            ':' +
            Input.#normalizeToken(this.name);
        this.#cachedValue = this.#readFromStorage();
    }

    syncElementFromStorage() {
        const el = this.#element_getter();
        if (!el) {
            return;
        }
        const storedValue = this.#readFromStorage();
        this.#cachedValue = storedValue;
        el.value = String(storedValue);
    }

    get value() {
        const el = this.#element_getter();
        if (el) {
            this.#cachedValue = Input.#asNumber(el.value);
            this.#saveToStorage(this.#cachedValue);
        } else {
            this.#cachedValue = this.#readFromStorage();
        }
        return this.#cachedValue;
    }

    /**
     * @param {{ name: string; spending?: boolean; earning?: boolean; }} config
     */
    constructor({
        name,
        spending = false,
        earning = false
    }) {
        this.name = name;
        this.spending = spending;
        this.earning = earning;
        this.#element_getter = () =>
            document.querySelector(
                '#' + name.toLowerCase().replace(/^[0-9]/, m => `x-${m}`).replace(/'s/g, '').replace(/ /g, '-').replace(/&/g, 'and') + '-input'
            );
    }
}

const education = new Category(
    'Education',
    new Input({
        name: 'Monthly Tuition',
        spending: true
    }),
    new Input({
        name: 'Books & Supplies',
        spending: true
    }),
    new Input({
        name: 'Dorm & Board',
        spending: true
    }),
    new Input({
        name: 'Other Expenses',
        spending: true
    })
);

const housing = new Category(
    'Housing',
    new Input({
        name: 'Rent Payment',
        spending: true
    }),
    new Input({
        name: 'Utilities',
        spending: true
    }),
    new Input({
        name: 'Renter\'s Insurance',
        spending: true
    }),
    new Input({
        name: 'Other Expenses',
        spending: true
    })
);

const essentials = new Category(
    'Essentials',
    new Input({
        name: 'Groceries',
        spending: true
    }),
    new Input({
        name: 'Car Insurance',
        spending: true
    }),
    new Input({
        name: 'Medical Insurance',
        spending: true
    }),
    new Input({
        name: 'Clothing',
        spending: true
    }),
    new Input({
        name: 'Other Expenses',
        spending: true
    })
);

const lifestyle = new Category(
    'Lifestyle',
    new Input({
        name: 'Dining Out',
        spending: true
    }),
    new Input({
        name: 'Streaming Services',
        spending: true
    }),
    new Input({
        name: 'Gym Membership',
        spending: true
    }),
    new Input({
        name: 'Gaming',
        spending: true
    }),
    new Input({
        name: 'Other Expenses',
        spending: true
    })
);

const future_proofing = new Category(
    'Future Proofing',
    new Input({
        name: '401K & IRA',
        spending: true
    }),
    new Input({
        name: 'Investments',
        spending: true
    }),
    new Input({
        name: 'Savings',
        spending: true
    }),
    new Input({
        name: 'Retirement Funds',
        spending: true
    }),
    new Input({
        name: 'Other Expenses',
        spending: true
    })
);

export const categories = [
    education,
    housing,
    essentials,
    lifestyle,
    future_proofing
];