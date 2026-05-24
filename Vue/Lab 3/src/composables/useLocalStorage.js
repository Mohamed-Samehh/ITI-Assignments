import { ref, watch } from 'vue';

export const useLocalStorage = (key, defaultValue) => {
    let initialValue = defaultValue;

    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue !== null) {
            initialValue = JSON.parse(storedValue);
        }
    } catch (err) {
        initialValue = defaultValue;
    }

    const state = ref(initialValue);

    watch(
        state,
        (value) => {
            localStorage.setItem(key, JSON.stringify(value));
        },
        { deep: true }
    );

    return state;
};
