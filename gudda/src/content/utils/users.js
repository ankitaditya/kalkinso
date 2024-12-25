import axios from 'axios';

export const register = async ({email, first_name, last_name}) => {
    const config = {
		headers: {
			'Content-Type': 'application/json',
		},
        baseURL: 'https://www.kalkinso.com',
	}
	const body = JSON.stringify({ first_name, last_name, email, mobile: "", upi: "", adhar: "", terms_conditions: true, password: "", user_role: "" })
    try {
        const res = await axios.post('/api/users', body, config)
        console.log(res.data)
        return res.data
    } catch (err) {
        console.error(err)
        return { error: err }
    }
}