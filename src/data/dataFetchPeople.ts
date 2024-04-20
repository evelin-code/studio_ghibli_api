export const getPeople = async (url: string) => {
	try {
		const people = await fetch(url).then((response) => response.json());
		return people;
	} catch (error) {
		console.error(error);
	}
};
