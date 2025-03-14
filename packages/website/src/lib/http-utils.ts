import axios from 'axios';
import supabase from '@/lib/supabase';

const ApiUrl = import.meta.env.VITE_PUBLIC_API_URL;

export const UrlParamsReplace = (
    url: string,
    params: Record<string, string> = {},
    queryParams: Record<string, string | number | boolean> = {}
) => {
    let urlWithPrefix = `${ApiUrl}${url}`;
    if (params) {
        Object.keys(params).forEach(
            (key) => (urlWithPrefix = urlWithPrefix.replace(`:${key}`, params[key]))
        );
    }
    const queryParamsWithoutNull: Record<string, string | number | boolean> = {};
    if (queryParams) {
        Object.keys(queryParams).forEach((key) => {
            if (queryParams[key] !== undefined && queryParams[key] !== null) {
                queryParamsWithoutNull[key] = queryParams[key];
            }
        });
        const urlSearchParams = new URLSearchParams(queryParamsWithoutNull as Record<string, string>);
        urlWithPrefix += `?${urlSearchParams.toString()}`;
    }
    return urlWithPrefix;
};

const getAuth = async ()=>{
  const session = await supabase.auth.getSession();
  return {
    token: session.data.session?.access_token
  };
}

export const postWithOutAuth = (url, entity = {}) => new Promise((resolve, _reject) => {
    axios
        .post(url, entity)
        .then((response) => {
            if (response && response.data) {
                resolve(response.data);
            }
        })
        .catch((e) => {
            resolve({
                status: false,
                message: e.message,
                error: { ...e, response: { ...e.response, data: { ...e?.response?.data, ...e?.response?.data?.data } } }
            });
        });
});

export const postWithAuth = async (url, entity = {}, loading = true) => {
    const session = await getAuth();
    const headers = {
        'content-type': 'application/json',
        'Authorization': `bearer ${session.token}`
    };

    return new Promise((resolve, _reject) => {
        axios
            .post(url, entity, { headers })
            .then((response) => {
                if (response && response.data) {
                    resolve(response.data);
                }
            })
            .catch((e) => {
                resolve({
                    status: false,
                    message: e.message,
                    error: {
                        ...e, response: { ...e.response, data: { ...e?.response?.data, ...e?.response?.data?.data } }
                    },
                    errorMessage: e?.response?.data?.message
                });
            });
    });
};

export const getWithOutAuth = (url) => new Promise((resolve, _reject) => {
    axios
        .get(ApiUrl)
        .then((response) => {
            if (response && response.data) {
                resolve(response.data);
            }
        })
        .catch((e) => {
            resolve({
                status: false,
                message: e.message,
                error: {
                    ...e, response: { ...e.response, data: { ...e?.response?.data, ...e?.response?.data?.data } }
                }
            });
        });
});

export const getWithAuth = async (url, loading = true) => {
    const session = await getAuth();
    const headers = {
        'content-type': 'application/json',
        'Authorization': `bearer ${session?.token}`
    };
    return new Promise((resolve, _reject) => {
        axios
            .get(url, { headers })
            .then((response) => {
                if (response && response.data) {
                    resolve(response.data);
                }
            })
            .catch((e) => {
                resolve({
                    status: false,
                    message: e.message,
                    error: {
                        ...e, response: { ...e.response, data: { ...e?.response?.data, ...e?.response?.data?.data } }
                    }
                });
            });
    });
};

export const putWithOutAuth = (url, entity = {}) => new Promise((resolve, reject) => {
    axios.put(url, entity).then((response) => {
        if (response && response.data) {
            resolve(response.data);
        }
    }).catch((e) => {
        resolve({
            status: false,
            message: e.message,
            error: { ...e, response: { ...e.response, data: { ...e?.response?.data, ...e?.response?.data?.data } } }
        });
    });
});

export const putWithAuth = async (url, entity = {}) => {
    const session = await getAuth();
    const headers = {
        'content-type': 'application/json',
        'Authorization': `bearer ${session.token}`
    };

    return new Promise((resolve, reject) => {
        axios.put(url, entity, { headers }).then((response) => {
            if (response && response.data) {
                resolve(response.data);
            }
        }).catch((e) => {
            resolve({
                status: false,
                message: e.message,
                error: { ...e, response: { ...e.response, data: { ...e?.response?.data, ...e?.response?.data?.data } } },
                errorMessage: e?.response?.data?.message
            });
        });
    });
};

export const deleteWithAuth = async (url) => {
    const session = await getAuth();

    const headers = {
        'content-type': 'application/json',
        'Authorization': `bearer ${session.token}`
    };

    return new Promise((resolve, _reject) => {
        axios
            .delete(url, { headers })
            .then((response) => {
                if (response && response.data) {
                    resolve(response.data);
                }
            })
            .catch((e) => {
                resolve({
                    status: false,
                    message: e.message,
                    error: { ...e, response: { ...e.response, data: { ...e?.response?.data, ...e?.response?.data?.data } } }
                });
            });
    });
};

export const deleteWithOutAuth = (url) => new Promise((resolve, _reject) => {
    axios
        .delete(ApiUrl)
        .then((response) => {
            if (response && response.data) {
                resolve(response.data);
            }
        })
        .catch((e) => {
            resolve({
                status: false,
                message: e.message,
                error: { ...e, response: { ...e.response, data: { ...e?.response?.data, ...e?.response?.data?.data } } }
            });
        });
});

