import axios from 'axios';

export const register = async ({email, first_name, last_name}) => {
    const config = {
		headers: {
			'Content-Type': 'application/json',
		},
        baseURL: 'https://www.kalkinso.com',
	}
	const body = JSON.stringify({ first_name, last_name, email, mobile: null, upi: null, adhar: null, terms_conditions: true, password: null, user_role: null })
    try {
        const res = await axios.post('/api/users', body, config)
        return res.data
    } catch (err) {
        return { error: err }
    }
}