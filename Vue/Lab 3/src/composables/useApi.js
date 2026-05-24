import { ref } from 'vue';

export const useApi = (baseUrl) => {
    const data = ref(null);
    const error = ref('');
    const loading = ref(false);

    const request = async (url, options = {}) => {
        loading.value = true;
        error.value = '';

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
            }

            const json = await response.json();
            data.value = json;
            return json;
        } catch (err) {
            error.value = err?.message || 'Unexpected error';
            return null;
        } finally {
            loading.value = false;
        }
    };

    const getAll = () => request(baseUrl);

    const getOne = (id) => request(`${baseUrl}/${id}`);

    const update = (item) =>
        request(`${baseUrl}/${item.id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item),
            }
        );

    return {
        data,
        error,
        loading,
        getAll,
        getOne,
        update,
    };
};
